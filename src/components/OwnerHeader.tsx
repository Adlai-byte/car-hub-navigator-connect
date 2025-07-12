import { Car, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface OwnerHeaderProps {
  page: 'dashboard' | 'bookings' | 'rentals';
  agencyName?: string | null;
}

const OwnerHeader = ({ page, agencyName }: OwnerHeaderProps) => {
  const { signOut } = useAuth();
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Car className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">RentalHub</span>
          <span className="text-sm text-muted-foreground ml-2 capitalize">
            {page}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {agencyName && (
            <span className="text-sm text-muted-foreground hidden sm:block">
              {agencyName}
            </span>
          )}
          {page !== 'dashboard' && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          )}
          {page !== 'bookings' && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/manage-bookings">Bookings</Link>
            </Button>
          )}
          {page !== 'rentals' && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/current-rentals">Rentals</Link>
            </Button>
          )}
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={signOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default OwnerHeader;
