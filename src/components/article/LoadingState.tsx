
import Header from '@/components/Header';

export const LoadingState = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    </div>
  );
};
