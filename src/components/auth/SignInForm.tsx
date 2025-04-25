
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSignInForm } from "@/hooks/useSignInForm";

export function SignInForm() {
  const { 
    form, 
    isLoading, 
    signInError, 
    isResettingPassword, 
    onSubmit, 
    handleForgotPassword 
  } = useSignInForm();

  return (
    <>
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
