
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import MonthYearPicker from "@/components/dashboard/MonthYearPicker";
import TransactionsList from "@/components/transactions/TransactionsList";
import { useTransactions } from "@/contexts/TransactionContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const TransactionsPage: React.FC = () => {
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

  if (isLoading) {
    return (
      <PageLayout title="Daftar Transaksi">
        <div className="text-center py-10">Memuat data...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Daftar Transaksi">
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
      
      <TransactionsList 
        transactions={filteredTransactions} 
        emptyMessage={`Belum ada transaksi untuk ${new Date(selectedYear, selectedMonth).toLocaleString('id-ID', { month: 'long' })} ${selectedYear}`}
      />
    </PageLayout>
  );
};

export default TransactionsPage;
