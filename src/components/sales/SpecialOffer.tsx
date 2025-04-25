
import React from 'react';
import { Button } from "@/components/ui/button";
import { Timer, CircleCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  "Selection from our 12 premium sites",
  "Advanced AI custom article creation",
  "Your preferred publishing date (within 45 days)",
  "Priority editorial review"
];

const SpecialOffer = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/payment?plan=Launch Special');
  };

  return (
    <section className="bg-gradient-to-r from-[#9b87f5] to-[#8B5CF6] p-8 rounded-xl text-white mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Limited Time Special Offer</h2>
        <Timer className="h-8 w-8" />
      </div>
      <p className="text-xl mb-6">
        Get published on 6 media sites of your choice for just{" "}
        <span className="text-4xl font-bold">$97</span>
      </p>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <CircleCheck className="h-5 w-5 text-yellow-300 mr-2" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button 
        onClick={handleGetStarted}
        className="w-full bg-white text-[#9b87f5] hover:bg-gray-100 text-lg py-6"
      >
        Claim Your $97 Special Now
      </Button>
      <p className="text-sm text-center mt-4 text-yellow-200">
        *Regular price $497 - Save $400 with this special offer
      </p>
    </section>
  );
};

export default SpecialOffer;
