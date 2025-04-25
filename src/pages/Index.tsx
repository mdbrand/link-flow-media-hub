
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from "../components/Header";
import Hero from "../components/Hero";
import MediaSites from "../components/MediaSites";
import ProcessSection from "../components/ProcessSection";
import CtaBanner from "../components/CtaBanner";
import PricingSection from "../components/PricingSection";
import TestimonialsSection from "../components/TestimonialsSection";
import FaqSectionEditable from "../components/FaqSectionEditable";
import Footer from "../components/Footer";
import CountdownTimer from "../components/CountdownTimer";
import BottomCtaBanner from "../components/BottomCtaBanner";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle scroll to section when navigating from another page
    if (location.state?.scrollTo) {
      const section = document.getElementById(location.state.scrollTo);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
      // Clear the state to prevent unwanted scrolling
      window.history.replaceState({}, '');
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <Hero />
        <MediaSites />
        <CountdownTimer />
        <ProcessSection />
        <CtaBanner />
        <PricingSection />
        <TestimonialsSection />
        <FaqSectionEditable />
        <BottomCtaBanner />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
