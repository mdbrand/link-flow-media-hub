
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
              Extend Your Reach Even Further By Getting Booked On Podcasts Without Chasing Anyone.
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
                Podcast Like a Pro...Without the Grind
              </h3>
              <p className="text-lg text-gray-700">
                Why chase interviews when they can come to you?
              </p>
              <p className="text-lg text-gray-700">
                PodMatch connects you with the right podcasts fast: no pitching, no spreadsheets, no wasted time.
              </p>
              <p className="text-lg text-gray-700">
                It's like having a booking agent, minus the commission and drama.
              </p>
              <p className="text-lg text-gray-700">
                Get matched. Get interviewed. Get heard.
              </p>
              <p className="text-lg text-gray-700 font-semibold">
                Step up. Speak out. PodMatch makes it effortless.
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
