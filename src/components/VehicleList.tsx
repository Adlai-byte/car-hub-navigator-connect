import { useState } from 'react';
import { Car, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vehicle_type: string;
  daily_rate: string;
  is_available: boolean;
  image_url?: string;
  seats: number;
  transmission: string;
  fuel_type: string;
}

interface VehicleListProps {
  vehicles: Vehicle[];
  onUpdate: () => void;
}

const VehicleList = ({ vehicles, onUpdate }: VehicleListProps) => {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const toggleAvailability = async (vehicleId: string, currentStatus: boolean) => {
    setLoading(vehicleId);
    
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({ is_available: !currentStatus })
        .eq('id', vehicleId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Vehicle ${!currentStatus ? 'enabled' : 'disabled'} successfully`,
      });
      
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  const deleteVehicle = async (vehicleId: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    
    setLoading(vehicleId);
    
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', vehicleId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Vehicle deleted successfully",
      });
      
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">No vehicles yet</h3>
        <p className="text-muted-foreground mb-4">
          Start building your fleet by adding your first vehicle.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {vehicles.map((vehicle) => (
        <Card key={vehicle.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4 flex-1">
                <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  {vehicle.image_url ? (
                    <img 
                      src={vehicle.image_url} 
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Car className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {vehicle.vehicle_type}
                        </Badge>
                        <Badge 
                          variant={vehicle.is_available ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {vehicle.is_available ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        ${vehicle.daily_rate}/day
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{vehicle.seats} seats</span>
                    <span>{vehicle.transmission}</span>
                    <span>{vehicle.fuel_type}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleAvailability(vehicle.id, vehicle.is_available)}
                  disabled={loading === vehicle.id}
                >
                  {vehicle.is_available ? (
                    <ToggleRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
                
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => deleteVehicle(vehicle.id)}
                  disabled={loading === vehicle.id}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VehicleList;