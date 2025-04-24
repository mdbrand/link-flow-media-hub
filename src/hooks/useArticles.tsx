
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ArticleInput {
  title: string;
  content: string;
  images?: File[];
}

export function useArticles() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitArticle = async ({ title, content, images = [] }: ArticleInput) => {
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .insert([{ title, content }])
      .select()
      .single();

    if (articleError) throw articleError;

    if (images.length > 0) {
      for (const image of images) {
        const fileExt = image.name.split('.').pop();
        const filePath = `${article.id}/${Math.random()}.${fileExt}`;

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
