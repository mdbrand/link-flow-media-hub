
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const AuthCard = ({ title, description, children, footer }: AuthCardProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">{title}</CardTitle>
            <CardDescription className="text-center">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
          {footer}
        </Card>
      </div>
    </div>
  );
};
