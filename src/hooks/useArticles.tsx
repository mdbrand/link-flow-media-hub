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

const sanitizeFileName = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

export function useArticles() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const submitArticle = async ({ title, content, images = [], selectedSites = [] }: ArticleInput) => {
    if (!user) throw new Error("User must be authenticated to submit an article");
    
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

    return article;
  };

  const mutation = useMutation({
    mutationFn: submitArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast({
        title: "Success",
        description: "Your article has been submitted successfully.",
      });
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

  return { submitArticle: mutation.mutate, isSubmitting: mutation.isPending };
}
