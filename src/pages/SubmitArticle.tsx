
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArticles } from '@/hooks/useArticles';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/Header';
import { ArticleForm, availableSites } from '@/components/article/ArticleForm';

const SubmitArticle = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { submitArticle, isSubmitting } = useArticles();
  const { toast } = useToast();

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

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user && !loading) {
    return null;
  }

  const handleSubmit = async (values: any) => {
    // Extract the image files from object URLs
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

    // Clean up object URLs to prevent memory leaks
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
          remainingSubmissions={999} // Set a high number to bypass the limit
        />
      </div>
    </div>
  );
};

export default SubmitArticle;
