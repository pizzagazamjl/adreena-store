
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
  
  // Apply different receipt styling based on the store
  const isAlzenaPoint = storeProfile.id === "alzena-point";

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

      {isAlzenaPoint ? (
        // ALZENA POINT RECEIPT DESIGN - Professional Invoice Style
        <div className="receipt-container bg-white border border-gray-200 rounded-lg p-6" id="receipt">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-xl font-bold text-gray-800">NOTA</h1>
            <div className="text-right">
              <div className="mb-1">
                <span className="text-sm text-gray-600">Nomor Nota</span>
                <div className="font-medium">{transaction.id}</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Tanggal</span>
                <div className="font-medium">{formatDate(transaction.date)}</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Informasi Pembeli</h3>
              <div className="border-t border-gray-200 pt-2">
                <div className="mb-1">
                  <div className="font-medium">{transaction.customerName || "Pelanggan Umum"}</div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Informasi Toko</h3>
              <div className="border-t border-gray-200 pt-2">
                <div className="mb-1">
                  <div className="font-medium">{storeProfile.storeName}</div>
                </div>
                <div className="text-sm text-gray-600">
                  {storeProfile.storeAddress && (
                    <div className="mb-1">{storeProfile.storeAddress}</div>
                  )}
                  {storeProfile.storePhone && (
                    <div>{storeProfile.storePhone}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Produk</h3>
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="py-2 px-4 text-left">Deskripsi</th>
                    <th className="py-2 px-4 text-center">Jumlah</th>
                    <th className="py-2 px-4 text-right">Harga Satuan</th>
                    <th className="py-2 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transaction.items.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="py-3 px-4">{item.name}</td>
                      <td className="py-3 px-4 text-center">{item.quantity}</td>
                      <td className="py-3 px-4 text-right">{formatCurrency(item.price)}</td>
                      <td className="py-3 px-4 text-right font-medium">{formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex justify-end mb-6">
            <div className="w-64">
              <div className="border-t border-gray-200 py-2 flex justify-between">
                <span className="text-sm font-medium">Subtotal</span>
                <span>{formatCurrency(transaction.totalAmount)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 pb-1 mt-2 flex justify-between font-bold">
                <span>TOTAL</span>
                <span>{formatCurrency(transaction.totalAmount)}</span>
              </div>
            </div>
          </div>
          
          {transaction.note && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Catatan Tambahan</h3>
              <div className="border-t border-gray-200 pt-2 text-sm">
                {transaction.note}
              </div>
            </div>
          )}
          
          <div className="mt-8 pt-4 border-t border-gray-200 text-xs text-gray-600">
            <div className="flex justify-between items-center">
              <div>
                <div className="uppercase font-medium mb-1">SYARAT DAN KETENTUAN</div>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Barang yang sudah dibeli tidak dapat dikembalikan.</li>
                  <li>Penjual menjamin produk dalam kondisi baik saat pengiriman.</li>
                  <li>Pembayaran dianggap lunas ketika sudah terverifikasi.</li>
                </ol>
                <div className="mt-2">
                  {storeProfile.storeFooter}
                </div>
              </div>
              <div>
                <img
                  src="/lovable-uploads/d92af38d-c7a4-482e-9633-55a279c0b29c.png"
                  alt="Alzena Point"
                  className="h-24 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        // ADREENA STORE RECEIPT DESIGN - Original Simple Format
        <div className="receipt-container border border-gray-200 rounded-md p-4" id="receipt">
          <div className="receipt-header text-center mb-4">
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
              alt={storeProfile.storeName}
              style={{
                height: 108,
                width: "auto",
                marginLeft: 20,
                objectFit: "contain",
                display: "block",
                maxWidth: 120,
              }}
              className="inline-block align-middle"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionReceipt;
