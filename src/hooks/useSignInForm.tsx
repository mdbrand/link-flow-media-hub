import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function useSignInForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Function to set email value programmatically
  const setEmailValue = (email: string) => {
    form.setValue("email", email);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      setSignInError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        console.error("SignIn error:", error);
        setSignInError(error.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
        return;
      }

      if (data.user) {
        console.log("SignIn: User authenticated successfully");
        navigate('/submissions');
      }
    } catch (error: any) {
      console.error("Unexpected sign-in error:", error);
      setSignInError(error.message || "An unexpected error occurred");
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      const appUrl = import.meta.env.APP_URL || window.location.origin;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${appUrl}/reset-password`,
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

  return {
    form,
    isLoading,
    signInError,
    isResettingPassword,
    onSubmit: form.handleSubmit(onSubmit),
    handleForgotPassword,
    setEmailValue
  };
}
