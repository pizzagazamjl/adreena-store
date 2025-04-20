
import React, { createContext, useContext, useState, useEffect } from "react";
import { Transaction, TransactionItem } from "@/types";
import { generateTransactionId, calculateTransactionTotals } from "@/lib/utils";
import { toast } from "sonner";

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id" | "totalAmount" | "totalCostPrice" | "profit">) => string;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  getTransaction: (id: string) => Transaction | undefined;
  getTransactionsByMonth: (year: number, month: number) => Transaction[];
  isLoading: boolean;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would load from Supabase here
    const storedTransactions = localStorage.getItem("transactions");
    
    if (storedTransactions) {
      // Parse dates back to Date objects
      const parsed = JSON.parse(storedTransactions).map((t: any) => ({
        ...t,
        date: new Date(t.date)
      }));
      
      setTransactions(parsed);
    }
    
    setIsLoading(false);
  }, []);

  // Save transactions to local storage when they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("transactions", JSON.stringify(transactions));
    }
  }, [transactions, isLoading]);

  const getNextTransactionCount = (date: Date): number => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const transactionsThisMonth = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getFullYear() === year && tDate.getMonth() === month;
    });
    
    return transactionsThisMonth.length;
  };

  const addTransaction = (transactionData: Omit<Transaction, "id" | "totalAmount" | "totalCostPrice" | "profit">): string => {
    const { totalAmount, totalCostPrice, profit } = calculateTransactionTotals(transactionData.items);
    
    const newTransaction: Transaction = {
      ...transactionData,
      id: generateTransactionId(transactionData.date, getNextTransactionCount(transactionData.date)),
      totalAmount,
      totalCostPrice,
      profit
    };
    
    setTransactions(prev => [...prev, newTransaction]);
    toast.success("Transaksi berhasil disimpan!");
    
    return newTransaction.id;
  };

  const updateTransaction = (id: string, transactionData: Partial<Transaction>) => {
    setTransactions(prev => {
      return prev.map(t => {
        if (t.id !== id) return t;
        
        const updatedTransaction = { ...t, ...transactionData };
        
        // If items changed, recalculate totals
        if (transactionData.items) {
          const { totalAmount, totalCostPrice, profit } = calculateTransactionTotals(updatedTransaction.items);
          updatedTransaction.totalAmount = totalAmount;
          updatedTransaction.totalCostPrice = totalCostPrice;
          updatedTransaction.profit = profit;
        }
        
        return updatedTransaction;
      });
    });
    
    toast.success("Transaksi berhasil diperbarui!");
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast.success("Transaksi berhasil dihapus!");
  };

  const getTransaction = (id: string) => {
    return transactions.find(t => t.id === id);
  };

  const getTransactionsByMonth = (year: number, month: number) => {
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getFullYear() === year && transactionDate.getMonth() === month;
    });
  };

  return (
    <TransactionContext.Provider 
      value={{ 
        transactions, 
        addTransaction, 
        updateTransaction, 
        deleteTransaction, 
        getTransaction,
        getTransactionsByMonth,
        isLoading 
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = (): TransactionContextType => {
  const context = useContext(TransactionContext);
  
  if (context === undefined) {
    throw new Error("useTransactions must be used within a TransactionProvider");
  }
  
  return context;
};
