
import React, { createContext, useContext, useState, useEffect } from "react";
import { Transaction, TransactionItem } from "@/types";
import { generateTransactionId, calculateTransactionTotals } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id" | "totalAmount" | "totalCostPrice" | "profit">) => Promise<string>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
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

  // Load transactions from Supabase on mount
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select(`
            *,
            items:transaction_items(*)
          `)
          .order('date', { ascending: false });

        if (error) throw error;

        const formattedTransactions: Transaction[] = data.map(t => ({
          id: t.id,
          customerName: t.customer_name,
          date: new Date(t.date),
          totalAmount: Number(t.total_amount),
          totalCostPrice: Number(t.total_cost_price),
          profit: Number(t.profit),
          note: t.note,
          items: t.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: Number(item.price),
            costPrice: Number(item.cost_price),
            quantity: Number(item.quantity)
          }))
        }));

        setTransactions(formattedTransactions);
      } catch (error) {
        console.error('Error loading transactions:', error);
        toast.error("Gagal memuat data transaksi");
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const getNextTransactionCount = (date: Date): number => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const transactionsThisMonth = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getFullYear() === year && tDate.getMonth() === month;
    });
    
    return transactionsThisMonth.length;
  };

  const addTransaction = async (transactionData: Omit<Transaction, "id" | "totalAmount" | "totalCostPrice" | "profit">): Promise<string> => {
    const { totalAmount, totalCostPrice, profit } = calculateTransactionTotals(transactionData.items);
    const id = generateTransactionId(transactionData.date, getNextTransactionCount(transactionData.date));

    // First insert the transaction
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        id,
        customer_name: transactionData.customerName,
        date: transactionData.date.toISOString(),
        total_amount: totalAmount,
        total_cost_price: totalCostPrice,
        profit,
        note: transactionData.note
      });

    if (transactionError) {
      console.error('Error inserting transaction:', transactionError);
      toast.error("Gagal menyimpan transaksi");
      throw transactionError;
    }

    // Then insert all transaction items
    const { error: itemsError } = await supabase
      .from('transaction_items')
      .insert(
        transactionData.items.map(item => ({
          transaction_id: id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          cost_price: item.costPrice
        }))
      );

    if (itemsError) {
      console.error('Error inserting transaction items:', itemsError);
      toast.error("Gagal menyimpan item transaksi");
      throw itemsError;
    }

    const newTransaction: Transaction = {
      ...transactionData,
      id,
      totalAmount,
      totalCostPrice,
      profit
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    toast.success("Transaksi berhasil disimpan!");
    
    return id;
  };

  const updateTransaction = async (id: string, transactionData: Partial<Transaction>) => {
    let updateData: any = {};
    
    // Map camelCase to snake_case for database columns
    if (transactionData.customerName !== undefined) updateData.customer_name = transactionData.customerName;
    if (transactionData.note !== undefined) updateData.note = transactionData.note;
    if (transactionData.date) updateData.date = transactionData.date.toISOString();
    
    // If items are being updated, recalculate totals
    if (transactionData.items) {
      const { totalAmount, totalCostPrice, profit } = calculateTransactionTotals(transactionData.items);
      updateData = {
        ...updateData,
        total_amount: totalAmount,
        total_cost_price: totalCostPrice,
        profit
      };
      
      // Update items in the database
      const { error: deleteError } = await supabase
        .from('transaction_items')
        .delete()
        .eq('transaction_id', id);

      if (deleteError) {
        console.error('Error deleting old items:', deleteError);
        toast.error("Gagal memperbarui transaksi");
        throw deleteError;
      }

      const { error: insertError } = await supabase
        .from('transaction_items')
        .insert(
          transactionData.items.map(item => ({
            transaction_id: id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            cost_price: item.costPrice
          }))
        );

      if (insertError) {
        console.error('Error inserting new items:', insertError);
        toast.error("Gagal memperbarui item transaksi");
        throw insertError;
      }
    }

    // Update the transaction
    if (Object.keys(updateData).length > 0) {
      const { error } = await supabase
        .from('transactions')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating transaction:', error);
        toast.error("Gagal memperbarui transaksi");
        throw error;
      }
    }

    // Update local state
    setTransactions(prev => 
      prev.map(t => {
        if (t.id !== id) return t;
        
        // Create updated transaction with correct property names
        const updatedTransaction: Transaction = { ...t };
        
        if (transactionData.customerName !== undefined) updatedTransaction.customerName = transactionData.customerName;
        if (transactionData.note !== undefined) updatedTransaction.note = transactionData.note;
        if (transactionData.date) updatedTransaction.date = transactionData.date;
        
        if (transactionData.items) {
          updatedTransaction.items = [...transactionData.items];
          const { totalAmount, totalCostPrice, profit } = calculateTransactionTotals(transactionData.items);
          updatedTransaction.totalAmount = totalAmount;
          updatedTransaction.totalCostPrice = totalCostPrice;
          updatedTransaction.profit = profit;
        }
        
        return updatedTransaction;
      })
    );
    
    toast.success("Transaksi berhasil diperbarui!");
  };

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting transaction:', error);
      toast.error("Gagal menghapus transaksi");
      throw error;
    }

    setTransactions(prev => prev.filter(t => t.id !== id));
    toast.success("Transaksi berhasil dihapus!");
  };

  // These functions don't need to be async as they work with local state
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
