
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

      <div className="receipt-container border border-gray-200 rounded-md p-4" id="receipt">
        <div className="receipt-header text-center mb-4">
          {/* Logo atas dihapus sesuai permintaan */}
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
        <div className="receipt-divider border-t border-dashed my-2"></div>
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
        <div className="receipt-divider border-t border-dashed my-2"></div>
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
        <div className="receipt-footer text-xs mt-4 flex items-center justify-between">
          <div style={{ maxWidth: "60%", wordBreak: "break-word" }}>
            {storeProfile.storeFooter}
          </div>
          <img
            src="/lovable-uploads/7c3e6dd6-4c74-4738-a182-0aa8daefc1d9.png"
            alt="Adreena Store"
            style={{
              height: 108, // 3x dari sebelumnya 36
              width: "auto",
              marginLeft: 20, // geser agak ke kiri dari tepi kanan
              objectFit: "contain",
              display: "block",
              maxWidth: 120, // agar tetap proporsional di footer
            }}
            className="inline-block align-middle"
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionReceipt;
