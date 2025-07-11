-- Create agency profiles table
CREATE TABLE public.agencies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  website TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vehicles table
CREATE TABLE public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  vehicle_type TEXT NOT NULL, -- economy, compact, midsize, fullsize, luxury, suv, truck, van
  transmission TEXT NOT NULL, -- automatic, manual
  fuel_type TEXT NOT NULL, -- gasoline, diesel, hybrid, electric
  seats INTEGER NOT NULL,
  daily_rate DECIMAL(10,2) NOT NULL,
  weekly_rate DECIMAL(10,2),
  monthly_rate DECIMAL(10,2),
  features TEXT[], -- air_conditioning, gps, bluetooth, etc
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  license_plate TEXT,
  vin TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Create policies for agencies
CREATE POLICY "Users can view their own agency profile" 
ON public.agencies 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own agency profile" 
ON public.agencies 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agency profile" 
ON public.agencies 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for vehicles
CREATE POLICY "Public can view available vehicles" 
ON public.vehicles 
FOR SELECT 
USING (is_available = true);

CREATE POLICY "Agency owners can view their vehicles" 
ON public.vehicles 
FOR SELECT 
USING (agency_id IN (SELECT id FROM public.agencies WHERE user_id = auth.uid()));

CREATE POLICY "Agency owners can create vehicles" 
ON public.vehicles 
FOR INSERT 
WITH CHECK (agency_id IN (SELECT id FROM public.agencies WHERE user_id = auth.uid()));

CREATE POLICY "Agency owners can update their vehicles" 
ON public.vehicles 
FOR UPDATE 
USING (agency_id IN (SELECT id FROM public.agencies WHERE user_id = auth.uid()));

CREATE POLICY "Agency owners can delete their vehicles" 
ON public.vehicles 
FOR DELETE 
USING (agency_id IN (SELECT id FROM public.agencies WHERE user_id = auth.uid()));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_agencies_updated_at
  BEFORE UPDATE ON public.agencies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new agency user registration
CREATE OR REPLACE FUNCTION public.handle_new_agency_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create agency profile if user_metadata indicates they're an agency
  IF NEW.raw_user_meta_data->>'user_type' = 'agency' THEN
    INSERT INTO public.agencies (user_id, company_name, contact_email)
    VALUES (
      NEW.id, 
      COALESCE(NEW.raw_user_meta_data->>'company_name', 'New Agency'),
      NEW.email
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for auto-creating agency profiles
CREATE TRIGGER on_auth_user_created_agency
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_agency_user();