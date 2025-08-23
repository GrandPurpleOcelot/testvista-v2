import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MySpace from "./pages/MySpace";
import CreateSuite from "./pages/CreateSuite";
import SuiteWorkspace from "./pages/SuiteWorkspace";
import ReferenceFiles from "./pages/ReferenceFiles";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/my-space" element={<MySpace />} />
          <Route path="/create-suite" element={<CreateSuite />} />
          <Route path="/suite/:id" element={<SuiteWorkspace />} />
          <Route path="/reference-files" element={<ReferenceFiles />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
