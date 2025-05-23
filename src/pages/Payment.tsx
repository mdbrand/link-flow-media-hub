import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

// Restore importing the shared Supabase client
import { supabase } from '@/integrations/supabase/client';

// Define Supabase creds locally (replace with env vars if needed, but hardcoding for test is ok)
// const SUPABASE_URL = "https://kkvqzujckeigjlxklsyp.supabase.co";
// const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrdnF6dWpja2VpZ2pseGtsc3lwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MTczNzQsImV4cCI6MjA2MTA5MzM3NH0.Ew74z5F1p5tFMnoQaebMAocvLfmnjrBNSTUhDoSk4Ck";

const Payment = () => {
  const [searchParams] = useSearchParams();
  const planName = searchParams.get('plan');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [detailedError, setDetailedError] = useState('');

  // Define valid plans and their prices
  const prices = {
    'Launch Special': '$97',
    'Starter': '$297',
    'Growth': '$497',
    'Enterprise': '$997'
  };

  // Define features based on plan
  const features = {
    'Launch Special': [
      "Featured on 6 media sites",
      "1 article submission",
      "Advanced AI adaptation",
      "Priority editorial review",
      "14-day publishing window",
      "Special launch pricing"
    ],
    'Starter': [
      "Featured on 4 media sites",
      "1 article submission",
      "Basic AI adaptation",
      "Editorial review",
      "30-day publishing window"
    ],
    'Growth': [
      "Featured on 8 media sites",
      "2 article submissions",
      "Advanced AI adaptation",
      "Priority editorial review",
      "21-day publishing window",
      "Social media amplification"
    ],
    'Enterprise': [
      "Featured on ALL 12 media sites",
      "3 article submissions",
      "Premium AI adaptation",
      "VIP editorial review",
      "14-day publishing window",
      "Social media amplification",
      "Analytics dashboard"
    ]
  };

  // Validate plan on component mount and when URL params change
  useEffect(() => {
    console.log('Current plan from URL:', planName);
    console.log('Valid plans:', Object.keys(prices));
    
    if (!planName) {
      console.error('No plan name provided in URL');
      setError('No plan selected');
    } else if (!prices[planName]) {
      console.error('Invalid plan name:', planName);
      setError('Invalid plan selected');
    } else {
      console.log('Valid plan selected:', planName);
      setError('');
    }
  }, [planName]);

  // Handle invalid plan - show error card
  if (!planName || !prices[planName]) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invalid Plan</CardTitle>
            <CardDescription>The selected plan is not valid.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Please return to pricing and select a valid plan.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/#pricing')} className="w-full">
              Return to Pricing
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Handle checkout process
  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      setError('');
      setDetailedError('');
      console.log('Initiating checkout for plan:', planName);
      
      // Remove local client initialization test code
      // console.log('>>> Re-initializing Supabase client locally for invoke...');
      // const localSupabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
      // console.log('>>> Local Supabase client created. Invoking function...');

      // Restore original invoke call using the imported supabase client
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planName },
      });
      console.log('<<< INVOKE create-checkout FINISHED (or errored)'); 

      // Original error handling and redirect logic (Restored)
      if (error) {
        console.error("Checkout error:", error);
        throw error;
      }
      
      console.log("Checkout response:", data);
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received from server");
      }
    } catch (error) {
      console.error("Purchase error:", error);
      const errorMessage = error.message || 'Failed to process payment';
      setError(errorMessage);
      setDetailedError(JSON.stringify(error, null, 2));
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem initiating the checkout. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">{planName}</CardTitle>
          <CardDescription>Review your order details before proceeding to payment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Price</h3>
            <p className="text-3xl font-bold text-[#9b87f5]">{prices[planName]}</p>
            <p className="text-sm text-gray-500">One-time payment</p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Plan Features</h3>
            <ul className="space-y-2">
              {features[planName].map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#9b87f5] mt-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5" />
                <h4 className="font-medium">Error</h4>
              </div>
              <p>{error}</p>
              {detailedError && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm">View technical details</summary>
                  <pre className="mt-2 p-2 bg-red-100 rounded overflow-x-auto text-xs">
                    {detailedError}
                  </pre>
                </details>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button 
            onClick={handleCheckout} 
            disabled={isLoading}
            className="w-full bg-[#9b87f5] hover:bg-[#8B5CF6]"
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Proceed to Payment'
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/#pricing')}
            className="w-full"
          >
            Return to Pricing
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Payment;
