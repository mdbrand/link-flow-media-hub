
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How can you guarantee that I get published?",
    answer: "We have established partnerships with 12 premium media sites in various niches. Our AI technology adapts your content to match each site's editorial guidelines and style requirements, which is then reviewed by our editorial team before submission to our partner publications."
  },
  {
    question: "Do I need to write different articles for each site?",
    answer: "No, that's the beauty of our service! You only need to submit one high-quality article. Our AI technology will adapt and optimize that article for each publication while maintaining your core message and unique insights."
  },
  {
    question: "How long does the entire process take?",
    answer: "The timeline depends on the package you choose. Our Starter package has a 30-day publishing window, Growth package 14 days, and Enterprise package just 7 days. This is the maximum time it takes to get your content published across all included sites."
  },
  {
    question: "Do I retain the rights to my published content?",
    answer: "Yes, you retain the intellectual property rights to your core content. However, the adapted versions published on our partner sites will typically belong to those publications, as is standard in media publishing."
  },
  {
    question: "Can I choose which media sites my content is published on?",
    answer: "With our Growth and Enterprise packages, you can provide preferences for which sites you'd like to prioritize. While we can't guarantee specific placements as it depends on editorial acceptance, we do our best to accommodate your preferences."
  },
  {
    question: "What types of content can I submit?",
    answer: "We accept thought leadership articles, industry analyses, how-to guides, and opinion pieces. Content should be informative and valuable to readers rather than overtly promotional. Our team can help guide you on creating appropriate content during onboarding."
  }
];

const FaqSection = () => {
  return (
    <section id="faq" className="py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked <span className="text-[#9b87f5]">Questions</span></h2>
          <p className="text-xl text-gray-600">
            Find answers to common questions about our media placement service
          </p>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger className="text-left font-medium text-lg">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FaqSection;
