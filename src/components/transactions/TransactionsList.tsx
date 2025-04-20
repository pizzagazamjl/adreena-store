
import React from "react";
import { useNavigate } from "react-router-dom";
import { Transaction } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface TransactionsListProps {
  transactions: Transaction[];
  emptyMessage?: string;
}

const TransactionsList: React.FC<TransactionsListProps> = ({ 
  transactions,
  emptyMessage = "Belum ada transaksi"
}) => {
  const navigate = useNavigate();

  if (transactions.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">ID</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Pembeli</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Keuntungan</TableHead>
            <TableHead className="w-[100px] text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{transaction.id}</TableCell>
              <TableCell>{formatDate(new Date(transaction.date))}</TableCell>
              <TableCell>{transaction.customerName || "-"}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(transaction.totalAmount)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(transaction.profit)}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/transactions/${transaction.id}`)}
                  className="text-adreena-600 hover:text-adreena-700 hover:bg-adreena-50"
                >
                  Detail
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsList;
