import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AuthCard } from "@/components/auth/AuthCard";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const SignIn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const { user, loading } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user && !loading) {
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
  }, [user, loading, navigate, toast]);

  const handleForgotPassword = async () => {
    const email = form.getValues("email");
    if (!email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter your email address first.",
      });
      return;
    }

    setIsResettingPassword(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Check your email",
        description: "We've sent you a password reset link.",
      });
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send reset password email. Please try again.",
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

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
      {signInError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{signInError}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Form>
      
      <div className="mt-4 text-center">
        <Button
          variant="link"
          onClick={handleForgotPassword}
          disabled={isResettingPassword}
          className="text-sm text-muted-foreground hover:text-primary"
        >
          {isResettingPassword ? "Sending reset link..." : "Forgot Password?"}
        </Button>
      </div>
    </AuthCard>
  );
};

export default SignIn;
