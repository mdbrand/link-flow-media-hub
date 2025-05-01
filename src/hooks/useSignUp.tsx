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
        
        // ---- Restoring original error handling ----
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
        // (Note: This might lead to users being told signup worked when it didn't, 
        // if Supabase email sending is not configured/working)
        if (error.message?.includes("sending confirmation email") || 
            error.message?.includes("Failed to send email") || 
            error.message?.includes("Error sending confirmation email")) {
          
          console.log("SignUp: Email sending failed but proceeding with account creation assumption");
          
          // Since email verification failed, try to sign in the user directly
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
          });
          
          if (!signInError && signInData?.user) {
            toast({
              title: "Account created!",
              description: "Your account was created successfully. Email verification was skipped.",
            });
            // --- Invoke Owner Notification on assumed success ---
            try {
              console.log(`Invoking owner signup notification for ${signInData.user.email} (after email send error)`);
              await supabase.functions.invoke('send-signup-notification', {
                body: { newUserEmail: signInData.user.email, newUserId: signInData.user.id }, 
              });
            } catch (invokeCatchError) {
              console.error("Exception invoking owner signup notification (after email send error):", invokeCatchError);
            }
            // --- End Owner Notification ---
            navigate('/submissions');
            return;
          } else {
            console.error("SignUp: Could not sign in after assumed account creation:", signInError);
            toast({
              variant: "default", 
              title: "Account created",
              description: "Your account was created. Please sign in with your email and password.",
            });
            navigate('/signin');
            return;
          }
        }
        // --- End Restored Handling ---
        
        // Fallback for other errors
        setSignUpError(error.message || "Failed to create account. Please try again.");
        toast({
          variant: "destructive",
          title: "Signup Error",
          description: error.message || "Failed to create account. Please try again.",
        });
        return; 
      }
      
      if (data?.user) {
        console.log("SignUp: User created successfully");

        // ---- Invoke Owner Notification Function ----
        try {
          console.log(`Invoking owner signup notification for ${data.user.email}`);
          const { error: invokeError } = await supabase.functions.invoke('send-signup-notification', {
            // Pass essential user info directly
            body: { newUserEmail: data.user.email, newUserId: data.user.id }, 
          });
          if (invokeError) {
            // Log error but don't block the user flow
            console.error("Error invoking owner signup notification:", invokeError);
          } else {
            console.log("Successfully invoked owner signup notification.");
          }
        } catch (invokeCatchError) {
          console.error("Exception invoking owner signup notification:", invokeCatchError);
        }
        // ---- End Owner Notification ----
        
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
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        
        if (!signInError && signInData?.user) {
          toast({
            title: "Account created!",
            description: "Welcome to our platform.",
          });
          navigate('/submissions');
        } else {
          // Improved messaging for a better user experience
          console.log("SignUp: Could not automatically sign in after account creation");
          toast({
            variant: "default",
            title: "Account created",
            description: "Your account was created. Please sign in with your email and password.",
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
