
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Mail, Key, UserRoundPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const { user, loading } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user && !loading) {
      console.log("SignUp: User already authenticated, redirecting to submissions");
      navigate('/submissions');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      setSignUpError(null);
      
      console.log("SignUp: Attempting to sign up with email:", values.email);
      
      // First, check if user already exists
      const { data: existingUser, error: checkError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (existingUser?.user) {
        // User exists and password was correct
        console.log("SignUp: User already exists and could sign in");
        toast({
          title: "Account already exists",
          description: "You've been signed in with your existing account.",
        });
        navigate('/submissions');
        return;
      }
      
      // If error is not about invalid credentials, it's another error
      if (checkError && !checkError.message?.includes("Invalid login credentials")) {
        console.error("SignUp: Error checking existing user:", checkError);
      }
      
      // Proceed with signup
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (error) {
        console.error("SignUp: Error during sign up:", error);
        
        // If error message contains "User already registered", try to sign in
        if (error.message?.includes("User already registered")) {
          toast({
            variant: "destructive",
            title: "Account already exists",
            description: "This email is already registered. Please sign in instead.",
          });
          
          // Redirect to sign in
          navigate('/signin');
          return;
        }
        
        // Handle the specific email error case
        if (error.message?.includes("sending confirmation email") || error.message?.includes("Failed to send email")) {
          console.log("SignUp: Email sending failed but account likely created");
          
          // Account was likely created but confirmation email failed
          toast({
            title: "Account created!",
            description: "Your account was created, but we couldn't send a confirmation email. You can still proceed to use the application.",
          });
          
          // Attempt to sign in the user directly
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
          });
          
          if (!signInError) {
            navigate('/submissions');
            return;
          } else {
            // If sign-in fails, show a more detailed message
            setSignUpError("Your account was created but we couldn't sign you in automatically. Please try signing in manually.");
            navigate('/signin');
            return;
          }
        } else {
          // Handle other errors
          throw error;
        }
      }
      
      if (data?.user) {
        console.log("SignUp: User created successfully");
        toast({
          title: "Account created!",
          description: "Welcome to our platform. Please check your email to verify your account.",
        });
        
        // For better user experience, try to sign in immediately without waiting for email verification
        if (!data.session) {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
          });
          
          if (signInError) {
            console.log("SignUp: Could not automatically sign in after signup");
            // Redirect to sign in instead
            navigate('/signin');
            return;
          }
        }
        
        navigate('/submissions');
      }
    } catch (error: any) {
      console.error("SignUp: Detailed error:", error);
      setSignUpError(error.message || "Failed to create account. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create account. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Create your account</CardTitle>
            <CardDescription className="text-center">
              Get started with your writer's journey today
            </CardDescription>
          </CardHeader>
          <CardContent>
            {signUpError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{signUpError}</AlertDescription>
              </Alert>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input placeholder="your@email.com" {...field} className="pl-10" />
                        </div>
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
                        <div className="relative">
                          <Key className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input type="password" placeholder="Create a password" {...field} className="pl-10" />
                        </div>
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
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Key className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input type="password" placeholder="Confirm your password" {...field} className="pl-10" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  <UserRoundPlus className="mr-2" />
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </Form>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 text-primary hover:text-primary/90"
                  onClick={() => navigate('/signin')}
                >
                  Sign in
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
