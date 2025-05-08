import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";

const formSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ResetPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Check for hash fragments and validate the session on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsCheckingSession(true);
        
        // Get the session - this will automatically exchange the hash fragment provided by Supabase
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          setError("Unable to verify your session. The reset link may have expired.");
          return;
        }
        
        if (!data.session) {
          console.log("No active session found for password reset");
          setError("No active session found. Please request a new password reset link.");
          return;
        }
        
        console.log("Valid session found for password reset");
      } catch (error) {
        console.error("Session check exception:", error);
        setError("An error occurred while verifying your session. Please try again.");
      } finally {
        setIsCheckingSession(false);
      }
    };
    
    checkSession();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      setError(null);

      // Update user's password
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) {
        throw error;
      }

      setSuccess(true);
      toast({
        title: "Password updated successfully",
        description: "Your password has been reset. You can now sign in with your new password.",
      });

      // Redirect to sign in page after 3 seconds
      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    } catch (error: any) {
      console.error("Reset password error:", error);
      setError(error.message || "Failed to reset password. Please try again or request a new reset link.");
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to reset password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <AuthCard
        title="Verifying Your Request"
        description="Please wait while we verify your password reset request..."
      >
        <div className="py-8 text-center text-gray-600">
          Checking session...
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Reset Your Password"
      description={
        success
          ? "Your password has been reset successfully. Redirecting to sign in page..."
          : "Create a new password for your account"
      }
    >
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success ? (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertDescription>
            Password reset successful! You will be redirected to the sign in page.
          </AlertDescription>
        </Alert>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="New password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Confirm new password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading || Boolean(error)}>
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </Button>
          </form>
        </Form>
      )}
      
      {error && (
        <div className="mt-6 text-center">
          <Button
            variant="link"
            onClick={() => navigate("/signin")}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Back to Sign In
          </Button>
        </div>
      )}
    </AuthCard>
  );
} 