
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSignInForm } from "@/hooks/useSignInForm";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export function SignInForm() {
  const { 
    form, 
    isLoading, 
    signInError, 
    isResettingPassword, 
    onSubmit, 
    handleForgotPassword,
    setEmailValue
  } = useSignInForm();
  
  const [searchParams] = useSearchParams();
  const fromSignup = searchParams.get('from') === 'signup';
  const email = searchParams.get('email');
  
  // Auto-fill email from query params if available
  useEffect(() => {
    if (email) {
      setEmailValue(email);
    }
  }, [email, setEmailValue]);

  return (
    <>
      {fromSignup && (
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <AlertDescription>
            Your account was created successfully. Please sign in with your email and password.
          </AlertDescription>
        </Alert>
      )}
      
      {signInError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{signInError}</AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
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
    </>
  );
}
