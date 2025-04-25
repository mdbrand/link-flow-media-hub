
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Sparkles, Slash } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const PricingSection = () => {
  const navigate = useNavigate();

  const handlePurchase = (planName: string) => {
    // Temporarily redirect all plans to Launch Special
    navigate(`/payment?plan=${encodeURIComponent("Launch Special")}`);
  };

  // Define pricing tiers
  const pricingTiers = [
    {
      name: "Starter",
      price: "$297",
      description: "Perfect for small businesses and startups",
      features: [
        "Featured on 4 media sites",
        "1 article submission",
        "Basic AI adaptation",
        "Editorial review",
        "30-day publishing window"
      ],
      popular: false
    },
    {
      name: "Growth",
      price: "$497",
      description: "Ideal for growing businesses seeking wider reach",
      features: [
        "Featured on 8 media sites",
        "2 article submissions",
        "Advanced AI adaptation",
        "Priority editorial review",
        "21-day publishing window",
        "Social media amplification"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$997",
      description: "Complete solution for established businesses",
      features: [
        "Featured on ALL 12 media sites",
        "3 article submissions",
        "Premium AI adaptation",
        "VIP editorial review",
        "14-day publishing window",
        "Social media amplification",
        "Analytics dashboard"
      ],
      popular: false
    }
  ];

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
                onClick={() => handlePurchase("Launch Special")}
                className="bg-white text-[#8B5CF6] hover:bg-purple-50 text-lg px-8 py-6 shadow-md"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Claim Offer Now
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your <span className="text-[#9b87f5]">Coverage</span> Plan</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the perfect package to boost your visibility with our AI-powered content adaptation.
          </p>
        </div>

        {/* Regular Pricing Tiers */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {pricingTiers.map((tier, index) => (
            <Card 
              key={index}
              className={`relative overflow-hidden transition-all hover:shadow-xl ${
                tier.popular ? "border-[#9b87f5] border-2" : ""
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-[#9b87f5] text-white px-3 py-1 rounded-bl-lg font-medium">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="mt-4 flex items-center">
                  <div className="relative inline-block">
                    <span className="text-3xl font-bold text-gray-300 line-through decoration-red-500 decoration-4">{tier.price}</span>
                    <span className="text-black text-3xl font-bold ml-2">$97</span>
                  </div>
                  <span className="text-gray-500 ml-2">one-time</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handlePurchase(tier.name)}
                  className={`w-full ${
                    tier.popular ? "bg-[#9b87f5] hover:bg-[#8B5CF6]" : ""
                  }`}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Claim Special Offer
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
