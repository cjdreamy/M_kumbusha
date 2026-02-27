import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const AFRICASTALKING_API_KEY = Deno.env.get('AFRICASTALKING_API_KEY') || '';
const AFRICASTALKING_USERNAME = Deno.env.get('AFRICASTALKING_USERNAME') || '';

interface SMSRequest {
  to: string;
  message: string;
  elderlyId: string;
  caregiverId: string;
  reminderId?: string;
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
    const { to, message, elderlyId, caregiverId, reminderId }: SMSRequest = await req.json();

    if (!to || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, message' }),
        { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // Send SMS via Africa's Talking
    const smsResponse = await fetch('https://api.africastalking.com/version1/messaging', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'apiKey': AFRICASTALKING_API_KEY,
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        username: AFRICASTALKING_USERNAME,
        to: to,
        message: message,
      }),
    });

    const smsData = await smsResponse.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Determine status based on response
    const status = smsData.SMSMessageData?.Recipients?.[0]?.status === 'Success' ? 'sent' : 'failed';
    const errorMessage = smsData.SMSMessageData?.Recipients?.[0]?.status !== 'Success' 
      ? smsData.SMSMessageData?.Recipients?.[0]?.status 
      : null;

    // Log the SMS attempt
    await supabase.from('reminder_logs').insert({
      reminder_id: reminderId || null,
      elderly_id: elderlyId,
      caregiver_id: caregiverId,
      channel: 'sms',
      status: status,
      message: message,
      error_message: errorMessage,
      sent_at: new Date().toISOString(),
    });

    // Update reminder status if reminderId provided
    if (reminderId) {
      await supabase
        .from('reminders')
        .update({ status: status })
        .eq('id', reminderId);
    }

    return new Response(
      JSON.stringify({ 
        success: status === 'sent',
        status: status,
        data: smsData,
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } 
      }
    );

  } catch (error) {
    console.error('SMS sending error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }
});
