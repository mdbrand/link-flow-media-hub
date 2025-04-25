
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const PaymentSuccess = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { user } = useAuth();

  useEffect(() => {
    const processPayment = async () => {
      try {
        if (!sessionId) return;
        
        // Get order details from Supabase
        const { data, error } = await supabase
          .from('orders')
          .select('plan_name, id')
          .eq('stripe_session_id', sessionId)
          .single();

        if (error) {
          console.error('Error fetching order:', error);
          return;
        }

        // Make sure we have plan_name data before proceeding
        if (!data || !data.plan_name) {
          console.error('No plan name found for this order');
          return;
        }

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
      
      // Process payment
      processPayment();
      
      // Redirect to signup or submit-article after a short delay
      const timer = setTimeout(() => {
        if (user) {
          navigate('/submit-article');
        } else {
          navigate('/signup');
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [sessionId, toast, navigate, user]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
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
    </div>
  );
};

export default PaymentSuccess;
