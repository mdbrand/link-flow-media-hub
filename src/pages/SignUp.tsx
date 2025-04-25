
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { useSignUp } from "@/hooks/useSignUp";
import { useEffect } from 'react';

const SignUp = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { isLoading, signUpError, handleSignUp } = useSignUp();
  
  useEffect(() => {
    if (user && !loading) {
      console.log("SignUp: User already authenticated, redirecting to submissions");
      navigate('/submissions');
    }
  }, [user, loading, navigate]);

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Create your account</CardTitle>
            <CardDescription className="text-center">
              Get started with your writer's journey today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignUpForm
              onSubmit={handleSignUp}
              isLoading={isLoading}
              error={signUpError}
            />
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 text-primary hover:text-primary/90"
                  onClick={() => navigate('/signin')}
                >
                  Sign in
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
