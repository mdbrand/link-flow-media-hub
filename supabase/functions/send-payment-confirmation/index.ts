
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email, planName } = await req.json()
    console.log('Sending confirmation email to:', email, 'for plan:', planName)

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

    const emailResponse = await resend.emails.send({
      from: 'Lovable <onboarding@resend.dev>',
      to: [email],
      subject: 'Your Purchase Was Successful!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B5CF6;">Thank you for your purchase!</h1>
          <p>We're excited to confirm that your payment for the ${planName} plan was successful.</p>
          <p>Your articles will be published on premium media sites, helping you establish a strong online presence.</p>
          <div style="margin: 20px 0; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
            <h2 style="color: #4B5563; margin-top: 0;">Next Steps:</h2>
            <ol style="color: #4B5563;">
              <li>Create your account if you haven't already</li>
              <li>Submit your article through our platform</li>
              <li>Our team will review and optimize your content</li>
              <li>Your article will be published on selected media sites</li>
            </ol>
          </div>
          <p>If you have any questions, feel free to reply to this email.</p>
          <p style="color: #6B7280; font-size: 14px; margin-top: 40px;">Best regards,<br>The Lovable Team</p>
        </div>
      `
    })

    console.log('Email sent successfully:', emailResponse)

    return new Response(JSON.stringify(emailResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error sending confirmation email:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
