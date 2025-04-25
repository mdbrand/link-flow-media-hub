
import React from 'react';
import { Star } from "lucide-react";

const SalesHero = () => {
  return (
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
        <div className="flex justify-center text-yellow-500 my-2">
          {[...Array(5)].map((_, index) => (
            <Star key={index} className="h-8 w-8 fill-current mx-1" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesHero;
