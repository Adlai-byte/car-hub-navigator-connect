import { useEffect, useState, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car } from 'lucide-react';

interface Booking {
  id: string;
  vehicle_id: string;
  customer_name: string;
  customer_email: string;
  start_date: string;
  end_date: string;
  status: string;
  vehicles?: {
    make: string;
    model: string;
    year: number;
  } | null;
}

const ManageBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = useCallback(async () => {
    if (!user) return;
    const { data: agency } = await supabase
      .from('agencies')
      .select('id')
      .eq('user_id', user.id)
      .single();
    if (!agency) {
      setLoading(false);
      return;
    }
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
      .select('id, vehicle_id, customer_name, customer_email, start_date, end_date, status, vehicles(make, model, year)')
      .in('vehicle_id', ids)
      .order('created_at', { ascending: false });
    setBookings((data as Booking[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  if (!user) {
    return <Navigate to="/agency-auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container">
        <Card>
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No bookings found.</div>
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
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm capitalize mr-2">{b.status}</span>
                      {/* Potential actions could go here */}
                    </div>
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

export default ManageBookings;
