
import React from 'react';
import { Check } from "lucide-react";

const premiumSites = [
  "The LA Note - That entertainment media platform everyone's talking about",
  "Thought Leaders Ethos - Where serious entrepreneurs share ideas that matter",
  "MDBRAND - The digital marketing authority that influences the influencers",
  "Seismic Sports - Coverage that goes beyond scores to shape industry conversation",
  "New York Post Daily - Entertainment and lifestyle content with impressive audience numbers"
];

const TechnologySection = () => {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-6">How One Technology Changed Everything</h2>
      <p className="text-lg mb-6 leading-relaxed text-gray-700">
        The secret lies in our proprietary AI system - a technological marvel that transforms your 
        single submission into multiple custom-crafted pieces, each one feeling like it was written 
        specifically for that publication.
      </p>
      
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-bold mb-4">Our Growing Media Network Includes:</h3>
        <ul className="space-y-3">
          {premiumSites.map((site, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
              <span className="text-gray-700">{site}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TechnologySection;
