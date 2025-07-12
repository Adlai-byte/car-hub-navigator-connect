import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import AgencySection from "@/components/AgencySection";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <HowItWorks />
      <AgencySection />
      {!user && <CallToAction />}
      <Footer />
    </div>
  );
};

export default Index;
