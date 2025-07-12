import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => (
  <section className="py-16 bg-gradient-accent text-accent-foreground">
    <div className="container text-center space-y-6">
      <h2 className="text-3xl font-bold">Ready to hit the road?</h2>
      <p className="max-w-2xl mx-auto">
        Create an account to book vehicles or list your fleet with RentalHub.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild variant="secondary" size="lg">
          <Link to="/login">Sign In / Register</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="border-accent-foreground text-accent-foreground hover:bg-accent-foreground/10">
          <Link to="/agency-auth">List Your Fleet</Link>
        </Button>
      </div>
    </div>
  </section>
);

export default CallToAction;
