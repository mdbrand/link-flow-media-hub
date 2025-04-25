
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { useSignUp } from "@/hooks/useSignUp";
import { useEffect } from 'react';
import { AuthCard } from '@/components/auth/AuthCard';

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
      <AuthCard 
        title="Loading"
        description=""
      >
        <div className="flex items-center justify-center">
          <p className="text-lg">Loading...</p>
        </div>
      </AuthCard>
    );
  }

  const footer = (
    <CardFooter className="flex justify-center">
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
    </CardFooter>
  );

  return (
    <AuthCard
      title="Create your account"
      description="Get started with your writer's journey today"
      footer={footer}
    >
      <SignUpForm
        onSubmit={handleSignUp}
        isLoading={isLoading}
        error={signUpError}
      />
    </AuthCard>
  );
};

export default SignUp;
