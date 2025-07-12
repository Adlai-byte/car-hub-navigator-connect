-- Add phone number and notes to bookings table
ALTER TABLE public.bookings
  ADD COLUMN phone_number TEXT,
  ADD COLUMN notes TEXT;
