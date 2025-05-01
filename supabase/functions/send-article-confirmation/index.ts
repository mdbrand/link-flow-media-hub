import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
// Assuming you have the app's base URL in an env var for links
const APP_URL = Deno.env.get('APP_URL') ?? 'http://localhost:3000'; 
// Update fallback to use production sender details
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'Lovable Media Network <info@mediaboosterai.pro>'; 

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is not set.');
    }

    const { userEmail, articleTitle } = await req.json();
    console.log(`Sending article submission confirmation to: ${userEmail} for article: ${articleTitle}`);

    if (!userEmail || !articleTitle) {
      throw new Error('Missing userEmail or articleTitle in request body.');
    }

    const resend = new Resend(RESEND_API_KEY);

    const signInLink = `${APP_URL}/signin`;
    const submissionsLink = `${APP_URL}/submissions`;

    const emailResponse = await resend.emails.send({
      from: FROM_EMAIL,
      to: [userEmail],
      subject: `Your Article "${articleTitle}" Has Been Submitted!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Article Submission Confirmed</h1>
          <p>Thank you for submitting your article titled "<strong>${articleTitle}</strong>".</p>
          <p>Our team will review it shortly.</p>
          <p>You can view the status of your submissions here:</p>
          <p><a href="${submissionsLink}" style="display: inline-block; padding: 10px 20px; background-color: #8B5CF6; color: white; text-decoration: none; border-radius: 5px;">View My Submissions</a></p>
          <p>If you're logged out, you can sign in again:</p>
          <p><a href="${signInLink}">Sign In</a></p>
          <br>
          <p style="color: #6B7280; font-size: 14px;">Best regards,<br>The Lovable Team</p>
        </div>
      `,
    });

    console.log('Article confirmation email sent successfully:', emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error sending article confirmation email:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}); 