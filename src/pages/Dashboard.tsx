
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import SummaryCards from "@/components/dashboard/SummaryCards";
import MonthYearPicker from "@/components/dashboard/MonthYearPicker";
import TransactionsList from "@/components/transactions/TransactionsList";
import { useTransactions } from "@/contexts/TransactionContext";
import { DashboardSummary } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { transactions, isLoading } = useTransactions();
  
  // Get current date for default month/year selection
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());

  // Filter transactions by selected month/year
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getFullYear() === selectedYear &&
        transactionDate.getMonth() === selectedMonth
      );
    }).sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [transactions, selectedMonth, selectedYear]);

  // Calculate summary data
  const summary: DashboardSummary = useMemo(() => {
    const totalSales = filteredTransactions.reduce(
      (sum, t) => sum + t.totalAmount,
      0
    );
    
    const totalProfit = filteredTransactions.reduce(
      (sum, t) => sum + t.profit,
      0
    );
    
    // Create date objects for the first and last day of the selected month
    const periodStart = new Date(selectedYear, selectedMonth, 1);
    const periodEnd = new Date(selectedYear, selectedMonth + 1, 0);
    
    return {
      totalSales,
      totalProfit,
      transactionCount: filteredTransactions.length,
      periodStart,
      periodEnd
    };
  }, [filteredTransactions, selectedMonth, selectedYear]);

  if (isLoading) {
    return (
      <PageLayout title="Dashboard">
        <div className="text-center py-10">Memuat data...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Dashboard">
      <div className="mb-6 flex justify-between items-center">
        <MonthYearPicker
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
        
        <Button 
          onClick={() => navigate("/transactions/new")}
          className="bg-adreena-500 hover:bg-adreena-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Transaksi Baru
        </Button>
      </div>
      
      <SummaryCards summary={summary} />
      
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Transaksi Terbaru</h2>
        <TransactionsList 
          transactions={filteredTransactions.slice(0, 5)} 
          emptyMessage={`Belum ada transaksi untuk ${new Date(selectedYear, selectedMonth).toLocaleString('id-ID', { month: 'long' })} ${selectedYear}`}
        />
        
        {filteredTransactions.length > 5 && (
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              onClick={() => navigate("/transactions")}
            >
              Lihat Semua Transaksi
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Dashboard;
