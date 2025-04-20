
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import TransactionForm from "@/components/transactions/TransactionForm";
import { useTransactions } from "@/contexts/TransactionContext";
import { Button } from "@/components/ui/button";

const EditTransactionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTransaction } = useTransactions();
  
  const transaction = getTransaction(id || "");
  
  if (!transaction) {
    return (
      <PageLayout>
        <div className="text-center py-10">
          <p className="mb-4">Transaksi tidak ditemukan</p>
          <Button onClick={() => navigate("/transactions")}>
            Kembali ke Daftar Transaksi
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={`Edit Transaksi #${transaction.id}`}>
      <TransactionForm 
        defaultValues={transaction}
        isEditMode={true}
      />
    </PageLayout>
  );
};

export default EditTransactionPage;
