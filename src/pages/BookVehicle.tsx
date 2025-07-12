import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Car } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  image_url: string | null;
  daily_rate: number;
}

const BookVehicle = () => {
  const { vehicleId } = useParams();
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
    start: '',
    end: ''
  });
  const [ip, setIp] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const today = new Date().toISOString().split('T')[0];

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then((res) => res.json())
      .then((data) => setIp(data.ip))
      .catch(() => setIp(''));
  }, []);

  useEffect(() => {
    if (!vehicleId) return;
    const load = async () => {
      const { data } = await supabase
        .from('vehicles')
        .select('id, make, model, year, image_url, daily_rate')
        .eq('id', vehicleId)
        .single();
      setVehicle(data as Vehicle | null);
    };
    load();
  }, [vehicleId]);

  const update = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId) return;
    if (form.start < today) {
      toast({
        title: 'Invalid dates',
        description: 'Start date cannot be before today.',
        variant: 'destructive'
      });
      return;
    }
    if (form.end < form.start) {
      toast({
        title: 'Invalid dates',
        description: 'End date cannot be before start date.',
        variant: 'destructive'
      });
      return;
    }
    setLoading(true);

    // Check if this IP has booked this vehicle in the last 24 hours
    const { data: recent } = await supabase
      .from('bookings')
      .select('id, created_at')
      .eq('vehicle_id', vehicleId)
      .eq('ip_address', ip)
      .order('created_at', { ascending: false })
      .limit(1);

    if (recent && recent.length > 0) {
      const last = new Date(recent[0].created_at);
      if (Date.now() - last.getTime() < 24 * 60 * 60 * 1000) {
        toast({
          title: 'Limit reached',
          description:
            'You can only book this vehicle once every 24 hours from the same IP address.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }
    }

    const { error } = await supabase
      .from('bookings')
      .insert({
        vehicle_id: vehicleId,
        customer_name: form.name,
        customer_email: form.email,
        phone_number: form.phone || null,
        notes: form.notes || null,
        start_date: form.start,
        end_date: form.end,
        ip_address: ip || null,
      });
    if (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } else {
      toast({ title: 'Booked', description: 'Booking request submitted successfully.' });
      setForm({ name: '', email: '', phone: '', notes: '', start: '', end: '' });

      const { data: vehicleInfo } = await supabase
        .from('vehicles')
        .select('agency_id')
        .eq('id', vehicleId)
        .single();

      if (vehicleInfo) {
        const channel = supabase.channel(`agency-${vehicleInfo.agency_id}`);
        await channel.subscribe();
        await channel.send({
          type: 'broadcast',
          event: 'new-booking'
        });
        await supabase.removeChannel(channel);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Book Vehicle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {vehicle ? (
              <div className="space-y-2">
                <div className="flex gap-4 items-center">
                  <div className="w-24 h-24 bg-muted rounded flex items-center justify-center">
                    {vehicle.image_url ? (
                      <img src={vehicle.image_url} alt="car" className="w-full h-full object-cover rounded" referrerPolicy="no-referrer" crossOrigin="anonymous" />
                    ) : (
                      <Car className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-muted-foreground">₱{vehicle.daily_rate} per day</p>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={form.name} onChange={(e) => update('name', e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Info</Label>
                    <Input id="notes" value={form.notes} onChange={(e) => update('notes', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start">Start Date</Label>
                      <Input
                        id="start"
                        type="date"
                        min={today}
                        value={form.start}
                        onChange={(e) => update('start', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end">End Date</Label>
                      <Input
                        id="end"
                        type="date"
                        min={form.start || today}
                        value={form.end}
                        onChange={(e) => update('end', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Booking...' : 'Book Now'}
                  </Button>
                </form>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookVehicle;
