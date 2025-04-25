
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface ArticleInput {
  title: string;
  content: string;
  images?: File[];
  selectedSites?: string[];
}

export function useArticles() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const submitArticle = async ({ title, content, images = [], selectedSites = [] }: ArticleInput) => {
    if (!user) throw new Error("User must be authenticated to submit an article");
    
    console.log("Starting article submission process");
    
    // First save the article to Supabase
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .insert({ 
        title, 
        content, 
        user_id: user.id,
        selected_sites: selectedSites
      })
      .select()
      .single();

    if (articleError) {
      console.error("Error saving article to database:", articleError);
      throw articleError;
    }

    console.log("Article saved to database successfully");

    // Handle image uploads
    if (images.length > 0) {
      console.log(`Uploading ${images.length} images`);
      for (const [index, image] of images.entries()) {
        const fileExt = image.name.split('.').pop();
        const sanitizedTitle = sanitizeFileName(title);
        const filePath = `${article.id}/${sanitizedTitle}-${index + 1}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('article-images')
          .upload(filePath, image);

        if (uploadError) {
          console.error(`Error uploading image ${index + 1}:`, uploadError);
          throw uploadError;
        }

        await supabase
          .from('article_images')
          .insert([{ article_id: article.id, storage_path: filePath }]);
      }
      console.log("All images uploaded successfully");
    }

    // Process with AI and create Notion pages
    console.log("Calling process-article edge function");
    const { data, error: processError } = await supabase.functions.invoke('process-article', {
      body: {
        title,
        content,
        selectedSites,
        userEmail: user.email
      }
    });

    if (processError) {
      console.error('Process article error:', processError);
      throw processError;
    }

    console.log('Edge function response:', data);
    return { article, notionUrls: data?.versions?.map(v => v.url) };
  };

  const mutation = useMutation({
    mutationFn: submitArticle,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast({
        title: "Article Submitted Successfully",
        description: "Your article has been submitted. Check your email for confirmation.",
      });

      // If no email, show the Notion URLs in a toast
      if (result.notionUrls && result.notionUrls.length > 0) {
        toast({
          title: "Notion Page Links",
          description: "Links to your article versions have been sent to your email.",
          duration: 10000 // Show for 10 seconds
        });
      }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit article. Please try again.",
      });
      console.error('Article submission error:', error);
    },
  });

  const sanitizeFileName = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  return { submitArticle: mutation.mutate, isSubmitting: mutation.isPending };
}
