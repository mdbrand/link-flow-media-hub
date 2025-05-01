import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PaymentSuccess = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        setIsProcessing(true);
        if (!sessionId) {
          setError("No session ID found. Please contact support.");
          return;
        }
        
        console.log("Processing payment with session ID:", sessionId);
        
        // Get order details from Supabase
        const { data, error } = await supabase
          .from('orders')
          .select('plan_name, id, status, user_id')
          .eq('stripe_session_id', sessionId)
          .single();

        if (error) {
          console.error('Error fetching order:', error);
          setError("Could not find your order. Please contact support.");
          return;
        }

        // Make sure we have plan_name data before proceeding
        if (!data || !data.plan_name) {
          console.error('No plan name found for this order');
          setError("Invalid order data. Please contact support.");
          return;
        }

        console.log("Found order:", data);

        // --- Revised Logic --- 
        // Only attempt to associate user_id if the user is logged in 
        // AND the order doesn't already have a user_id associated.
        // Do NOT change the status here; webhook handles completion.
        if (user && data.user_id === null) {
          console.log(`PaymentSuccess: Associating order ${data.id} with logged-in user ${user.id}`);
          const { error: updateError } = await supabase
            .from('orders')
            .update({ user_id: user.id })
            .eq('id', data.id);

          if (updateError) {
            console.error('PaymentSuccess: Error associating order with user:', updateError);
            // Don't block success flow for this error, association will be tried again on next login
          } else {
            console.log("PaymentSuccess: Order associated with user successfully");
            // If we successfully associate here, remove the pending ID
            localStorage.removeItem('pendingOrderSessionId');
          }
        } else if (user && data.user_id !== null) {
           console.log(`PaymentSuccess: Order ${data.id} already has user_id ${data.user_id}.`);
        } else if (!user) {
           // User not logged in - store session ID in localStorage for later association
           console.log("PaymentSuccess: User not logged in - storing session ID in localStorage");
           localStorage.setItem('pendingOrderSessionId', sessionId);
        }
        // --- End Revised Logic ---

        toast({
          title: "Payment Successfully Processed!",
          description: "Thank you for your purchase. You can now submit your article.",
        });
      } catch (error) {
        console.error('Error in confirmation process:', error);
        setError("An unexpected error occurred. Please contact support.");
      } finally {
        setIsProcessing(false);
      }
    };

    if (sessionId) {
      processPayment();
      
      // Redirect to signup or submit-article after payment processing
      const timer = setTimeout(() => {
        if (user) {
          navigate('/submit-article');
        } else {
          navigate('/signup');
        }
      }, 5000); // Extend timeout to 5 seconds to ensure order processing completes
      return () => clearTimeout(timer);
    } else {
      setIsProcessing(false);
    }
  }, [sessionId, toast, navigate, user]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {isProcessing ? (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 border-t-4 border-b-4 border-purple-500 rounded-full animate-spin"></div>
            <h1 className="text-3xl font-bold">Processing Your Payment</h1>
            <p className="text-gray-600">Please wait while we confirm your payment...</p>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <Alert variant="destructive" className="text-left">
              <AlertTitle>Payment Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button onClick={() => navigate('/')} className="w-full">
              Return to Home
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold">Payment Successful!</h1>
            <p className="text-gray-600">
              {user 
                ? "Thank you for your purchase. You'll be redirected to submit your article in a moment."
                : "Thank you for your purchase. You'll be redirected to create your account in a moment."
              }
            </p>
            <Button onClick={() => user ? navigate('/submit-article') : navigate('/signup')} className="w-full">
              {user ? "Submit Article Now" : "Create Account Now"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
