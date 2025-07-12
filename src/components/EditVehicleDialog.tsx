import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Vehicle } from './VehicleList';

interface EditVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
  onVehicleUpdated: () => void;
}

const EditVehicleDialog = ({ open, onOpenChange, vehicle, onVehicleUpdated }: EditVehicleDialogProps) => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    vehicle_type: '',
    transmission: '',
    fuel_type: '',
    seats: '',
    daily_rate: '',
    weekly_rate: '',
    monthly_rate: '',
    image_url: '',
    license_plate: '',
    vin: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (vehicle) {
      setFormData({
        make: vehicle.make,
        model: vehicle.model,
        year: String(vehicle.year),
        vehicle_type: vehicle.vehicle_type,
        transmission: vehicle.transmission,
        fuel_type: vehicle.fuel_type,
        seats: String(vehicle.seats),
        daily_rate: String(vehicle.daily_rate),
        weekly_rate: (vehicle as any).weekly_rate ? String((vehicle as any).weekly_rate) : '',
        monthly_rate: (vehicle as any).monthly_rate ? String((vehicle as any).monthly_rate) : '',
        image_url: vehicle.image_url || '',
        license_plate: (vehicle as any).license_plate || '',
        vin: (vehicle as any).vin || ''
      });
    }
  }, [vehicle]);

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('vehicles')
        .update({
          make: formData.make,
          model: formData.model,
          year: parseInt(formData.year),
          vehicle_type: formData.vehicle_type,
          transmission: formData.transmission,
          fuel_type: formData.fuel_type,
          seats: parseInt(formData.seats),
          daily_rate: parseFloat(formData.daily_rate),
          weekly_rate: formData.weekly_rate ? parseFloat(formData.weekly_rate) : null,
          monthly_rate: formData.monthly_rate ? parseFloat(formData.monthly_rate) : null,
          image_url: formData.image_url || null,
          license_plate: formData.license_plate || null,
          vin: formData.vin || null,
        })
        .eq('id', vehicle.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Vehicle updated successfully',
      });

      onVehicleUpdated();
      onOpenChange(false);
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Vehicle</DialogTitle>
          <DialogDescription>Update the vehicle details below.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make-edit">Make *</Label>
              <Input id="make-edit" value={formData.make} onChange={e => updateFormData('make', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model-edit">Model *</Label>
              <Input id="model-edit" value={formData.model} onChange={e => updateFormData('model', e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year-edit">Year *</Label>
              <Input id="year-edit" type="number" value={formData.year} onChange={e => updateFormData('year', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seats-edit">Seats *</Label>
              <Input id="seats-edit" type="number" value={formData.seats} onChange={e => updateFormData('seats', e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle_type-edit">Vehicle Type *</Label>
              <Select value={formData.vehicle_type} onValueChange={value => updateFormData('vehicle_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="midsize">Midsize</SelectItem>
                  <SelectItem value="fullsize">Full Size</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="truck">Truck</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transmission-edit">Transmission *</Label>
              <Select value={formData.transmission} onValueChange={value => updateFormData('transmission', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automatic">Automatic</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fuel_type-edit">Fuel Type *</Label>
              <Select value={formData.fuel_type} onValueChange={value => updateFormData('fuel_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gasoline">Gasoline</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="daily_rate-edit">Daily Rate (₱) *</Label>
              <Input id="daily_rate-edit" type="number" step="0.01" value={formData.daily_rate} onChange={e => updateFormData('daily_rate', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weekly_rate-edit">Weekly Rate (₱)</Label>
              <Input id="weekly_rate-edit" type="number" step="0.01" value={formData.weekly_rate} onChange={e => updateFormData('weekly_rate', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly_rate-edit">Monthly Rate (₱)</Label>
              <Input id="monthly_rate-edit" type="number" step="0.01" value={formData.monthly_rate} onChange={e => updateFormData('monthly_rate', e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url-edit">Car Photo URL</Label>
            <Input id="image_url-edit" type="url" value={formData.image_url} onChange={e => updateFormData('image_url', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="license_plate-edit">License Plate</Label>
              <Input id="license_plate-edit" value={formData.license_plate} onChange={e => updateFormData('license_plate', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vin-edit">VIN</Label>
              <Input id="vin-edit" value={formData.vin} onChange={e => updateFormData('vin', e.target.value)} />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditVehicleDialog;
