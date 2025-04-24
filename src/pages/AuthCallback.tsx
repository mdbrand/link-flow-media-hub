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
        console.log("Current URL:", window.location.href);
        
        // Get URL parameters
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        
        // Check for hash parameters (old method)
        const hashParams = window.location.hash;
        
        if (code) {
          console.log("Verification code detected:", code);
          
          // Exchange the code for a session
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            throw error;
          }
          
          // If we have a session, show success message
          if (data?.session) {
            toast({
              title: "Email verified successfully",
              description: "Your email has been verified and you're now signed in",
            });
            
            // Short delay to ensure toast is visible before redirect
            setTimeout(() => navigate('/submit-article'), 500);
          } else {
            console.log("No session found after exchanging code");
            navigate('/signup');
          }
        } else if (hashParams && hashParams.includes('access_token')) {
          // Handle the hash params method (keeping this as fallback)
          console.log("Hash params detected:", hashParams);
          
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
            
            setTimeout(() => navigate('/submit-article'), 500);
          } else {
            console.log("No session found after processing hash");
            navigate('/signup');
          }
        } else {
          // No authentication parameters, just show the home page
          console.log("No authentication parameters found");
          navigate('/signup');
        }
      } catch (error) {
        console.error("Auth callback error:", error);
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
