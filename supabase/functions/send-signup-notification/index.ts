import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

// NOTE: This function is intended to be invoked directly after successful user signup.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', 
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
// Update fallback to use production sender details
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'Lovable Media Network <info@mediaboosterai.pro>'; 
// Read owner's email from environment variable, fallback to production owner
const OWNER_EMAIL = Deno.env.get('OWNER_EMAIL') ?? 'missiondrivenbrand@gmail.com'; 

serve(async (req) => {
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Check if Resend API Key is configured
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is not set.');
    }
    // Check if Owner email is configured
    if (!OWNER_EMAIL) {
      throw new Error('OWNER_EMAIL environment variable is not set.');
    }

    // Get user details directly from the request body
    const { newUserEmail, newUserId } = await req.json();

    if (!newUserEmail || !newUserId) {
        throw new Error('Missing newUserEmail or newUserId in request body.');
    }

    console.log(`Sending signup notification for new user: ${newUserEmail} (ID: ${newUserId})`);

    const resend = new Resend(RESEND_API_KEY);

    const emailResponse = await resend.emails.send({
      from: FROM_EMAIL,
      to: [OWNER_EMAIL], // Send to the owner
      subject: 'New User Signup on Lovable Media Network',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h1>New User Signed Up!</h1>
          <p>A new user has registered on the platform:</p>
          <ul>
            <li><strong>Email:</strong> ${newUserEmail}</li>
            <li><strong>User ID:</strong> ${newUserId}</li>
          </ul>
          <p>You can view user details in your Supabase dashboard.</p>
        </div>
      `,
    });

    console.log('Owner signup notification sent successfully:', emailResponse);

    // Return success response
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error sending owner signup notification:', error);
    // Return error response 
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500, // Return 500 on actual error
    });
  }
}); 