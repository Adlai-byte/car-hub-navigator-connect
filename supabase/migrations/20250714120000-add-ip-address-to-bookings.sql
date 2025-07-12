-- Add ip_address column to bookings
ALTER TABLE public.bookings
  ADD COLUMN ip_address TEXT;
