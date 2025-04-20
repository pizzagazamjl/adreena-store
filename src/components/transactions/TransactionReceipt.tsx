
import React from "react";
import { useStore } from "@/contexts/StoreContext";
import { Transaction } from "@/types";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface TransactionReceiptProps {
  transaction: Transaction;
  onPrint: () => void;
}

const TransactionReceipt: React.FC<TransactionReceiptProps> = ({
  transaction,
  onPrint
}) => {
  const { storeProfile } = useStore();

  return (
    <div className="border rounded-lg bg-white shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Pratinjau Nota</h3>
        <Button 
          onClick={onPrint}
          className="bg-adreena-500 hover:bg-adreena-600"
        >
          <Printer className="h-4 w-4 mr-2" /> Cetak
        </Button>
      </div>

      <div className="receipt-container border border-gray-200 rounded-md" id="receipt">
        <div className="receipt-header">
          <div className="text-lg font-bold mb-1">{storeProfile.storeName}</div>
          {storeProfile.storeAddress && (
            <div className="text-sm mb-1">{storeProfile.storeAddress}</div>
          )}
          {storeProfile.storePhone && (
            <div className="text-sm">{storeProfile.storePhone}</div>
          )}
        </div>

        <div className="text-sm mb-2">
          <div className="flex justify-between">
            <span>No: {transaction.id}</span>
            <span>{formatTime(transaction.date)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tanggal:</span>
            <span>{formatDate(transaction.date)}</span>
          </div>
          {transaction.customerName && (
            <div className="flex justify-between">
              <span>Pembeli:</span>
              <span>{transaction.customerName}</span>
            </div>
          )}
        </div>

        <div className="receipt-divider"></div>

        <div className="mb-2">
          {transaction.items.map((item, index) => (
            <div key={index} className="text-sm mb-1">
              <div>{item.name}</div>
              <div className="flex justify-between">
                <span>
                  {item.quantity} x {formatCurrency(item.price)}
                </span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="receipt-divider"></div>

        <div className="receipt-total">
          <div className="flex justify-between text-sm font-bold">
            <span>Total:</span>
            <span>{formatCurrency(transaction.totalAmount)}</span>
          </div>
        </div>

        {transaction.note && (
          <div className="mt-3 text-sm">
            <span>Catatan: {transaction.note}</span>
          </div>
        )}

        <div className="receipt-footer">
          <div className="text-sm">{storeProfile.storeFooter}</div>
        </div>
      </div>
    </div>
  );
};

export default TransactionReceipt;
