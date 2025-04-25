
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const PaymentSuccess = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const sendConfirmationEmail = async () => {
      try {
        // Get order details from Supabase
        const { data: orders, error: orderError } = await supabase
          .from('orders')
          .select('plan_name')
          .eq('stripe_session_id', sessionId)
          .single();

        if (orderError) {
          console.error('Error fetching order:', orderError);
          return;
        }

        // Send confirmation email
        const { error } = await supabase.functions.invoke('send-payment-confirmation', {
          body: { 
            email: 'guest@example.com', // For now using a default email since user might not be signed in
            planName: orders.plan_name 
          }
        });

        if (error) {
          console.error('Error sending confirmation email:', error);
        }
      } catch (error) {
        console.error('Error in confirmation process:', error);
      }
    };

    if (sessionId) {
      toast({
        title: "Payment Successful!",
        description: "Thank you for your purchase. Let's create your account to get started.",
      });
      
      // Send confirmation email
      sendConfirmationEmail();
      
      // Redirect to signup after a short delay
      const timer = setTimeout(() => {
        navigate('/signup');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [sessionId, toast, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold">Payment Successful!</h1>
        <p className="text-gray-600">
          Thank you for your purchase. You'll be redirected to create your account in a moment.
        </p>
        <Button onClick={() => navigate('/signup')} className="w-full">
          Create Account Now
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
