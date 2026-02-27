import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

interface ConfirmReminderRequest {
  reminderId: string;
  confirmed: boolean;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const { reminderId, confirmed }: ConfirmReminderRequest = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get reminder details
    const { data: reminder } = await supabase
      .from('reminders')
      .select('*, elderly(*), schedule:schedules(*)')
      .eq('id', reminderId)
      .single();

    if (!reminder) {
      return new Response(
        JSON.stringify({ error: 'Reminder not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const newStatus = confirmed ? 'confirmed' : 'missed';

    // Update reminder status
    await supabase
      .from('reminders')
      .update({ status: newStatus })
      .eq('id', reminderId);

    // Log the confirmation
    await supabase.from('reminder_logs').insert({
      reminder_id: reminderId,
      elderly_id: reminder.elderly_id,
      caregiver_id: reminder.elderly.caregiver_id,
      channel: reminder.schedule.channel,
      status: newStatus,
      message: confirmed ? 'Reminder confirmed by user' : 'Reminder marked as missed',
      confirmed_at: confirmed ? new Date().toISOString() : null,
    });

    // If missed, send escalation to secondary contact
    if (!confirmed && reminder.elderly.secondary_contact) {
      const escalationMessage = `Alert: ${reminder.elderly.full_name} missed their reminder: ${reminder.schedule.title}. Please check on them.`;
      
      // Send SMS to secondary contact
      await supabase.functions.invoke('send-sms', {
        body: {
          to: reminder.elderly.secondary_contact,
          message: escalationMessage,
          elderlyId: reminder.elderly_id,
          caregiverId: reminder.elderly.caregiver_id,
          reminderId: reminderId,
        },
      });

      // Also notify caregiver if they have a notification forwarding number
      const { data: caregiver } = await supabase
        .from('profiles')
        .select('notification_forwarding_number')
        .eq('id', reminder.elderly.caregiver_id)
        .single();

      if (caregiver?.notification_forwarding_number) {
        await supabase.functions.invoke('send-sms', {
          body: {
            to: caregiver.notification_forwarding_number,
            message: escalationMessage,
            elderlyId: reminder.elderly_id,
            caregiverId: reminder.elderly.caregiver_id,
            reminderId: reminderId,
          },
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        status: newStatus,
        escalated: !confirmed && !!reminder.elderly.secondary_contact,
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } 
      }
    );

  } catch (error) {
    console.error('Confirm reminder error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }
});
