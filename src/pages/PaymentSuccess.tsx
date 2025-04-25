
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

        // Only update order if it's not already marked as paid
        if (data.status !== 'paid') {
          console.log("Updating order status to paid");
          
          // Update order with user_id and status='paid' if user is logged in
          if (user) {
            const { error: updateError } = await supabase
              .from('orders')
              .update({ 
                user_id: user.id,
                status: 'paid' 
              })
              .eq('id', data.id);

            if (updateError) {
              console.error('Error updating order:', updateError);
              setError("Could not update your order status. Please contact support.");
              return;
            }
            
            console.log("Order updated successfully with user ID:", user.id);
          } else {
            console.log("User not logged in - storing session ID in localStorage");
            // Store the session ID in localStorage for later association
            localStorage.setItem('pendingOrderSessionId', sessionId);
          }
        } else {
          // If order is already paid but not associated with user, associate it
          if (user && !data.user_id) {
            console.log("Order already marked as paid, associating with user");
            const { error: updateError } = await supabase
              .from('orders')
              .update({ user_id: user.id })
              .eq('id', data.id);
            
            if (updateError) {
              console.error('Error associating order with user:', updateError);
            } else {
              console.log("Order associated with user successfully");
            }
          } else {
            console.log("Order already marked as paid");
          }
        }

        // Send confirmation email
        const { error: emailError } = await supabase.functions.invoke('send-payment-confirmation', {
          body: { 
            email: user?.email || 'guest@example.com',
            planName: data.plan_name 
          }
        });

        if (emailError) {
          console.error('Error sending confirmation email:', emailError);
          // Don't block process for email errors
        }
        
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
      }, 3000);
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
