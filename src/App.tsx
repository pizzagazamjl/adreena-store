
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "@/contexts/StoreContext";
import { TransactionProvider } from "@/contexts/TransactionContext";

// Pages
import Dashboard from "./pages/Dashboard";
import TransactionsPage from "./pages/transactions/TransactionsPage";
import NewTransactionPage from "./pages/transactions/NewTransactionPage";
import TransactionDetailPage from "./pages/transactions/TransactionDetailPage";
import EditTransactionPage from "./pages/transactions/EditTransactionPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <StoreProvider>
        <TransactionProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/transactions/new" element={<NewTransactionPage />} />
              <Route path="/transactions/:id" element={<TransactionDetailPage />} />
              <Route path="/transactions/edit/:id" element={<EditTransactionPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TransactionProvider>
      </StoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
