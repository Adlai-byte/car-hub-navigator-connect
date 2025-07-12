import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, MessageCircle, Car } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vehicle_type: string;
  daily_rate: number;
  image_url: string | null;
  is_available: boolean;
  seats: number;
  transmission: string;
  fuel_type: string;
  agencies?: {
    company_name: string | null;
    city: string | null;
  } | null;
}

const FeaturedVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('id, make, model, year, vehicle_type, daily_rate, image_url, is_available, seats, transmission, fuel_type, agencies(company_name, city)')
        .eq('is_available', true)
        .limit(6);

      if (!error && data) {
        setVehicles(data as Vehicle[]);
      }
    };
    fetchVehicles();
  }, []);

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
                {vehicle.image_url ? (
                  <img
                    src={vehicle.image_url}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-48 object-cover"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-muted">
                    <Car className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                {!vehicle.is_available && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="secondary">Currently Unavailable</Badge>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <Badge variant={vehicle.is_available ? "default" : "secondary"}>
                    {vehicle.vehicle_type}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{vehicle.year} {vehicle.make} {vehicle.model}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {vehicle.agencies?.company_name}
                      {vehicle.agencies?.city ? ` • ${vehicle.agencies.city}` : ''}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">₱{vehicle.daily_rate}</div>
                    <div className="text-sm text-muted-foreground">per day</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="text-xs">{vehicle.seats} seats</Badge>
                  <Badge variant="outline" className="text-xs">{vehicle.transmission}</Badge>
                  <Badge variant="outline" className="text-xs">{vehicle.fuel_type}</Badge>
                </div>

                <div className="flex gap-2">
                  <Button
                    asChild
                    variant={vehicle.is_available ? "default" : "outline"}
                    className="flex-1"
                    disabled={!vehicle.is_available}
                  >
                    <Link to={`/book/${vehicle.id}`}>{vehicle.is_available ? "Book Now" : "Notify When Available"}</Link>
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