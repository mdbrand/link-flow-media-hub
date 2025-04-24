
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Payment = () => {
  const [searchParams] = useSearchParams();
  const planName = searchParams.get('plan');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Define valid plans and their prices
  const prices = {
    'Starter': '$297',
    'Growth': '$497',
    'Enterprise': '$997',
    'Launch Special': '$97'
  };

  // Define features for each plan
  const features = {
    'Starter': [
      "Featured on 5 media sites",
      "1 article submission",
      "Basic AI adaptation",
      "Standard editorial review",
      "30-day publishing window",
      "Basic performance metrics"
    ],
    'Growth': [
      "Featured on all 12 media sites",
      "1 article submission",
      "Advanced AI optimization",
      "Priority editorial review",
      "14-day publishing window",
      "Detailed performance analytics",
      "Social media promotion",
      "PDF certificate of publication"
    ],
    'Enterprise': [
      "Featured on all 12 media sites",
      "3 article submissions",
      "Premium AI customization",
      "VIP editorial treatment",
      "7-day publishing window",
      "Comprehensive analytics dashboard",
      "Social media campaign",
      "Featured spotlight placement",
      "Dedicated account manager",
      "Quarterly strategy session"
    ],
    'Launch Special': [
      "Featured on ALL 12 media sites",
      "1 article submission",
      "Advanced AI adaptation",
      "Priority editorial review",
      "14-day publishing window",
      "Special launch pricing"
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
              Please return to pricing and select one of our available plans: Starter, Growth, Enterprise, or Launch Special.
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
      console.log('Initiating checkout for plan:', planName);
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planName },
      });

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
      setError(error.message || 'Failed to process payment');
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
          <CardTitle className="text-2xl">{planName} Plan</CardTitle>
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
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {error}
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
