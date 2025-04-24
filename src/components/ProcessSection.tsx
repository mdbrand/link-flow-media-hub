
import { FileText, Cpu, CheckCircle, Award } from "lucide-react";

const processSteps = [
  {
    icon: <FileText className="h-12 w-12 text-[#9b87f5]" />,
    title: "Submit One Article",
    description: "Start by submitting just one high-quality article or content piece through our simple dashboard."
  },
  {
    icon: <Cpu className="h-12 w-12 text-[#9b87f5]" />,
    title: "AI Conversion",
    description: "Our proprietary AI technology adapts your content to match each publication's tone, style, and requirements."
  },
  {
    icon: <CheckCircle className="h-12 w-12 text-[#9b87f5]" />,
    title: "Editorial Review",
    description: "Professional editors check your AI-converted content to ensure quality and publication readiness."
  },
  {
    icon: <Award className="h-12 w-12 text-[#9b87f5]" />,
    title: "Get Featured",
    description: "Your content gets published across our network of 12 premium media sites, boosting your visibility."
  }
];

const ProcessSection = () => {
  return (
    <section id="how-it-works" className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How Our <span className="text-[#9b87f5]">AI-Powered</span> Process Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our streamlined process makes it easy to get your content featured across multiple premium publications
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {processSteps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-6">
                {step.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              {index < processSteps.length - 1 && (
                <div className="hidden lg:block absolute transform translate-x-[100px] translate-y-[20px]">
                  <div className="w-16 h-0.5 bg-gray-300"></div>
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-8 border-l-gray-300 border-b-8 border-b-transparent absolute right-0 top-[-7px]"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
