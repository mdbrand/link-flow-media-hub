
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArticles } from '@/hooks/useArticles';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/hooks/use-toast";
import { useSubmissionLimit } from "@/hooks/useSubmissionLimit";
import Header from '@/components/Header';
import { LoadingState } from '@/components/article/LoadingState';
import { SubmissionLimitMessage } from '@/components/article/SubmissionLimitMessage';
import { ArticleForm, availableSites } from '@/components/article/ArticleForm';

const SubmitArticle = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { submitArticle, isSubmitting } = useArticles();
  const { toast } = useToast();
  const { canSubmit, isLoading: checkingLimit, remainingSubmissions, totalPaid } = useSubmissionLimit();

  useEffect(() => {
    if (!loading && !user) {
      console.log("No authenticated user found, redirecting to signup");
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign up or log in to submit an article",
      });
      navigate('/signup');
    }
  }, [user, loading, navigate, toast]);

  if (loading || checkingLimit) {
    return <LoadingState />;
  }

  if (!user && !loading) {
    return null;
  }
  
  if (!canSubmit && !checkingLimit) {
    return (
      <>
        <Header />
        <SubmissionLimitMessage totalPaid={totalPaid} />
      </>
    );
  }

  const handleSubmit = async (values: any) => {
    await submitArticle({
      title: values.title,
      content: values.content,
      images: values.images,
      selectedSites: values.selectedSites.map((siteId: string) => 
        availableSites.find(site => site.id === siteId)?.name || siteId
      ),
    });
    navigate('/refer-friend');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 p-4 max-w-4xl mx-auto w-full">
        <ArticleForm 
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          remainingSubmissions={remainingSubmissions}
        />
      </div>
    </div>
  );
};

export default SubmitArticle;
