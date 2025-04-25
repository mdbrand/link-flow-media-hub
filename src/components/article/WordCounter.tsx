
import { Text } from "lucide-react";

interface WordCounterProps {
  count: number;
}

export const WordCounter = ({ count }: WordCounterProps) => {
  return (
    <div className="absolute bottom-2 right-2 flex items-center gap-2 text-sm text-gray-500 bg-white px-2 py-1 rounded-md">
      <Text size={16} />
      <span>{count} words</span>
    </div>
  );
};
