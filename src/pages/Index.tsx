import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedVehicles from "@/components/FeaturedVehicles";
import HowItWorks from "@/components/HowItWorks";
import AgencySection from "@/components/AgencySection";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen">
      <Header />
      {user && (
        <>
          <HeroSection />
          <FeaturedVehicles />
        </>
      )}
      <HowItWorks />
      <AgencySection />
      <Footer />
    </div>
  );
};

export default Index;
