
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface SubmissionLimitResult {
  canSubmit: boolean;
  isLoading: boolean;
  remainingSubmissions: number;
  totalPaid: number;
  totalSubmitted: number;
  error: string | null;
  refreshSubmissionStatus: () => Promise<void>;
}

export function useSubmissionLimit(): SubmissionLimitResult {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [canSubmit, setCanSubmit] = useState(false);
  const [remainingSubmissions, setRemainingSubmissions] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalSubmitted, setTotalSubmitted] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const checkSubmissionLimit = async () => {
    if (!user) {
      setIsLoading(false);
      setCanSubmit(false);
      setRemainingSubmissions(0);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Checking submission limit for user:", user.id);
      
      // Get total paid orders - including both 'paid' status and orders without status (legacy support)
      const { data: orders, error: orderError } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'paid');
      
      if (orderError) {
        console.error("Error fetching orders:", orderError);
        throw orderError;
      }
      
      // Get any pending orders that might need to be counted
      const { data: pendingOrders, error: pendingError } = await supabase
        .from('orders')
        .select('id, stripe_session_id')
        .eq('user_id', user.id)
        .eq('status', 'pending');
      
      if (pendingError) {
        console.error("Error fetching pending orders:", pendingError);
      }
      
      const paidOrderCount = (orders?.length || 0);
      console.log(`Found ${paidOrderCount} paid orders for user ${user.id}`);
      console.log(`Found ${pendingOrders?.length || 0} pending orders for user ${user.id}`);
      
      setTotalPaid(paidOrderCount);
      
      // Get total submitted articles
      const { data: articles, error: articleError } = await supabase
        .from('articles')
        .select('id')
        .eq('user_id', user.id);
        
      if (articleError) {
        console.error("Error fetching articles:", articleError);
        throw articleError;
      }
      
      const articleCount = articles?.length || 0;
      console.log(`Found ${articleCount} submitted articles`);
      setTotalSubmitted(articleCount);
      
      // Calculate remaining submissions
      const remaining = Math.max(0, paidOrderCount - articleCount);
      console.log(`User has ${remaining} remaining submissions`);
      setRemainingSubmissions(remaining);
      setCanSubmit(remaining > 0);
      
      if (remaining === 0 && paidOrderCount > 0) {
        toast({
          description: "You've used all your available article submissions. Purchase more to continue.",
          variant: "default",
        });
      }
    } catch (err: any) {
      console.error('Error checking submission limit:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    checkSubmissionLimit();
  }, [user]);

  return {
    canSubmit,
    isLoading,
    remainingSubmissions,
    totalPaid,
    totalSubmitted,
    error,
    refreshSubmissionStatus: checkSubmissionLimit
  };
}
