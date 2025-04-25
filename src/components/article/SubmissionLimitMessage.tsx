
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface SubmissionLimitMessageProps {
  totalPaid: number;
}

export const SubmissionLimitMessage = ({ totalPaid }: SubmissionLimitMessageProps) => {
  const navigate = useNavigate();
  
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
                Each payment allows for one article submission. You've already submitted {totalPaid} article{totalPaid !== 1 ? 's' : ''}.
              </AlertDescription>
            </Alert>
            <p>To submit more articles, you'll need to make another purchase.</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/submissions')}>
              View My Submissions
            </Button>
            <Button onClick={() => navigate('/payment?plan=Launch Special')}>
              Purchase Another Submission
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
