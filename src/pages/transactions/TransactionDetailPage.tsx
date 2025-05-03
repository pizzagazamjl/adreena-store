
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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const TransactionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTransaction, deleteTransaction } = useTransactions();
  const { storeProfile } = useStore();
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
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
    
    // Check if we're using Alzena Point store
    const isAlzenaPoint = storeProfile.id === "alzena-point";
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Nota ${transaction.id}</title>
          <style>
            body { 
              font-family: ${isAlzenaPoint ? "'Arial', sans-serif" : "'Courier New', monospace"}; 
              font-size: ${isAlzenaPoint ? '13px' : '12px'}; 
              margin: 0; 
              padding: 10px; 
              background-color: #ffffff;
            }
            .receipt-container { 
              width: ${isAlzenaPoint ? '210mm' : '210mm'}; 
              margin: 0 auto; 
              padding: ${isAlzenaPoint ? '15px' : '10px'};
              ${isAlzenaPoint ? 'border: 1px solid #e2e8f0;' : ''}
            }
            .receipt-header { 
              text-align: ${isAlzenaPoint ? 'left' : 'center'}; 
              margin-bottom: ${isAlzenaPoint ? '20px' : '10px'}; 
              ${isAlzenaPoint ? 'display: flex; justify-content: space-between; align-items: center;' : ''}
            }
            .receipt-divider { 
              border-top: 1px ${isAlzenaPoint ? 'solid #e2e8f0' : 'dashed #000'}; 
              margin: 8px 0; 
            }
            .receipt-total { 
              font-weight: bold; 
              margin-top: 8px; 
            }
            .receipt-footer { 
              text-align: ${isAlzenaPoint ? 'left' : 'left'}; 
              margin-top: 15px; 
              font-size: ${isAlzenaPoint ? '11px' : '10px'};
              display: flex; 
              justify-content: space-between; 
              align-items: center; 
            }
            .flex { display: flex; justify-content: space-between; }
            
            /* Alzena Point specific styles */
            ${isAlzenaPoint ? `
              table { border-collapse: collapse; width: 100%; }
              th { background-color: #1f2937; color: white; text-align: left; padding: 8px; }
              td { padding: 8px; border-bottom: 1px solid #e2e8f0; }
              tr:nth-child(even) { background-color: #f9fafb; }
              .customer-info, .store-info { margin-bottom: 20px; }
              .customer-info h3, .store-info h3 { font-size: 14px; color: #6b7280; margin-bottom: 5px; }
              .info-content { border-top: 1px solid #e2e8f0; padding-top: 5px; }
              .subtotal-section { display: flex; justify-content: flex-end; margin: 15px 0; }
              .subtotal-container { width: 200px; }
              .subtotal-row { display: flex; justify-content: space-between; padding: 5px 0; border-top: 1px solid #e2e8f0; }
              .total-row { font-weight: bold; border-top: 1px solid #e2e8f0; margin-top: 5px; padding-top: 5px; }
              .terms-section { margin-top: 30px; font-size: 11px; color: #6b7280; border-top: 1px solid #e2e8f0; padding-top: 10px; }
              .terms-title { text-transform: uppercase; font-weight: 500; margin-bottom: 5px; }
              .terms-list { padding-left: 20px; }
              .terms-list li { margin-bottom: 3px; }
            ` : ''}
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

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) {
      toast.error("Tidak dapat menemukan nota untuk diunduh");
      return;
    }

    try {
      setIsGeneratingPDF(true);
      toast.info("Sedang membuat PDF, mohon tunggu...");

      // Create a clone of the receipt to adjust styles for PDF
      const receiptElement = receiptRef.current.querySelector('#receipt');
      if (!receiptElement) {
        throw new Error("Element nota tidak ditemukan");
      }

      const receiptClone = receiptElement.cloneNode(true) as HTMLElement;

      // Check if we're using Alzena Point store
      const isAlzenaPoint = storeProfile.id === "alzena-point";

      // Add the clone to the document temporarily (outside the viewport) for html2canvas
      const tempElement = document.createElement('div');
      tempElement.style.position = 'absolute';
      tempElement.style.left = '-9999px';
      tempElement.appendChild(receiptClone);
      document.body.appendChild(tempElement);

      // Apply receipt-specific styling
      if (isAlzenaPoint) {
        receiptClone.style.backgroundColor = '#ffffff';
        receiptClone.style.fontFamily = 'Arial, sans-serif';
        receiptClone.style.color = '#4b5563';
        receiptClone.style.width = '210mm'; // A4 width for Alzena
      } else {
        receiptClone.style.backgroundColor = 'white';
        receiptClone.style.fontFamily = 'Courier New, monospace';
        receiptClone.style.width = '210mm'; // Wider width for Adreena (reverted to previous version)
        
        // For Adreena, we need to add the logo to the footer
        const footerDiv = receiptClone.querySelector('.receipt-footer') as HTMLElement;
        if (footerDiv) {
          // Remove any existing images to avoid duplication
          Array.from(footerDiv.getElementsByTagName("img")).forEach(img => img.remove());
          
          // Add the logo with appropriate size - 300% larger
          const img = document.createElement('img');
          img.src = '/lovable-uploads/7c3e6dd6-4c74-4738-a182-0aa8daefc1d9.png';
          img.alt = storeProfile.storeName;
          img.style.height = "180px"; // Increased from 60px to 180px (300% larger)
          img.style.width = "auto";
          img.style.objectFit = "contain";
          img.style.marginLeft = "20px";
          img.style.maxWidth = "360px"; // Increased from 120px to 360px (300% larger)

          footerDiv.style.display = 'flex';
          footerDiv.style.justifyContent = 'space-between';
          footerDiv.style.alignItems = 'center';
          footerDiv.appendChild(img);
        }
      }

      receiptClone.style.padding = '10mm';
      receiptClone.style.color = 'black';

      // Generate canvas from the clone
      const canvas = await html2canvas(receiptClone, {
        scale: 2, // Higher scale for better quality
        logging: false,
        backgroundColor: 'white',
      });

      // Remove the temporary element
      document.body.removeChild(tempElement);

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: isAlzenaPoint ? 'a4' : 'a4', // A4 for both (reverting Adreena to wider format)
      });

      // Calculate dimensions to fit the receipt properly
      const imgWidth = 190; // slightly less than page width      
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add image to PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

      // Save the PDF with store-specific naming
      pdf.save(`Nota_${isAlzenaPoint ? 'AlzenaPoint' : 'AdreenaStore'}_${transaction.id}.pdf`);
      toast.success("PDF berhasil diunduh");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Gagal membuat PDF. Silakan coba lagi.");
    } finally {
      setIsGeneratingPDF(false);
    }
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
          disabled={isGeneratingPDF}
        >
          <Download className="h-4 w-4 mr-2" /> 
          {isGeneratingPDF ? "Sedang Memproses..." : "PDF"}
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
