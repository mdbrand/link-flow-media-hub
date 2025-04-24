import { useState, useRef } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(800, "Article must be at least 800 words"),
  images: z.array(z.string()).max(3, "Maximum 3 images allowed")
});

const SubmitArticle = () => {
  const [wordCount, setWordCount] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      images: []
    },
  });

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
    console.log('Form submitted:', values);
    toast({
      title: "Article Submitted",
      description: "Your article has been submitted for review.",
    });
    navigate('/refer-friend');
  };

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
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

              <Button type="submit" className="w-full">
                Submit Article
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmitArticle;
