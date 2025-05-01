import { useEffect, useState, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from './use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    console.log("AuthProvider: Setting up auth state listener");
    
    // Check for verification code in the URL
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    
    if (code) {
      console.log("AuthProvider: Code detected in URL:", location.pathname);
      
      // If we're at the root path with a code, redirect to auth-callback
      if (location.pathname === '/') {
        console.log("AuthProvider: Redirecting code from root to auth-callback");
        navigate('/auth-callback' + location.search, { replace: true });
        return;
      }
    }
    
    // IMPORTANT: Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("AuthProvider: Auth state changed:", event, session?.user?.email);
        
        // Check for pending order association ONLY when user signs in
        if (event === 'SIGNED_IN' && session?.user) {
          console.log("[OrderAssoc] SIGNED_IN event detected for user:", session.user.id);
          const pendingOrderSessionId = localStorage.getItem('pendingOrderSessionId');
          
          if (pendingOrderSessionId) {
            console.log(`[OrderAssoc] Found pendingOrderSessionId in localStorage: ${pendingOrderSessionId}`);
            try {
              console.log(`[OrderAssoc] Attempting to fetch order with stripe_session_id: ${pendingOrderSessionId}`);
              // Fetch the order by stripe_session_id
              const { data: order, error: fetchError } = await supabase
                .from('orders')
                .select('id, user_id, status') // Select status too for logging
                .eq('stripe_session_id', pendingOrderSessionId)
                .maybeSingle(); 

              if (fetchError) {
                console.error("[OrderAssoc] Error fetching pending order:", fetchError);
                // Optionally remove the bad ID from local storage
                // localStorage.removeItem('pendingOrderSessionId'); 
              } else if (order) {
                console.log(`[OrderAssoc] Found order in DB: ID=${order.id}, Current user_id=${order.user_id}, Status=${order.status}`);
                // Only update if order exists and user_id is NULL
                if (order.user_id === null) { 
                  console.log(`[OrderAssoc] Order user_id is NULL. Attempting to update order ID ${order.id} with user_id ${session.user.id}`);
                  const { error: updateError } = await supabase
                    .from('orders')
                    .update({ user_id: session.user.id })
                    .eq('id', order.id);

                  if (updateError) {
                    console.error(`[OrderAssoc] Error updating order ID ${order.id}:`, updateError);
                  } else {
                    console.log(`[OrderAssoc] Successfully associated order ID ${order.id} with user ${session.user.id}`);
                    localStorage.removeItem('pendingOrderSessionId'); // Clear from local storage on success
                    console.log(`[OrderAssoc] Removed pendingOrderSessionId from localStorage.`);
                    toast({
                      title: "Order Associated",
                      description: "Your previous purchase has been linked to your account.",
                    });
                  }
                } else {
                  // Order already associated, maybe by another flow or previous login
                  console.log(`[OrderAssoc] Order ID ${order.id} already associated with user ${order.user_id}. Skipping update.`);
                  localStorage.removeItem('pendingOrderSessionId'); // Clear orphan ID
                  console.log(`[OrderAssoc] Removed potentially orphaned pendingOrderSessionId from localStorage.`);
                }
              } else {
                // Order not found for the session ID
                console.warn(`[OrderAssoc] No order found in DB for stripe_session_id: ${pendingOrderSessionId}`);
                localStorage.removeItem('pendingOrderSessionId'); // Clear orphan ID
                console.log(`[OrderAssoc] Removed potentially orphaned pendingOrderSessionId from localStorage.`);
              }
            } catch (assocError) {
              console.error("[OrderAssoc] Exception during order association logic:", assocError);
            }
          } else {
            console.log("[OrderAssoc] No pendingOrderSessionId found in localStorage. Skipping association check.");
          }
        }
        
        // Handle sign out event specifically
        if (event === 'SIGNED_OUT') {
          console.log("AuthProvider: User signed out, clearing state");
          setUser(null);
          setSession(null);
          
          // Small delay to ensure state is updated before navigation
          setTimeout(() => {
            navigate('/signin');
          }, 0);
          
          return;
        }
        
        // Handle other auth events
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // On sign-in, redirect to submit article
        if (event === 'SIGNED_IN' && session) {
          console.log("AuthProvider: User signed in, redirecting to submit-article");
          // Use setTimeout to avoid any potential state update conflicts
          setTimeout(() => {
            navigate('/submit-article');
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("AuthProvider: Initial session check:", session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate, location]);

  const signOut = async () => {
    try {
      console.log("AuthProvider: Attempting to sign out");
      
      // Sign out from Supabase first - this triggers the onAuthStateChange event
      const { error } = await supabase.auth.signOut({
        scope: 'global' // This ensures all devices and tabs are signed out
      });

      if (error) {
        console.error("AuthProvider: Sign out error:", error);
        throw error;
      }

      console.log("AuthProvider: Successfully signed out from Supabase");
      
      // Force clear any remaining localStorage items related to auth
      localStorage.removeItem('supabase.auth.token');
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account",
      });
      
      // Navigation is now handled by the onAuthStateChange event listener
      // This prevents any race conditions or state conflicts
    } catch (error) {
      console.error("AuthProvider: Sign out error:", error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
      });
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
