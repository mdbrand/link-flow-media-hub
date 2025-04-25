
import React from 'react';
import SalesHero from '@/components/sales/SalesHero';
import TechnologySection from '@/components/sales/TechnologySection';
import ProcessSteps from '@/components/sales/ProcessSteps';
import RegularPricing from '@/components/sales/RegularPricing';
import SpecialOffer from '@/components/sales/SpecialOffer';
import TestimonialsSection from '@/components/sales/TestimonialsSection';
import ContactFooter from '@/components/sales/ContactFooter';

const Sales = () => {
  return (
    <div className="min-h-screen bg-white">
      <SalesHero />
      
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

        <TechnologySection />
        <ProcessSteps />
        <RegularPricing />
        <SpecialOffer />
        <TestimonialsSection />
        <ContactFooter />
      </div>
    </div>
  );
};

export default Sales;
