
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="py-12 md:py-20 px-4 bg-gradient-to-r from-purple-50 to-indigo-50">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Get Featured on <span className="text-[#9b87f5]">12 Media Sites</span> with One Article
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Boost your credibility and reach with our premium media placements. 
            One article, distributed across 12 top-tier publications, custom-tailored by our AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-[#9b87f5] hover:bg-[#8B5CF6] text-white text-lg px-8 py-6">
              Get Featured Now
            </Button>
            <Button variant="outline" className="border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/10 text-lg px-8 py-6">
              See Locations
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
