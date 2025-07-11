import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Calendar, BarChart3 } from "lucide-react";

const benefits = [
  {
    icon: TrendingUp,
    title: "Increase Bookings",
    description: "Reach more customers and fill your fleet with our growing user base"
  },
  {
    icon: Users,
    title: "Manage Customers", 
    description: "Handle inquiries and bookings through our streamlined platform"
  },
  {
    icon: Calendar,
    title: "Availability Control",
    description: "Update your fleet availability and pricing in real-time"
  },
  {
    icon: BarChart3,
    title: "Business Analytics",
    description: "Track performance with insights on views, inquiries, and bookings"
  }
];

const AgencySection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="outline" className="mb-4">For Rental Agencies</Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Grow Your Rental Business with RentalHub
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Join hundreds of rental agencies already using our platform to connect with customers, 
              manage their fleet, and increase revenue.
            </p>
            
            <div className="space-y-6 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg">
                Join as Agency
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="space-y-6">
            <Card variant="featured" className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Trusted Agencies</div>
              </div>
            </Card>
            
            <div className="grid grid-cols-2 gap-4">
              <Card variant="elevated" className="p-4 text-center">
                <div className="text-2xl font-bold text-foreground mb-1">10K+</div>
                <div className="text-xs text-muted-foreground">Monthly Searches</div>
              </Card>
              <Card variant="elevated" className="p-4 text-center">
                <div className="text-2xl font-bold text-foreground mb-1">95%</div>
                <div className="text-xs text-muted-foreground">Satisfaction Rate</div>
              </Card>
            </div>
            
            <Card variant="default" className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-accent flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Average 30% increase</div>
                  <div className="text-sm text-muted-foreground">in bookings within first month</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgencySection;