import { Car, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Car className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">RentalHub</span>
            </div>
            <p className="text-sm text-background/70">
              Connecting renters with local car rental agencies for the best deals and service.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" size="icon" className="text-background hover:text-primary hover:bg-background/10">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-background hover:text-primary hover:bg-background/10">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-background hover:text-primary hover:bg-background/10">
                <Instagram className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">For Renters</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Browse Cars</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">How it Works</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Pricing Guide</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Safety Tips</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">For Agencies</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Join RentalHub</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Dashboard</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Success Stories</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Contact & Newsletter</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-background/70">
                <Mail className="h-4 w-4" />
                <span>support@rentalhub.com</span>
              </div>
              <div className="flex items-center gap-2 text-background/70">
                <Phone className="h-4 w-4" />
                <span>1-800-RENTAL</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-background/70 mb-2">Get deals & updates</p>
              <div className="flex gap-2">
                <Input 
                  placeholder="Email address" 
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
                />
                <Button variant="hero" size="sm">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <hr className="my-8 border-background/20" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/70">
          <div>
            © 2024 RentalHub. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;