import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PhoneCall, Mail, MapPin, Timer, Check, CircleCheck, Star } from "lucide-react";

const Sales = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/payment?plan=Launch Special');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
            I'm about to share something that could dramatically change how you think about{" "}
            <span className="text-[#9b87f5]">media coverage</span> forever.
          </h1>
          <p className="text-xl text-gray-600 text-center mb-8">
            It's a breakthrough that's so revolutionary, so downright practical, that once you understand it, 
            you'll wonder how you ever promoted your business the old way.
          </p>
          
          {/* Stars centered between subtitle and next section */}
          <div className="flex justify-center text-yellow-500 my-12">
            {[...Array(5)].map((_, index) => (
              <Star key={index} className="h-8 w-8 fill-current mx-1" />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">The Media Coverage Breakthrough</h2>
          <p className="text-lg mb-6 leading-relaxed text-gray-700">
            Remember the last time you tried getting featured in a publication? The endless emails. 
            The unanswered pitches. The feeling of being completely ignored despite having something valuable to share.
          </p>
          <p className="text-lg mb-6 leading-relaxed text-gray-700">
            What if I told you that frustrating experience is now completely obsolete?
          </p>
          <p className="text-xl mb-6 font-medium">
            Imagine submitting just one article... and then watching as it magically appears across multiple 
            premium publications, each version perfectly tailored to match that site's style and audience.
          </p>
        </section>

        {/* Technology Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">How One Technology Changed Everything</h2>
          <p className="text-lg mb-6 leading-relaxed text-gray-700">
            The secret lies in our proprietary AI system - a technological marvel that transforms your 
            single submission into multiple custom-crafted pieces, each one feeling like it was written 
            specifically for that publication.
          </p>
          
          {/* Premium Sites List */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-bold mb-4">Our Growing Media Network Includes:</h3>
            <ul className="space-y-3">
              {[
                "The LA Note - That entertainment media platform everyone's talking about",
                "Thought Leaders Ethos - Where serious entrepreneurs share ideas that matter",
                "MDBRAND - The digital marketing authority that influences the influencers",
                "Seismic Sports - Coverage that goes beyond scores to shape industry conversation",
                "New York Post Daily - Entertainment and lifestyle content with impressive audience numbers"
              ].map((site, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{site}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Process Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">A Simple Process (That Actually Works)</h2>
          <div className="space-y-6">
            {[
              "Submit one well-crafted article through our elegant dashboard.",
              "Our AI technology adapts your content to match each publication's unique voice.",
              "Real human editors review everything for quality assurance.",
              "Your content gets published across our media network."
            ].map((step, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#9b87f5] text-white flex items-center justify-center mr-4">
                  {index + 1}
                </div>
                <p className="text-lg text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Regular Pricing Section - For Contrast */}
        <section className="mb-12 bg-gray-50 p-8 rounded-xl">
          <h2 className="text-3xl font-bold mb-6">Regular Pricing Options</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {name: "Starter", price: "$297", sites: "3"},
              {name: "Growth", price: "$497", sites: "6"},
              {name: "Enterprise", price: "$997", sites: "ALL"}
            ].map((plan, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-3xl font-bold text-gray-700 mb-2">{plan.price}</p>
                <p className="text-gray-600">{plan.sites} media sites</p>
              </div>
            ))}
          </div>
        </section>

        {/* Limited Time Offer */}
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
            {[
              "Selection from our 12 premium sites",
              "Advanced AI custom article creation",
              "Your preferred publishing date (within 45 days)",
              "Priority editorial review"
            ].map((feature, index) => (
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

        {/* Testimonials */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">The Proof Is In The Placements</h2>
          <div className="space-y-6">
            {[
              {
                quote: "I was skeptical at first - really skeptical. But then I saw our company featured on sites we had been trying to get into for months. Our credibility skyrocketed, and business inquiries jumped 40% in just two weeks.",
                author: "Sarah J.",
                role: "Marketing Director"
              },
              {
                quote: "Their AI technology is unlike anything I've encountered. Our article was transformed perfectly for each publication, making it feel native to each site while maintaining our core message. My expectations weren't just met - they were shattered.",
                author: "David C.",
                role: "CEO"
              },
              {
                quote: "This investment delivered real results. The credibility boost from being featured across respected publications was exactly what our business needed to stand out.",
                author: "Maria R.",
                role: "Small Business Owner"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                <p className="font-bold">{testimonial.author}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Information */}
        <footer className="text-center border-t pt-12 pb-8">
          <h3 className="text-2xl font-bold mb-6">MediaBoost</h3>
          <div className="space-y-3 text-gray-600">
            <p className="flex items-center justify-center">
              <MapPin className="h-5 w-5 mr-2" />
              21151 S Western Ave. Torrance, CA 90501
            </p>
            <p className="flex items-center justify-center">
              <Mail className="h-5 w-5 mr-2" />
              info@bookedimpact.com
            </p>
            <p className="flex items-center justify-center">
              <PhoneCall className="h-5 w-5 mr-2" />
              (562) 444-5620
            </p>
          </div>
          <p className="mt-8 text-sm text-gray-500">
            © 2025 MediaBoost. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Sales;
