
import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";

interface ImageUploaderProps {
  images: string[];
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
}

export const ImageUploader = ({ images, onUpload, onRemove }: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4">
      <FormLabel>Images (Max 3)</FormLabel>
      <div className="grid grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative">
            <img 
              src={image}
              alt={`Upload ${index + 1}`}
              className="w-full h-32 object-cover rounded-md"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => onRemove(index)}
              className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full"
            >
              ×
            </Button>
          </div>
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
        onChange={onUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};
