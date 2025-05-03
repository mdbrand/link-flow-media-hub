import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

const AuthCallback = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setIsProcessing(true);
        
        // Log the full URL for debugging
        console.log("AuthCallback: Current URL:", window.location.href);
        
        // Get URL parameters
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        
        if (code) {
          console.log("AuthCallback: Verification code detected:", code);
          
          try {
            // Exchange the code for a session
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            
            if (error) {
              console.error("AuthCallback: Error exchanging code:", error);
              throw error;
            }
            
            console.log("AuthCallback: Code exchange response:", data);
            
            // If we have a session, show success message
            if (data?.session) {
              // Clear the code from the URL to prevent issues on refresh
              window.history.replaceState({}, document.title, window.location.pathname);
              
              toast({
                title: "Email verified successfully",
                description: "Your email has been verified and you're now signed in",
              });
              
              // Redirect to submit article page
              setTimeout(() => navigate('/submissions'), 1000);
              return;
            }
          } catch (codeError) {
            console.error("AuthCallback: Code exchange error:", codeError);
            toast({
              variant: "destructive",
              title: "Verification failed",
              description: codeError.message || "Could not verify your email. Please try again.",
            });
          }
        } else {
          console.log("AuthCallback: No code found in URL, checking for hash params");
          
          // Check for hash parameters (old method)
          const hashParams = window.location.hash;
          
          if (hashParams && hashParams.includes('access_token')) {
            console.log("AuthCallback: Hash params detected:", hashParams);
            
            const { data, error } = await supabase.auth.getSession();
            
            if (error) {
              throw error;
            }
            
            // Clear the hash from the URL to prevent issues on refresh
            window.history.replaceState({}, document.title, window.location.pathname);
            
            if (data?.session) {
              toast({
                title: "Authentication successful",
                description: "You've been successfully authenticated",
              });
              
              setTimeout(() => navigate('/submissions'), 500);
              return;
            }
          } else {
            console.log("AuthCallback: No authentication parameters found");
          }
        }
        
        // If we get here, no successful authentication happened
        console.log("AuthCallback: No successful authentication, redirecting to signup");
        toast({
          variant: "destructive",
          title: "Authentication error",
          description: "There was a problem with your verification link. Please try signing up again.",
        });
        navigate('/signup');
      } catch (error) {
        console.error("AuthCallback: Unhandled error:", error);
        toast({
          variant: "destructive",
          title: "Authentication error",
          description: error.message || "There was a problem authenticating your account",
        });
        navigate('/signup');
      } finally {
        setIsProcessing(false);
      }
    };
    
    handleAuthCallback();
  }, [navigate, toast, location]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        {isProcessing && (
          <div className="text-center">
            <p className="text-lg mb-2">Completing authentication...</p>
            <p className="text-gray-500">Please wait while we verify your account</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
