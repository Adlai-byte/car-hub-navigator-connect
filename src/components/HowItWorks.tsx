import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MessageCircle, Key, Star } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search & Compare",
    description: "Browse vehicles from local rental agencies. Filter by location, type, price, and availability to find your perfect match."
  },
  {
    icon: MessageCircle,
    title: "Connect & Inquire",
    description: "Contact agencies directly through our platform. Ask questions, check availability, and get personalized quotes."
  },
  {
    icon: Key,
    title: "Book & Drive",
    description: "Complete your booking with the agency. Pick up your vehicle and enjoy your rental experience."
  },
  {
    icon: Star,
    title: "Review & Share",
    description: "Rate your experience to help other renters and agencies build trust within our community."
  }
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-gradient-subtle">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            How RentalHub Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simple steps to connect with local rental agencies and find your ideal vehicle
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card key={index} variant="default" className="text-center group hover:shadow-card transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {step.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;