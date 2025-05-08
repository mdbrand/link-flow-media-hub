import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import Stripe from 'https://esm.sh/stripe@13.6.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Read TEST environment variables
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');

if (!stripeKey || !stripeWebhookSecret) {
  console.error('Missing Stripe TEST environment variables (STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET)');
  // Consider how to handle this error more gracefully in production
}

const stripe = new Stripe(stripeKey!, {
  apiVersion: '2023-10-16',
  // Use Deno Fetch client
  httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const signature = req.headers.get('Stripe-Signature');
  const body = await req.text();

  try {
    if (!signature) {
      throw new Error('Missing Stripe-Signature header');
    }
    if (!stripeWebhookSecret) {
      throw new Error('Missing STRIPE_WEBHOOK_SECRET');
    }

    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      stripeWebhookSecret,
      undefined,
      // Use Deno Crypto provider
      Stripe.createSubtleCryptoProvider()
    );

    console.log(`Received Stripe event: ${event.type}`);

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_details?.email;
      const stripeSessionId = session.id;

      if (!customerEmail) {
        console.error(`No customer email found for session: ${stripeSessionId}`);
        // Decide how to handle missing email - maybe skip email prefill logic?
        // For now, we'll proceed, but the email prefill won't work.
      }

      console.log(`Processing checkout success for session: ${stripeSessionId}, Email: ${customerEmail}`);

      // 1. Update order status and customer_email, retrieve plan name
      let planName = 'Unknown Plan';
      try {
        const updatePayload: { status: string; customer_email?: string } = { status: 'completed' };
        if (customerEmail) {
          updatePayload.customer_email = customerEmail;
        }

        const { data: orderData, error: updateError } = await supabase
          .from('orders')
          .update(updatePayload)
          .eq('stripe_session_id', stripeSessionId)
          .select('plan_name') // Select the plan_name after update
          .single(); // Expect only one matching order

        if (updateError) {
          console.error(`Error updating order status/email for session ${stripeSessionId}:`, updateError);
          // Decide if this error should prevent email sending
        } else if (orderData && orderData.plan_name) {
          planName = orderData.plan_name;
          console.log(`Order status and email updated for session: ${stripeSessionId}, Plan: ${planName}, Email: ${customerEmail}`);
        } else {
          console.warn(`Order status/email updated but plan_name not found for session: ${stripeSessionId}`);
        }
      } catch (dbError) {
        console.error(`Database error updating order for session ${stripeSessionId}:`, dbError);
      }

      // 2. Send confirmation email by invoking the dedicated function
      try {
        console.log(`Invoking send-payment-confirmation for ${customerEmail} with plan ${planName}`);
        const { error: invokeError } = await supabase.functions.invoke('send-payment-confirmation', {
          body: { email: customerEmail, planName: planName },
        });

        if (invokeError) {
          console.error(`Error invoking send-payment-confirmation for session ${stripeSessionId}:`, invokeError);
        } else {
          console.log(`Successfully invoked send-payment-confirmation for session: ${stripeSessionId}`);
        }
      } catch (invokeCatchError) {
        console.error(`Exception invoking send-payment-confirmation for session ${stripeSessionId}:`, invokeCatchError);
      }

    } else {
      console.log(`Unhandled event type: ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return new Response(JSON.stringify({ received: true }), {
       headers: { ...corsHeaders, 'Content-Type': 'application/json' },
       status: 200
     });

  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    });
  }
});

// Placeholder for email sending function (to be implemented)
// async function sendPaymentConfirmationEmail(toEmail: string, details: { sessionId: string, plan: string, amount: string }) {
//   console.log(`Simulating email send to ${toEmail} with details:`, details);
//   // Actual implementation using Resend or similar service would go here
//   // const resendApiKey = Deno.env.get('RESEND_API_KEY');
//   // ... setup Resend client and send email ...
// } 