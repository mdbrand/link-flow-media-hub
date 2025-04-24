
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const PricingSection = () => {
  const navigate = useNavigate();

  const handlePurchase = () => {
    navigate(`/payment?plan=Launch Special`);
  };

  return (
    <section id="pricing" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Special Launch Offer Banner */}
        <div className="mb-12 transform hover:scale-105 transition-transform">
          <div className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] rounded-lg p-6 shadow-lg border border-purple-300">
            <div className="flex items-center justify-between flex-col md:flex-row gap-6">
              <div className="flex items-center space-x-4">
                <Sparkles className="h-8 w-8 text-yellow-300 animate-pulse" />
                <div>
                  <h3 className="text-2xl font-bold text-white">🎉 Special Launch Offer</h3>
                  <p className="text-purple-100 text-lg">
                    Get published on ALL 12 media sites for just <span className="font-bold text-yellow-300">$97</span>
                  </p>
                </div>
              </div>
              <Button 
                onClick={handlePurchase}
                className="bg-white text-[#8B5CF6] hover:bg-purple-50 text-lg px-8 py-6 shadow-md"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Claim Offer Now
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Limited Time <span className="text-[#9b87f5]">Media Coverage</span> Offer</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Exclusive launch special to help you boost your visibility with our AI-powered content adaptation.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
