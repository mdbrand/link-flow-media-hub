
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const PaymentSuccess = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      toast({
        title: "Payment Successful!",
        description: "Thank you for your purchase. We'll start working on your media coverage right away.",
      });
    }
  }, [sessionId, toast]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold">Payment Successful!</h1>
        <p className="text-gray-600">
          Thank you for your purchase. We'll start working on your media coverage package right away.
        </p>
        <Button onClick={() => navigate('/')} className="w-full">
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
