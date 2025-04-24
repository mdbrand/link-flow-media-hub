
import { Button } from "@/components/ui/button";
import { CreditCard, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BottomCtaBanner = () => {
  const navigate = useNavigate();

  const handlePurchase = () => {
    navigate(`/payment?plan=Launch Special`);
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="transform hover:scale-105 transition-transform">
          <div className="bg-gradient-to-r from-[#8B5CF6] via-[#9b87f5] to-[#D946EF] rounded-lg p-8 shadow-lg border border-purple-300">
            <div className="flex items-center justify-between flex-col lg:flex-row gap-8">
              <div className="flex items-center space-x-4">
                <Sparkles className="h-10 w-10 text-yellow-300 animate-pulse" />
                <div className="text-center lg:text-left">
                  <h3 className="text-3xl font-bold text-white mb-2">Don't Miss This Opportunity! 🚀</h3>
                  <p className="text-xl text-purple-100">
                    For a limited time, get your content featured on all <span className="font-bold text-yellow-300">12 premium sites</span> for an incredible <span className="font-bold text-yellow-300">$97</span>
                  </p>
                </div>
              </div>
              <Button 
                onClick={handlePurchase}
                className="bg-white text-[#8B5CF6] hover:bg-purple-50 text-lg px-8 py-6 shadow-md w-full lg:w-auto"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Secure Your Spots Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BottomCtaBanner;
