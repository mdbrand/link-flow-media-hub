
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const pricingPlans = [
  {
    name: "Starter",
    price: "$297",
    description: "Perfect for individuals and small businesses",
    recommended: false,
    features: [
      "Featured on 5 media sites",
      "1 article submission",
      "Basic AI adaptation",
      "Standard editorial review",
      "30-day publishing window",
      "Basic performance metrics"
    ]
  },
  {
    name: "Growth",
    price: "$497",
    description: "Best for growing businesses and professionals",
    recommended: true,
    features: [
      "Featured on all 12 media sites",
      "1 article submission",
      "Advanced AI optimization",
      "Priority editorial review",
      "14-day publishing window",
      "Detailed performance analytics",
      "Social media promotion",
      "PDF certificate of publication"
    ]
  },
  {
    name: "Enterprise",
    price: "$997",
    description: "For established businesses needing maximum exposure",
    recommended: false,
    features: [
      "Featured on all 12 media sites",
      "3 article submissions",
      "Premium AI customization",
      "VIP editorial treatment",
      "7-day publishing window",
      "Comprehensive analytics dashboard",
      "Social media campaign",
      "Featured spotlight placement",
      "Dedicated account manager",
      "Quarterly strategy session"
    ]
  }
];

const PricingSection = () => {
  const navigate = useNavigate();

  const handlePurchase = (planName: string, isSpecialOffer: boolean = false) => {
    if (isSpecialOffer) {
      navigate(`/payment?plan=Launch Special`);
    } else {
      navigate(`/payment?plan=${planName}`);
    }
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
                onClick={() => handlePurchase('Launch Special', true)}
                className="bg-white text-[#8B5CF6] hover:bg-purple-50 text-lg px-8 py-6 shadow-md"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Claim Offer Now
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Regular <span className="text-[#9b87f5]">Media Coverage</span> Packages</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the package that best fits your needs and budget. All packages include our proprietary AI-powered content adaptation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`flex flex-col h-full ${plan.recommended ? 'border-[#9b87f5] shadow-lg relative' : ''}`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-4 py-1 bg-[#9b87f5] text-white text-sm rounded-full">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">{plan.name}</CardTitle>
                <CardDescription className="text-center">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-500"> / one time</span>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-[#9b87f5] mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-4">
                <Button 
                  onClick={() => handlePurchase(plan.name)}
                  className={`w-full ${plan.recommended ? 'bg-[#9b87f5] hover:bg-[#8B5CF6]' : 'bg-gray-800 hover:bg-gray-700'}`}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
