import { useEffect, useState, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
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

const ManageBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [vehicleIds, setVehicleIds] = useState<string[]>([]);
  const [agencyId, setAgencyId] = useState<string | null>(null);
  const [agencyName, setAgencyName] = useState<string | null>(null);
  const { toast } = useToast();

  const updateStatus = async (booking: Booking, status: string) => {
    try {
      if (status === 'declined') {
        const { error } = await supabase
          .from('bookings')
          .update({ status })
          .eq('id', booking.id);
        if (error) throw error;
        toast({
          title: 'Booking Declined',
          description: 'This IP can request the car again in 24 hours.',
        });
      } else {
        const { error } = await supabase
          .from('bookings')
          .update({ status })
          .eq('id', booking.id);
        if (error) throw error;

        if (status === 'accepted') {
          await supabase
            .from('vehicles')
            .update({ is_available: false })
            .eq('id', booking.vehicle_id);
        }

        toast({ title: 'Booking Updated', description: `Booking ${status}.` });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        variant: 'destructive'
      });
    } finally {
      loadBookings();
    }
  };

  const loadBookings = useCallback(async () => {
    if (!user) return;
    const { data: agency } = await supabase
      .from('agencies')
      .select('id, company_name')
      .eq('user_id', user.id)
      .single();
    if (!agency) {
      setLoading(false);
      return;
    }
    setAgencyId(agency.id);
    setAgencyName(agency.company_name);
    const { data: vehicles } = await supabase
      .from('vehicles')
      .select('id')
      .eq('agency_id', agency.id);
    const ids = vehicles?.map((v) => v.id) || [];
    setVehicleIds(ids);
    if (ids.length === 0) {
      setBookings([]);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from('bookings')
      .select('id, vehicle_id, customer_name, customer_email, phone_number, notes, start_date, end_date, status, vehicles(make, model, year)')
      .in('vehicle_id', ids)
      .order('created_at', { ascending: false });
    setBookings((data as Booking[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  useEffect(() => {
    if (!user || vehicleIds.length === 0 || !agencyId) return;
    const channel = supabase
      .channel(`agency-${agencyId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bookings' }, (payload) => {
        const booking = payload.new as Booking;
        if (vehicleIds.includes(booking.vehicle_id)) {
          toast({ title: 'New Booking', description: `${booking.customer_name} booked a vehicle.` });
          loadBookings();
        }
      })
      .on('broadcast', { event: 'new-booking' }, () => {
        toast({ title: 'New Booking', description: 'A vehicle was booked.' });
        loadBookings();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, vehicleIds, agencyId, loadBookings, toast]);

  if (!user) {
    return <Navigate to="/agency-auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <OwnerHeader page="bookings" agencyName={agencyName} />
      <div className="container py-8">
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
                        {b.phone_number && (
                          <p className="text-sm text-muted-foreground">{b.phone_number}</p>
                        )}
                        {b.notes && (
                          <p className="text-sm text-muted-foreground">{b.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm capitalize mr-2">{b.status}</span>
                      {b.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateStatus(b, 'accepted')}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateStatus(b, 'declined')}
                          >
                            Decline
                          </Button>
                        </>
                      )}
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
