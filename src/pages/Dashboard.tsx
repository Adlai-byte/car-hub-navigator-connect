import { useState, useEffect, useCallback } from 'react';
import { Car, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import VehicleList, { Vehicle } from '@/components/VehicleList';
import AddVehicleDialog from '@/components/AddVehicleDialog';
import { Navigate } from 'react-router-dom';
import OwnerHeader from '@/components/OwnerHeader';

interface Agency {
  id: string;
  company_name: string;
  contact_email: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [agency, setAgency] = useState<Agency | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadAgencyData = useCallback(async () => {
    try {
      // Get agency profile
      const { data: agencyData, error: agencyError } = await supabase
        .from('agencies')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (agencyError) {
        console.error('Error loading agency:', agencyError);
        return;
      }

      setAgency(agencyData);

      // Get vehicles
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('*')
        .eq('agency_id', agencyData.id)
        .order('created_at', { ascending: false });

      if (vehiclesError) {
        console.error('Error loading vehicles:', vehiclesError);
        return;
      }

      setVehicles(vehiclesData || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadAgencyData();
    }
  }, [user, loadAgencyData]);

  const handleVehicleAdded = () => {
    loadAgencyData();
    setShowAddVehicle(false);
  };

  if (!user) {
    return <Navigate to="/agency-auth" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Car className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <OwnerHeader page="dashboard" agencyName={agency?.company_name} />

      <div className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {agency?.company_name}!
          </h1>
          <p className="text-muted-foreground">
            Manage your fleet and track your rental business performance.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Vehicles</CardDescription>
              <CardTitle className="text-3xl">{vehicles.length}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Available Now</CardDescription>
              <CardTitle className="text-3xl">
                {vehicles.filter((v) => v.is_available).length}
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Average Daily Rate</CardDescription>
              <CardTitle className="text-3xl">
                ₱{
                  vehicles.length > 0
                  ? Math.round(
                      vehicles.reduce(
                        (sum: number, v) => sum + parseFloat(v.daily_rate),
                        0
                      ) / vehicles.length
                    )
                  : 0}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Fleet Management */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Fleet</CardTitle>
              <CardDescription>
                Manage your vehicles, pricing, and availability
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddVehicle(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </CardHeader>
          <CardContent>
            <VehicleList vehicles={vehicles} onUpdate={loadAgencyData} />
          </CardContent>
        </Card>
      </div>

      <AddVehicleDialog 
        open={showAddVehicle}
        onOpenChange={setShowAddVehicle}
        agencyId={agency?.id}
        onVehicleAdded={handleVehicleAdded}
      />
    </div>
  );
};

export default Dashboard;