
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Sparkles, BadgePercent, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const PricingSection = () => {
  const navigate = useNavigate();

  const handlePurchase = (planName: string) => {
    navigate(`/payment?plan=${encodeURIComponent("Launch Special")}`);
  };

  const pricingTiers = [
    {
      name: "Starter",
      price: "$297",
      description: "Perfect for small businesses and startups",
      features: [
        "Featured on 3 media sites",
        "1 revision request",
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
        "Featured on 6 media sites",
        "2 revision requests",
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
        "Featured on ALL media sites",
        "3 revision requests",
        "Premium AI adaptation",
        "VIP editorial review",
        "14-day publishing window",
        "Social media amplification",
        "Podcast interview, guaranteed booking"
      ],
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Special Launch Offer Banner */}
        <div className="mb-12 transform hover:scale-105 transition-transform relative">
          <div className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] rounded-lg p-6 shadow-lg border border-purple-300">
            {/* New Badge to make offer pop */}
            <div className="absolute -top-4 right-4 z-10">
              <div className="bg-yellow-300 text-black px-3 py-1 rounded-full font-bold text-sm flex items-center space-x-2 shadow-lg">
                <BadgePercent className="h-5 w-5 text-red-600" />
                <span>Limited Time Offer!</span>
              </div>
            </div>

            <div className="flex items-center justify-between flex-col md:flex-row gap-6">
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <Sparkles className="h-8 w-8 text-yellow-300 animate-pulse" />
                  <h3 className="text-2xl font-bold text-white">🎉 Exclusive Limited Time Offer Special</h3>
                </div>
                <p className="text-purple-100 text-lg mb-4">
                  Get published on 6 media sites of your choice for just <span className="font-bold text-yellow-300">$97</span>
                </p>
                <ul className="text-white space-y-2 mb-4">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-yellow-300 mr-2" />
                    Select from our list of 12 premium sites
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-yellow-300 mr-2" />
                    Advanced AI custom articles
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-yellow-300 mr-2" />
                    Request publishing date (within a 45-day window)
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-yellow-300 mr-2" />
                    Priority editorial review
                  </li>
                </ul>
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
                  <span className="text-3xl font-bold">{tier.price}</span>
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
                  disabled={true}
                >
                  <X className="mr-2 h-4 w-4" />
                  Currently Unavailable
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
