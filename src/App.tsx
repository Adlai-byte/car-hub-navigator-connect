import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import AgencyAuth from "./pages/AgencyAuth";
import UserAuth from "./pages/UserAuth";
import Dashboard from "./pages/Dashboard";
import BookVehicle from "./pages/BookVehicle";
import ManageBookings from "./pages/ManageBookings";
import CurrentRentals from "./pages/CurrentRentals";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<UserAuth />} />
            <Route path="/agency-auth" element={<AgencyAuth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/book/:vehicleId" element={<BookVehicle />} />
            <Route path="/manage-bookings" element={<ManageBookings />} />
            <Route path="/current-rentals" element={<CurrentRentals />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
