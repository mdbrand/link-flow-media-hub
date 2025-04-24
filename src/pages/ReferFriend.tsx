
import { Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const ReferFriend = () => {
  const navigate = useNavigate();

  const shareWithFriend = () => {
    // Using Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: 'Join me on this amazing platform!',
        text: 'I just published my first article. Check out this great platform!',
        url: window.location.origin
      }).catch(console.error);
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.origin)
        .then(() => alert('Link copied to clipboard!'))
        .catch(console.error);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-2xl mx-auto pt-12">
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
              Thank you for sharing your thoughts with us! Would you like to invite your friends to join our community?
            </p>
            <div className="space-y-4">
              <Button 
                onClick={shareWithFriend}
                className="w-full max-w-md bg-purple-600 hover:bg-purple-700"
              >
                Share With Friends
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/")}
                className="w-full max-w-md"
              >
                Return Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReferFriend;
