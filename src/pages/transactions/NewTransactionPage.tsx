
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import TransactionForm from "@/components/transactions/TransactionForm";

const NewTransactionPage: React.FC = () => {
  return (
    <PageLayout title="Transaksi Baru">
      <TransactionForm />
    </PageLayout>
  );
};

export default NewTransactionPage;
