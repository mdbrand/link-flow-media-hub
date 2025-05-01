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

    // Use the LIVE key for production
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      // Update error message to reflect the key being checked
      console.error('STRIPE_SECRET_KEY is not set in environment variables');
      throw new Error('Stripe key configuration error');
    }
    
    console.log('Initializing Stripe...');
    
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });
    console.log('Key prefix:', stripeKey?.slice(0,5))

    // Read the LIVE price ID from environment variables
    const priceId = Deno.env.get('STRIPE_PRICE_ID');
    if (!priceId) {
      console.error('STRIPE_PRICE_ID is not set in environment variables');
      throw new Error('Stripe Price ID configuration error');
    }
    console.log('Using LIVE price ID:', priceId);
    
    // Get user information if available
    let userId = null;
    const authHeader = req.headers.get('Authorization');
    
    if (authHeader) {
      try {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );
        
        const token = authHeader.replace('Bearer ', '');
        const { data, error } = await supabase.auth.getUser(token);
        
        if (!error && data?.user) {
          userId = data.user.id;
          console.log('User authenticated:', userId);
        }
      } catch (authError) {
        console.error('Authentication error:', authError);
        // Continue without user info
      }
    }
    
    // Create checkout session with the new price ID
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

      // Get the price details
      const priceDetails = await stripe.prices.retrieve(priceId);
      const amount = priceDetails.unit_amount || 2900; // Default to $29 if not found

      // Define the structure for order data, allowing user_id to be potentially null
      interface OrderInsert {
        stripe_session_id: string;
        status: string;
        plan_name: string;
        amount: number;
        user_id?: string | null; // Make user_id optional
      }

      const orderData: OrderInsert = {
        stripe_session_id: session.id,
        status: 'pending',
        plan_name: planName,
        amount: amount,
        user_id: userId // Assign userId directly (will be null if not found)
      };
      
      console.log(`Attempting to insert order with user_id: ${userId ?? 'NULL'}`);

      const { data: orderResponse, error: orderError } = await supabase.from('orders').insert(orderData).select();

      if (orderError) {
        console.error('Error creating order:', orderError);
      } else {
        console.log('Order created:', orderResponse);
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
