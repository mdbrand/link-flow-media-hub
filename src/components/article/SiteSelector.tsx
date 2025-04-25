
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Control } from "react-hook-form";

interface Site {
  id: string;
  name: string;
}

interface SiteSelectorProps {
  control: Control<any>;
  availableSites: Site[];
}

export const SiteSelector = ({ control, availableSites }: SiteSelectorProps) => {
  const { toast } = useToast();

  return (
    <FormField
      control={control}
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
                        : field.value?.filter((id: string) => id !== site.id) || [];
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
  );
};
