
import Header from "../components/Header";
import Hero from "../components/Hero";
import MediaSites from "../components/MediaSites";
import ProcessSection from "../components/ProcessSection";
import CtaBanner from "../components/CtaBanner";
import PricingSection from "../components/PricingSection";
import TestimonialsSection from "../components/TestimonialsSection";
import FaqSectionEditable from "../components/FaqSectionEditable";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <Hero />
        <MediaSites />
        <ProcessSection />
        <CtaBanner />
        <PricingSection />
        <TestimonialsSection />
        <FaqSectionEditable />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
