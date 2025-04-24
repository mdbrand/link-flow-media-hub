
import { Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const ReferFriend = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-2xl mx-auto pt-12 space-y-8">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-6">
              <Smile className="w-20 h-20 text-purple-500" />
            </div>
            <CardTitle className="text-3xl font-bold text-purple-700">
              Your Article Has Been Submitted!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-gray-600">
              Thank you for sharing your thoughts with us!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-purple-700 text-center">
              Ready to Amplify Your Message?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="aspect-video rounded-lg overflow-hidden">
              <img
                src="/lovable-uploads/81a18221-f6de-4a94-9591-d5c694bed5fe.png"
                alt="Professional podcast studio setup"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-6 text-center">
              <h3 className="text-2xl font-bold text-purple-700">
                Podcast Like a Pro Without Lifting a Finger (Okay, Maybe Just One Click)
              </h3>
              <p className="text-lg text-gray-700">
                PodMatch is like having a full-time podcasting assistant, minus the awkward small talk. 
                It finds your perfect match, handles the admin grunt work, and keeps your interviews 
                flowing like hot takes in a Reddit thread.
              </p>
              <p className="text-lg text-gray-700">
                Get featured on top podcasts and share your story with the world through PodMatch!
              </p>

              <div className="space-y-4">
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 w-full max-w-md"
                  onClick={() => window.open("https://www.joinpodmatch.com/mdbrand", "_blank")}
                >
                  Join PodMatch Now
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/")}
                  className="w-full max-w-md"
                >
                  Return Home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReferFriend;
