
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

const AuthCallback = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setIsProcessing(true);
        
        // Log the full URL for debugging
        console.log("Current URL:", window.location.href);
        
        // Check for access_token in the URL hash
        const hashParams = window.location.hash;
        
        if (hashParams) {
          console.log("Hash params detected:", hashParams);
          
          // Process the hash parameters using Supabase's built-in handling
          // This will automatically handle the tokens in the URL
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            throw error;
          }
          
          // Clear the hash from the URL to prevent issues on refresh
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // If we have a session, redirect to submit article
          if (data?.session) {
            toast({
              title: "Authentication successful",
              description: "You've been successfully authenticated",
            });
            
            // Short delay to ensure toast is visible before redirect
            setTimeout(() => navigate('/submit-article'), 500);
          } else {
            // No session even after processing hash params, redirect to signup
            console.log("No session found after processing hash");
            navigate('/signup');
          }
        } else {
          // No hash parameters, redirect to home
          console.log("No hash params found, redirecting to home");
          navigate('/');
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
  }, [navigate, toast]);

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
