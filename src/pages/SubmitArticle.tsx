import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArticles } from '@/hooks/useArticles';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/Header';
import { ArticleForm, availableSites } from '@/components/article/ArticleForm';
import { supabase } from '@/integrations/supabase/client';

const SubmitArticle = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { submitArticle, isSubmitting } = useArticles();
  const { toast } = useToast();
  const [remainingSubmissions, setRemainingSubmissions] = useState<number | null>(null);
  const [isCheckingSubs, setIsCheckingSubs] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      console.log("No authenticated user found, redirecting to signup");
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign up or log in to submit an article",
      });
      navigate('/signup');
    } else if (user) {
      const checkSubmissions = async () => {
        setIsCheckingSubs(true);
        let allowed = 0;
        let submitted = 0;

        try {
          const { count: orderCount, error: orderError } = await supabase
            .from('orders')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('status', 'completed');
          
          if (orderError) console.error("Error checking orders:", orderError);
          if (orderCount && orderCount > 0) {
            allowed = 1;
          }

          const { count: articleCount, error: articleError } = await supabase
            .from('articles')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id);

          if (articleError) console.error("Error checking articles:", articleError);
          if (articleCount !== null) {
            submitted = articleCount;
          }

          setRemainingSubmissions(Math.max(0, allowed - submitted));

        } catch (err) {
          console.error("Error calculating submissions:", err);
          setRemainingSubmissions(0);
        } finally {
          setIsCheckingSubs(false);
        }
      };
      checkSubmissions();
    }
  }, [user, loading, navigate, toast]);

  const isPageLoading = loading || isCheckingSubs;

  if (isPageLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading submission details...</div>;
  }

  if (!user && !loading) {
    return null;
  }

  const handleSubmit = async (values: any) => {
    if (remainingSubmissions !== null && remainingSubmissions <= 0) {
      toast({
        variant: "destructive",
        title: "No Submissions Left",
        description: "You have used all your available article submissions.",
      });
      return;
    }

    const extractedFiles = values.images.map((url: string) => {
      return fetch(url).then(r => r.blob()).then(blob => 
        new File([blob], `article-image-${Math.random().toString(36).substring(7)}.jpg`, { type: blob.type })
      );
    });

    const imageFiles = await Promise.all(extractedFiles);

    await submitArticle({
      title: values.title,
      content: values.content,
      images: imageFiles,
      selectedSites: values.selectedSites.map((siteId: string) => 
        availableSites.find(site => site.id === siteId)?.name || siteId
      ),
    });

    values.images.forEach((url: string) => URL.revokeObjectURL(url));

    navigate('/refer-friend');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 p-4 max-w-4xl mx-auto w-full">
        <ArticleForm 
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          remainingSubmissions={remainingSubmissions ?? 0}
        />
      </div>
    </div>
  );
};

export default SubmitArticle;
