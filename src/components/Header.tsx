import { Button } from "@/components/ui/button";
import { Car, Menu, User } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Car className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">RentalHub</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Browse Cars
          </a>
          <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            For Agencies
          </a>
          <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            How it Works
          </a>
          <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Support
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="hidden md:flex">
            <User className="h-4 w-4" />
            Sign In
          </Button>
          <Button variant="hero" size="sm">
            List Your Fleet
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;