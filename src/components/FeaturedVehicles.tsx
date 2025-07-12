import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Users, Fuel, MessageCircle } from "lucide-react";

const vehicles = [
  {
    id: 1,
    name: "Toyota Camry 2023",
    type: "Midsize Sedan",
    agency: "Metro Car Rentals",
    location: "Downtown Chicago",
    price: 45,
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=250&fit=crop",
    features: ["4 Passengers", "Automatic", "32 MPG"],
    available: true
  },
  {
    id: 2,
    name: "Honda CR-V 2023",
    type: "Compact SUV",
    agency: "Urban Fleet",
    location: "Los Angeles",
    price: 62,
    rating: 4.9,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=250&fit=crop",
    features: ["5 Passengers", "AWD", "28 MPG"],
    available: true
  },
  {
    id: 3,
    name: "BMW 3 Series",
    type: "Luxury Sedan",
    agency: "Premium Auto",
    location: "Miami Beach",
    price: 89,
    rating: 4.7,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop",
    features: ["4 Passengers", "Premium", "26 MPG"],
    available: false
  }
];

const FeaturedVehicles = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Featured Vehicles
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover popular rental options from trusted agencies in your area
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} variant="elevated" className="overflow-hidden group hover:scale-105 transition-transform duration-300">
              <div className="relative">
                <img 
                  src={vehicle.image} 
                  alt={vehicle.name}
                  className="w-full h-48 object-cover"
                />
                {!vehicle.available && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="secondary">Currently Unavailable</Badge>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <Badge variant={vehicle.available ? "default" : "secondary"}>
                    {vehicle.type}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{vehicle.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {vehicle.agency} • {vehicle.location}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      ₱{vehicle.price}
                    </div>
                    <div className="text-sm text-muted-foreground">per day</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{vehicle.rating}</span>
                    <span className="text-sm text-muted-foreground">({vehicle.reviews})</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {vehicle.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant={vehicle.available ? "default" : "outline"} 
                    className="flex-1"
                    disabled={!vehicle.available}
                  >
                    {vehicle.available ? "View Details" : "Notify When Available"}
                  </Button>
                  <Button variant="outline" size="icon">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            View All Vehicles
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedVehicles;