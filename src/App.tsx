
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PaymentSuccess from "./pages/PaymentSuccess";
import Payment from "./pages/Payment";
import Signup from "./pages/Signup";
import SubmitArticle from "./pages/SubmitArticle";
import ReferFriend from "./pages/ReferFriend";
import AuthCallback from "./pages/AuthCallback";
import { AuthProvider } from "./hooks/useAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<AuthCallback />} /> {/* Handle confirmation code at root route */}
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/submit-article" element={<SubmitArticle />} />
            <Route path="/refer-friend" element={<ReferFriend />} />
            <Route path="/auth-callback" element={<AuthCallback />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
