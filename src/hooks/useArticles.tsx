
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

    if (articleError) throw articleError;

    // Handle image uploads
    if (images.length > 0) {
      for (const [index, image] of images.entries()) {
        const fileExt = image.name.split('.').pop();
        const sanitizedTitle = sanitizeFileName(title);
        const filePath = `${article.id}/${sanitizedTitle}-${index + 1}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('article-images')
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        await supabase
          .from('article_images')
          .insert([{ article_id: article.id, storage_path: filePath }]);
      }
    }

    // Process with AI and create Notion pages
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

    // Log the Notion page URLs for debugging
    console.log('Notion Page URLs:', data?.versions?.map(v => v.url));

    return { article, notionUrls: data?.versions?.map(v => v.url) };
  };

  const mutation = useMutation({
    mutationFn: submitArticle,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast({
        title: "Article Submitted Successfully",
        description: "Your article is being processed. You'll receive an email with the AI-generated versions soon.",
      });

      // If no email, show the Notion URLs in a toast
      if (result.notionUrls && result.notionUrls.length > 0) {
        toast({
          title: "Notion Page Links",
          description: result.notionUrls.map((url, index) => 
            `Site ${index + 1}: ${url}`
          ).join('\n'),
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
