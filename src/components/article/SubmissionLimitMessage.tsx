
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useState } from "react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SubmissionLimitMessageProps {
  totalPaid: number;
}

export const SubmissionLimitMessage = ({ totalPaid }: SubmissionLimitMessageProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const refreshSubmissionStatus = async () => {
    setIsRefreshing(true);
    try {
      // Force a re-check of orders with a small delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        description: "Submission status refreshed. If you made a recent purchase, please try again.",
      });
      // Redirect to submit-article to trigger a fresh check
      navigate('/submit-article');
    } catch (error) {
      console.error("Error refreshing status:", error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 p-4 max-w-4xl mx-auto w-full">
        <Card>
          <CardHeader>
            <CardTitle>Submission Limit Reached</CardTitle>
            <CardDescription>
              You've used all your available article submissions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Submission Limit</AlertTitle>
              <AlertDescription>
                {totalPaid === 0 
                  ? "You need to make a purchase to submit articles."
                  : `Each payment allows for one article submission. You've already submitted ${totalPaid} article${totalPaid !== 1 ? 's' : ''}.`
                }
              </AlertDescription>
            </Alert>
            <p className="text-gray-600">To submit more articles, you'll need to make another purchase.</p>
            
            {totalPaid > 0 && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
                <h3 className="font-medium text-amber-800 mb-2">Did you just make a purchase?</h3>
                <p className="text-sm text-amber-700 mb-3">
                  If you recently made a payment and are still seeing this message, try refreshing your submission status.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-amber-700 border-amber-300"
                  onClick={refreshSubmissionStatus}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Submission Status
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigate('/submissions')}>
              View My Submissions
            </Button>
            <Button onClick={() => navigate('/payment?plan=Launch Special')}>
              Purchase Article Submission
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
