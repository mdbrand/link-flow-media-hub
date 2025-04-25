
import React from 'react';

const steps = [
  "Submit one well-crafted article through our elegant dashboard.",
  "Our AI technology adapts your content to match each publication's unique voice.",
  "Real human editors review everything for quality assurance.",
  "Your content gets published across our media network."
];

const ProcessSteps = () => {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-6">A Simple Process (That Actually Works)</h2>
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#9b87f5] text-white flex items-center justify-center mr-4">
              {index + 1}
            </div>
            <p className="text-lg text-gray-700">{step}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProcessSteps;
