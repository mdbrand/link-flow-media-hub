import { useState, useRef, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useArticles } from '@/hooks/useArticles';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/Header';

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(800, "Article must be at least 800 words"),
  images: z.array(z.string()).max(3, "Maximum 3 images allowed"),
  selectedSites: z.array(z.string()).min(6, "Please select 6 sites").max(6, "Maximum 6 sites allowed")
});

const SubmitArticle = () => {
  const [wordCount, setWordCount] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const availableSites = [
    { id: "site1", name: "Tech Insider Daily" },
    { id: "site2", name: "Business Growth Weekly" },
    { id: "site3", name: "Digital Innovation Hub" },
    { id: "site4", name: "Marketing Trends Today" },
    { id: "site5", name: "Startup Success Stories" },
    { id: "site6", name: "Enterprise Solutions Review" },
    { id: "site7", name: "Future Tech Magazine" },
    { id: "site8", name: "Industry Leaders Forum" },
    { id: "site9", name: "Global Business Insights" },
    { id: "site10", name: "Digital Transformation Weekly" }
  ];

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
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
      form.setValue("images", [...images, ...newImages]);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Maximum 3 images allowed",
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const files = fileInputRef.current?.files;
    await submitArticle({
      title: values.title,
      content: values.content,
      images: files ? Array.from(files) : [],
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
                          <div className="absolute bottom-2 right-2 flex items-center gap-2 text-sm text-gray-500 bg-white px-2 py-1 rounded-md">
                            <Text size={16} />
                            <span>{wordCount} words</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="selectedSites"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select 6 Media Sites for Publication</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {availableSites.map((site) => (
                            <div key={site.id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={site.id}
                                checked={field.value?.includes(site.id)}
                                onChange={(e) => {
                                  const updatedSelection = e.target.checked
                                    ? [...(field.value || []), site.id]
                                    : field.value?.filter((id) => id !== site.id) || [];
                                  if (updatedSelection.length <= 6) {
                                    field.onChange(updatedSelection);
                                  } else {
                                    toast({
                                      variant: "destructive",
                                      title: "Selection limit reached",
                                      description: "You can only select 6 sites",
                                    });
                                  }
                                }}
                                className="h-4 w-4 rounded border-gray-300 text-[#9b87f5] focus:ring-[#9b87f5]"
                                disabled={!field.value?.includes(site.id) && (field.value?.length || 0) >= 6}
                              />
                              <label htmlFor={site.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {site.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormLabel>Images (Max 3)</FormLabel>
                  <div className="grid grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <img 
                        key={index}
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    ))}
                  </div>
                  {images.length < 3 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Upload Image ({3 - images.length} remaining)
                    </Button>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

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
