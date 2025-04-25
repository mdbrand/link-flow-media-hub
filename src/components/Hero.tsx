
import { Button } from "@/components/ui/button";

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-12 md:py-20 px-4 bg-gradient-to-r from-purple-50 to-indigo-50">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Stop Chasing Media Coverage: Our AI Instantly Places You Across <span className="text-[#9b87f5]">Premium Sites</span> With One Submission
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Boost your credibility with guaranteed featured placements across our growing media network, where our proprietary AI transforms your single submission into multiple custom-tailored articles.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => scrollToSection('pricing')}
              className="bg-[#9b87f5] hover:bg-[#8B5CF6] text-white text-lg px-8 py-6"
            >
              Get Started Now
            </Button>
            <Button 
              variant="outline" 
              onClick={() => scrollToSection('media-sites')}
              className="border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/10 text-lg px-8 py-6"
            >
              View Sites
            </Button>
          </div>
        </div>
        <div className="rounded-lg overflow-hidden shadow-xl">
          <img 
            src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
            alt="People collaborating around a laptop" 
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
