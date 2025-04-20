
import React, { useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import TransactionReceipt from "@/components/transactions/TransactionReceipt";
import { useTransactions } from "@/contexts/TransactionContext";
import { useStore } from "@/contexts/StoreContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Trash, Download, Share } from "lucide-react";
import { toast } from "sonner";

const TransactionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTransaction, deleteTransaction } = useTransactions();
  const { storeProfile } = useStore();
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
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

  const handlePrint = () => {
    const receiptContent = receiptRef.current;
    if (!receiptContent) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Pop-up diblokir. Harap aktifkan pop-up untuk mencetak.");
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Nota ${transaction.id}</title>
          <style>
            body { font-family: 'Courier New', monospace; font-size: 12px; margin: 0; padding: 10px; }
            .receipt-container { width: 76mm; margin: 0 auto; }
            .receipt-header { text-align: center; margin-bottom: 10px; }
            .receipt-divider { border-top: 1px dashed #000; margin: 8px 0; }
            .receipt-total { font-weight: bold; margin-top: 8px; }
            .receipt-footer { text-align: center; margin-top: 15px; font-size: 10px; }
            .flex { display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          ${receiptContent.innerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleDownloadPDF = () => {
    // This is a placeholder - in a real app, you would use a library like jsPDF
    toast.info("Fitur download PDF akan tersedia segera.");
  };

  const handleShareWhatsApp = () => {
    if (!storeProfile.storeWhatsapp) {
      toast.error("Harap tambahkan nomor WhatsApp di pengaturan toko terlebih dahulu.");
      return;
    }

    // Create a simple text version of the receipt
    const receiptLines = [
      `*${storeProfile.storeName}*`,
      `ID: ${transaction.id}`,
      `Tanggal: ${formatDate(transaction.date)}`,
      "",
      "-------------------",
    ];

    if (transaction.customerName) {
      receiptLines.push(`Pembeli: ${transaction.customerName}`);
      receiptLines.push("");
    }

    transaction.items.forEach(item => {
      receiptLines.push(`${item.name}`);
      receiptLines.push(`${item.quantity} x ${formatCurrency(item.price)} = ${formatCurrency(item.price * item.quantity)}`);
    });

    receiptLines.push("-------------------");
    receiptLines.push(`*Total: ${formatCurrency(transaction.totalAmount)}*`);
    
    if (transaction.note) {
      receiptLines.push("");
      receiptLines.push(`Catatan: ${transaction.note}`);
    }

    receiptLines.push("");
    receiptLines.push(storeProfile.storeFooter || "Terima kasih telah berbelanja!");

    const receiptText = receiptLines.join("\n");
    const encodedText = encodeURIComponent(receiptText);
    
    // Use WhatsApp API to send the receipt
    window.open(`https://api.whatsapp.com/send?phone=${storeProfile.storeWhatsapp}&text=${encodedText}`, "_blank");
  };

  const handleDelete = () => {
    deleteTransaction(transaction.id);
    navigate("/transactions");
  };

  return (
    <PageLayout title={`Detail Transaksi #${transaction.id}`}>
      <div className="mb-4 flex flex-wrap gap-2 justify-end">
        <Button
          variant="outline"
          onClick={() => navigate(`/transactions/edit/${transaction.id}`)}
        >
          <Edit className="h-4 w-4 mr-2" /> Edit
        </Button>
        
        <Button
          variant="outline"
          onClick={handleDownloadPDF}
        >
          <Download className="h-4 w-4 mr-2" /> PDF
        </Button>
        
        <Button
          variant="outline"
          onClick={handleShareWhatsApp}
        >
          <Share className="h-4 w-4 mr-2" /> WhatsApp
        </Button>
        
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash className="h-4 w-4 mr-2" /> Hapus
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Informasi Transaksi</h3>
            <div className="bg-white rounded-lg border p-4 shadow-sm">
              <div className="grid grid-cols-2 gap-y-2">
                <div className="text-gray-500">ID Transaksi:</div>
                <div className="font-medium">{transaction.id}</div>
                
                <div className="text-gray-500">Tanggal:</div>
                <div>{formatDate(transaction.date)}</div>
                
                <div className="text-gray-500">Pembeli:</div>
                <div>{transaction.customerName || "-"}</div>
                
                <div className="text-gray-500">Total:</div>
                <div className="font-semibold">{formatCurrency(transaction.totalAmount)}</div>
                
                <div className="text-gray-500">Modal:</div>
                <div>{formatCurrency(transaction.totalCostPrice)}</div>
                
                <div className="text-gray-500">Keuntungan:</div>
                <div className="font-medium text-adreena-600">{formatCurrency(transaction.profit)}</div>
              </div>
              
              {transaction.note && (
                <div className="mt-4 pt-4 border-t">
                  <div className="text-gray-500 mb-1">Catatan:</div>
                  <div>{transaction.note}</div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Detail Barang</h3>
            <div className="bg-white rounded-lg border shadow-sm">
              <table className="w-full">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left">Nama</th>
                    <th className="px-4 py-2 text-right">Harga</th>
                    <th className="px-4 py-2 text-right">Jumlah</th>
                    <th className="px-4 py-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {transaction.items.map((item, index) => (
                    <tr key={index} className="text-sm">
                      <td className="px-4 py-3">{item.name}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(item.price)}</td>
                      <td className="px-4 py-3 text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-right font-medium">{formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 font-medium">
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-right">Total:</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(transaction.totalAmount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        
        <div ref={receiptRef}>
          <TransactionReceipt 
            transaction={transaction}
            onPrint={handlePrint}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default TransactionDetailPage;
