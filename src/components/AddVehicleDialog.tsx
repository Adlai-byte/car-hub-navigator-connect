import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AddVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agencyId?: string;
  onVehicleAdded: () => void;
}

const AddVehicleDialog = ({ open, onOpenChange, agencyId, onVehicleAdded }: AddVehicleDialogProps) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agencyId) return;
    
    setLoading(true);

    try {
      const { error } = await supabase
        .from('vehicles')
        .insert([{
          agency_id: agencyId,
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
          is_available: true
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Vehicle added successfully",
      });

      // Reset form
      setFormData({
        make: '', model: '', year: '', vehicle_type: '', transmission: '',
        fuel_type: '', seats: '', daily_rate: '', weekly_rate: '', monthly_rate: '',
        image_url: '', license_plate: '', vin: ''
      });

      onVehicleAdded();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
          <DialogDescription>
            Add a new vehicle to your fleet. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make">Make *</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => updateFormData('make', e.target.value)}
                placeholder="Toyota"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => updateFormData('model', e.target.value)}
                placeholder="Camry"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => updateFormData('year', e.target.value)}
                placeholder="2023"
                min="1990"
                max="2025"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="seats">Seats *</Label>
              <Input
                id="seats"
                type="number"
                value={formData.seats}
                onChange={(e) => updateFormData('seats', e.target.value)}
                placeholder="5"
                min="2"
                max="15"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle_type">Vehicle Type *</Label>
              <Select value={formData.vehicle_type} onValueChange={(value) => updateFormData('vehicle_type', value)}>
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
              <Label htmlFor="transmission">Transmission *</Label>
              <Select value={formData.transmission} onValueChange={(value) => updateFormData('transmission', value)}>
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
              <Label htmlFor="fuel_type">Fuel Type *</Label>
              <Select value={formData.fuel_type} onValueChange={(value) => updateFormData('fuel_type', value)}>
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
              <Label htmlFor="daily_rate">Daily Rate ($) *</Label>
              <Input
                id="daily_rate"
                type="number"
                step="0.01"
                value={formData.daily_rate}
                onChange={(e) => updateFormData('daily_rate', e.target.value)}
                placeholder="50.00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weekly_rate">Weekly Rate ($)</Label>
              <Input
                id="weekly_rate"
                type="number"
                step="0.01"
                value={formData.weekly_rate}
                onChange={(e) => updateFormData('weekly_rate', e.target.value)}
                placeholder="300.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="monthly_rate">Monthly Rate ($)</Label>
              <Input
                id="monthly_rate"
                type="number"
                step="0.01"
                value={formData.monthly_rate}
                onChange={(e) => updateFormData('monthly_rate', e.target.value)}
                placeholder="1000.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) => updateFormData('image_url', e.target.value)}
              placeholder="https://example.com/car-image.jpg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="license_plate">License Plate</Label>
              <Input
                id="license_plate"
                value={formData.license_plate}
                onChange={(e) => updateFormData('license_plate', e.target.value)}
                placeholder="ABC-1234"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vin">VIN</Label>
              <Input
                id="vin"
                value={formData.vin}
                onChange={(e) => updateFormData('vin', e.target.value)}
                placeholder="1HGBH41JXMN109186"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Adding Vehicle...' : 'Add Vehicle'}
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

export default AddVehicleDialog;