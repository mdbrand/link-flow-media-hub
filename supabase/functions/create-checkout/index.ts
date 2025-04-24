
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import Stripe from 'https://esm.sh/stripe@13.6.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Creating checkout session...');
    const { planName } = await req.json();
    console.log('Plan selected:', planName);

    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      console.error('STRIPE_SECRET_KEY is not set in environment variables');
      throw new Error('Stripe key configuration error');
    }
    
    console.log('Initializing Stripe...');
    
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    // Use a single hardcoded price ID that we know is valid
    // This simplifies the implementation and makes it more robust
    const priceId = 'price_1RHW2K3YTXYuny55tA3ho7Hd'; // Using the correct format with "1" instead of "0"
    console.log('Using Stripe price ID:', priceId);

    console.log('Creating Stripe checkout session for price ID:', priceId);
    
    // Check if the price exists and verify its type
    try {
      const price = await stripe.prices.retrieve(priceId);
      console.log('Price retrieved:', {
        id: price.id,
        type: price.type,
        recurring: price.recurring ? 'yes' : 'no'
      });
      
      // Log a warning if the price is set to recurring but we're using payment mode
      if (price.recurring && price.recurring.interval) {
        console.warn('Warning: Using a recurring price with payment mode. This may cause issues.');
      }
    } catch (priceError) {
      console.error('Error retrieving price:', priceError.message);
      // Continue with checkout attempt even if price retrieval fails
    }
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/#pricing`,
    });

    console.log('Session created:', session.id);

    // Create an order record in the database
    try {
      console.log('Creating order record in database');
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      const { data: orderData, error: orderError } = await supabase.from('orders').insert({
        stripe_session_id: session.id,
        status: 'pending'
      }).select();

      if (orderError) {
        console.error('Error creating order:', orderError);
      } else {
        console.log('Order created:', orderData);
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue with checkout even if DB insert fails
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Checkout error:', error.message, error.stack);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
