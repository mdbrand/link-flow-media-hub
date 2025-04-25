
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface SubmissionLimitResult {
  canSubmit: boolean;
  isLoading: boolean;
  remainingSubmissions: number;
  totalPaid: number;
  totalSubmitted: number;
  error: string | null;
}

export function useSubmissionLimit(): SubmissionLimitResult {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [canSubmit, setCanSubmit] = useState(false);
  const [remainingSubmissions, setRemainingSubmissions] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalSubmitted, setTotalSubmitted] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkSubmissionLimit() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Get total paid orders
        const { data: orders, error: orderError } = await supabase
          .from('orders')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'paid');
        
        if (orderError) throw orderError;
        
        const paidOrderCount = orders?.length || 0;
        setTotalPaid(paidOrderCount);
        
        // Get total submitted articles
        const { data: articles, error: articleError } = await supabase
          .from('articles')
          .select('id')
          .eq('user_id', user.id);
          
        if (articleError) throw articleError;
        
        const articleCount = articles?.length || 0;
        setTotalSubmitted(articleCount);
        
        // Calculate remaining submissions
        const remaining = Math.max(0, paidOrderCount - articleCount);
        setRemainingSubmissions(remaining);
        setCanSubmit(remaining > 0);
      } catch (err: any) {
        console.error('Error checking submission limit:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    checkSubmissionLimit();
  }, [user]);

  return {
    canSubmit,
    isLoading,
    remainingSubmissions,
    totalPaid,
    totalSubmitted,
    error
  };
}
