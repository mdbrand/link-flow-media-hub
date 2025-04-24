
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
        
        // The hash contains the access token and other auth info
        const hashParams = window.location.hash;
        
        if (hashParams) {
          console.log("Processing authentication callback");
          
          // If we have auth params in the URL, let Supabase handle them
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            throw error;
          }
          
          // Clear the hash from the URL
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // If we have a session, redirect to submit article
          if (data?.session) {
            toast({
              title: "Authentication successful",
              description: "You've been successfully authenticated",
            });
            
            navigate('/submit-article');
          } else {
            // If no session, redirect to signup
            navigate('/signup');
          }
        } else {
          // No hash parameters, redirect to home
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
