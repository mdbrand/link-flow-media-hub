
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
  return (
    <section id="pricing" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your <span className="text-[#9b87f5]">Media Coverage</span> Package</h2>
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
                  className={`w-full ${plan.recommended ? 'bg-[#9b87f5] hover:bg-[#8B5CF6]' : 'bg-gray-800 hover:bg-gray-700'}`}
                >
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
