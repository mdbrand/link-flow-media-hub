
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthCard } from "@/components/auth/AuthCard";
import { SignInForm } from "@/components/auth/SignInForm";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SignIn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      console.log("SignIn: User already authenticated, checking for pending orders");
      
      const pendingOrderSessionId = localStorage.getItem('pendingOrderSessionId');
      if (pendingOrderSessionId) {
        console.log("SignIn: Found pending order, associating with user");
        
        const associateOrder = async () => {
          try {
            const { data: order, error: fetchError } = await supabase
              .from('orders')
              .select('id, status')
              .eq('stripe_session_id', pendingOrderSessionId)
              .single();
              
            if (fetchError || !order) {
              console.error("Error finding pending order:", fetchError);
              return;
            }
            
            const { error: updateError } = await supabase
              .from('orders')
              .update({ 
                user_id: user.id,
                status: order.status !== 'paid' ? 'paid' : order.status 
              })
              .eq('id', order.id);
              
            if (updateError) {
              console.error("Error associating order with user:", updateError);
            } else {
              console.log("Successfully associated order with user");
              toast({
                title: "Order Associated",
                description: "Your previous purchase has been connected to your account.",
              });
              localStorage.removeItem('pendingOrderSessionId');
            }
          } catch (err) {
            console.error("Error in associateOrder:", err);
          }
        };
        
        associateOrder();
      }
      navigate('/submissions');
    }
  }, [user, navigate, toast]);

  if (loading) {
    return (
      <AuthCard 
        title="Loading"
        description=""
      >
        <div className="flex items-center justify-center">
          <p className="text-lg">Loading...</p>
        </div>
      </AuthCard>
    );
  }

  const footer = (
    <CardFooter className="flex flex-col space-y-4">
      <div className="relative w-full">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-muted" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            New to our platform?
          </span>
        </div>
      </div>
      <Button 
        variant="outline" 
        onClick={() => navigate('/payment?plan=Launch%20Special')}
        className="w-full"
      >
        Create an Account
      </Button>
    </CardFooter>
  );

  return (
    <AuthCard
      title="Sign In to Your Account"
      description="Access your article submissions and track their status"
      footer={footer}
    >
      <SignInForm />
    </AuthCard>
  );
};

export default SignIn;
