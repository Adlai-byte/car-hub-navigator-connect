-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can create bookings" ON public.bookings
FOR INSERT WITH CHECK (true);

CREATE POLICY "Agency owners can view their vehicle bookings" ON public.bookings
FOR SELECT USING (
  vehicle_id IN (
    SELECT id FROM public.vehicles WHERE agency_id IN (
      SELECT id FROM public.agencies WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Agency owners can update their vehicle bookings" ON public.bookings
FOR UPDATE USING (
  vehicle_id IN (
    SELECT id FROM public.vehicles WHERE agency_id IN (
      SELECT id FROM public.agencies WHERE user_id = auth.uid()
    )
  )
);

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
