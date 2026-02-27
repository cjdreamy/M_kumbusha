import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const AFRICASTALKING_API_KEY = Deno.env.get('AFRICASTALKING_API_KEY') || '';
const AFRICASTALKING_USERNAME = Deno.env.get('AFRICASTALKING_USERNAME') || '';

interface VoiceRequest {
  to: string;
  message: string;
  language: 'english' | 'kiswahili';
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
    const { to, message, language, elderlyId, caregiverId, reminderId }: VoiceRequest = await req.json();

    if (!to || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, message' }),
        { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // Make voice call via Africa's Talking
    const voiceResponse = await fetch('https://api.africastalking.com/version1/call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'apiKey': AFRICASTALKING_API_KEY,
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        username: AFRICASTALKING_USERNAME,
        to: to,
        from: '', // Your Africa's Talking phone number
      }),
    });

    const voiceData = await voiceResponse.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Determine status based on response
    const status = voiceData.entries?.[0]?.status === 'Queued' ? 'sent' : 'failed';
    const errorMessage = voiceData.entries?.[0]?.status !== 'Queued' 
      ? voiceData.errorMessage || 'Call failed'
      : null;

    // Log the voice call attempt
    await supabase.from('reminder_logs').insert({
      reminder_id: reminderId || null,
      elderly_id: elderlyId,
      caregiver_id: caregiverId,
      channel: 'voice',
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
        data: voiceData,
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } 
      }
    );

  } catch (error) {
    console.error('Voice call error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }
});
