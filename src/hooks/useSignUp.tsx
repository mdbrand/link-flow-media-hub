
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as z from "zod";

export const signUpFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type SignUpFormData = z.infer<typeof signUpFormSchema>;

export const useSignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [signUpError, setSignUpError] = useState<string | null>(null);

  const handleSignUp = async (values: SignUpFormData) => {
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
        console.log("SignUp: User already exists and could sign in");
        toast({
          title: "Account already exists",
          description: "You've been signed in with your existing account.",
        });
        navigate('/submissions');
        return;
      }
      
      if (checkError && !checkError.message?.includes("Invalid login credentials")) {
        console.error("SignUp: Error checking existing user:", checkError);
      }
      
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          // Skip email verification for now to allow users to proceed
          emailRedirectTo: `${window.location.origin}/auth-callback`
        }
      });

      if (error) {
        console.error("SignUp: Error during sign up:", error);
        
        if (error.message?.includes("User already registered")) {
          toast({
            variant: "destructive",
            title: "Account already exists",
            description: "This email is already registered. Please sign in instead.",
          });
          navigate('/signin');
          return;
        }
        
        // Handle email sending failure - allow user to continue
        if (error.message?.includes("sending confirmation email") || 
            error.message?.includes("Failed to send email") || 
            error.message?.includes("Error sending confirmation email")) {
          
          console.log("SignUp: Email sending failed but proceeding with account creation");
          
          // Since email verification failed, try to sign in the user directly
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
          });
          
          if (!signInError) {
            toast({
              title: "Account created!",
              description: "Your account was created successfully. Email verification was skipped.",
            });
            navigate('/submissions');
            return;
          } else {
            toast({
              variant: "destructive", 
              title: "Partial success",
              description: "Your account was created but we couldn't sign you in automatically. Please try signing in manually."
            });
            navigate('/signin');
            return;
          }
        }
        
        throw error;
      }
      
      if (data?.user) {
        console.log("SignUp: User created successfully");
        
        // If we have a session already, proceed to the app
        if (data.session) {
          toast({
            title: "Account created!",
            description: "Welcome to our platform.",
          });
          navigate('/submissions');
          return;
        }
        
        // If no session (probably due to email confirmation requirements)
        // Try to sign in anyway since we know email verification may fail
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        
        if (!signInError) {
          toast({
            title: "Account created!",
            description: "Welcome to our platform.",
          });
          navigate('/submissions');
        } else {
          toast({
            variant: "default", // Changed from "warning" to "default" to fix the type error
            title: "Account created",
            description: "Your account was created, but you need to sign in manually.",
          });
          navigate('/signin');
        }
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

  return {
    isLoading,
    signUpError,
    handleSignUp,
  };
};
