import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { useArticles } from '@/hooks/useArticles';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/Header';
import { WordCounter } from '@/components/article/WordCounter';
import { ImageUploader } from '@/components/article/ImageUploader';
import { SiteSelector } from '@/components/article/SiteSelector';

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(800, "Article must be at least 800 words"),
  images: z.array(z.string()).max(3, "Maximum 3 images allowed"),
  selectedSites: z.array(z.string()).min(6, "Please select 6 sites").max(6, "Maximum 6 sites allowed")
});

const availableSites = [
  { id: "site1", name: "Authentic Sacrifice" },
  { id: "site2", name: "Authority Maximizer" },
  { id: "site3", name: "Booked Impact" },
  { id: "site4", name: "Live Love Hobby" },
  { id: "site5", name: "MDB Consultancy" },
  { id: "site6", name: "MDBRAND" },
  { id: "site7", name: "New York Post Daily" },
  { id: "site8", name: "Seismic Sports" },
  { id: "site9", name: "The LA Note" },
  { id: "site10", name: "Thought Leaders Ethos" },
  { id: "site11", name: "Trending Consumerism" },
  { id: "site12", name: "HKlub Fitness" }
];

const SubmitArticle = () => {
  const [wordCount, setWordCount] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { submitArticle, isSubmitting } = useArticles();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      images: [],
      selectedSites: []
    },
  });

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
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && !loading) {
    return null;
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    form.setValue("content", content);
    setWordCount(content.trim().split(/\s+/).filter(Boolean).length);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && images.length + files.length <= 3) {
      const newImageFiles = Array.from(files);
      setImageFiles([...imageFiles, ...newImageFiles]);
      
      const newImageUrls = newImageFiles.map(file => URL.createObjectURL(file));
      const updatedImages = [...images, ...newImageUrls];
      setImages(updatedImages);
      form.setValue("images", updatedImages);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Maximum 3 images allowed",
      });
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
    setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    form.setValue("images", images.filter((_, index) => index !== indexToRemove));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await submitArticle({
      title: values.title,
      content: values.content,
      images: imageFiles,
      selectedSites: values.selectedSites.map(siteId => availableSites.find(site => site.id === siteId)?.name || siteId),
    });
    navigate('/refer-friend');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 p-4 max-w-4xl mx-auto w-full">
        <Card>
          <CardHeader>
            <CardTitle>Submit Your Article</CardTitle>
            <CardDescription>
              Write your article for publication. Minimum 800 words required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Article Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter article title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Article Content</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea 
                            placeholder="Write your article here..." 
                            className="min-h-[400px]"
                            {...field}
                            onChange={handleContentChange}
                          />
                          <WordCounter count={wordCount} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <ImageUploader
                  images={images}
                  onUpload={handleImageUpload}
                  onRemove={removeImage}
                />

                <SiteSelector
                  control={form.control}
                  availableSites={availableSites}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Article"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubmitArticle;
