
import { Button } from "@/components/ui/button";

const CtaBanner = () => {
  return (
    <section className="py-12 px-4 bg-[#9b87f5] text-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Boost Your Credibility?</h2>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          Join thousands of businesses that have increased their visibility and authority
          with our premium media placements across trusted publications.
        </p>
        <Button 
          className="bg-white text-[#9b87f5] hover:bg-gray-100 hover:text-[#8B5CF6] text-lg px-8 py-6"
        >
          Get Started For Free
        </Button>
      </div>
    </section>
  );
};

export default CtaBanner;
