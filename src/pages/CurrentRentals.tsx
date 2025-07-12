import { useEffect, useState, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import OwnerHeader from '@/components/OwnerHeader';

interface Booking {
  id: string;
  vehicle_id: string;
  customer_name: string;
  customer_email: string;
  phone_number: string | null;
  notes: string | null;
  start_date: string;
  end_date: string;
  status: string;
  vehicles?: {
    make: string;
    model: string;
    year: number;
  } | null;
}

const CurrentRentals = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [agencyName, setAgencyName] = useState<string | null>(null);
  const { toast } = useToast();

  const loadRentals = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data: agency } = await supabase
      .from('agencies')
      .select('id, company_name')
      .eq('user_id', user.id)
      .single();
    if (!agency) {
      setLoading(false);
      return;
    }
    setAgencyName(agency.company_name);
    const { data: vehicles } = await supabase
      .from('vehicles')
      .select('id')
      .eq('agency_id', agency.id);
    const ids = vehicles?.map((v) => v.id) || [];
    if (ids.length === 0) {
      setBookings([]);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from('bookings')
      .select('id, vehicle_id, customer_name, customer_email, phone_number, notes, start_date, end_date, status, vehicles(make, model, year)')
      .in('vehicle_id', ids)
      .eq('status', 'accepted');
    setBookings((data as Booking[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadRentals();
  }, [loadRentals]);

  const markReturned = async (b: Booking) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'completed' })
      .eq('id', b.id);
    if (!error) {
      await supabase
        .from('vehicles')
        .update({ is_available: true })
        .eq('id', b.vehicle_id);
      toast({ title: 'Vehicle returned' });
      loadRentals();
    } else {
      toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    }
  };

  if (!user) {
    return <Navigate to="/agency-auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <OwnerHeader page="rentals" agencyName={agencyName} />
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Current Rentals</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No rentals found.</div>
            ) : (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <div key={b.id} className="border p-4 rounded-md flex justify-between items-start gap-4">
                    <div className="flex gap-4 items-start">
                      <Car className="h-6 w-6 text-primary" />
                      <div>
                        <p className="font-semibold">
                          {b.vehicles ? `${b.vehicles.year} ${b.vehicles.make} ${b.vehicles.model}` : b.vehicle_id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {b.start_date} to {b.end_date}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {b.customer_name} ({b.customer_email})
                        </p>
                        {b.phone_number && (
                          <p className="text-sm text-muted-foreground">{b.phone_number}</p>
                        )}
                        {b.notes && (
                          <p className="text-sm text-muted-foreground">{b.notes}</p>
                        )}
                      </div>
                    </div>
                    <Button size="sm" onClick={() => markReturned(b)}>
                      Mark Returned
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CurrentRentals;
