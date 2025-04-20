
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { TransactionItem } from "@/types";
import { Plus, Minus } from "lucide-react";

interface TransactionItemFormProps {
  items: TransactionItem[];
  setItems: React.Dispatch<React.SetStateAction<TransactionItem[]>>;
}

const TransactionItemForm: React.FC<TransactionItemFormProps> = ({ 
  items, 
  setItems 
}) => {
  const addItem = () => {
    const newItem: TransactionItem = {
      id: Date.now().toString(),
      name: "",
      price: 0,
      quantity: 1,
      costPrice: 0,
    };
    
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof TransactionItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const calculateSubtotal = (item: TransactionItem) => {
    return item.price * item.quantity;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Daftar Barang</h3>
        <Button 
          type="button" 
          onClick={addItem} 
          size="sm" 
          className="bg-adreena-500 hover:bg-adreena-600"
        >
          <Plus className="h-4 w-4 mr-1" /> Tambah Barang
        </Button>
      </div>
      
      <div className="space-y-4">
        {items.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            Belum ada barang. Klik "Tambah Barang" untuk menambahkan.
          </div>
        )}
        
        {items.map((item, index) => (
          <div key={item.id} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium">Item #{index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Minus className="h-4 w-4 mr-1" /> Hapus
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nama Barang
                </label>
                <Input
                  value={item.name}
                  onChange={(e) => updateItem(item.id, "name", e.target.value)}
                  placeholder="Nama barang"
                  className="w-full"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Harga Jual
                  </label>
                  <Input
                    type="number"
                    value={item.price || ""}
                    onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value) || 0)}
                    placeholder="Harga jual"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Jumlah
                  </label>
                  <Input
                    type="number"
                    value={item.quantity || ""}
                    onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                    min="1"
                    className="w-full"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Harga Modal <span className="text-xs text-gray-500">(tidak tampil di nota)</span>
                </label>
                <Input
                  type="number"
                  value={item.costPrice || ""}
                  onChange={(e) => updateItem(item.id, "costPrice", parseFloat(e.target.value) || 0)}
                  placeholder="Harga modal"
                  className="w-full"
                />
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm text-gray-500">Subtotal:</span>
                <span className="font-medium">
                  {formatCurrency(calculateSubtotal(item))}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {items.length > 0 && (
        <div className="flex justify-end mt-4">
          <div className="text-right">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium mr-4">Total:</span>
              <span className="text-lg font-bold text-adreena-700">
                {formatCurrency(items.reduce((sum, item) => sum + calculateSubtotal(item), 0))}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span className="mr-4">Total Modal:</span>
              <span>
                {formatCurrency(items.reduce((sum, item) => sum + (item.costPrice * item.quantity), 0))}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="mr-4 font-medium">Keuntungan:</span>
              <span className="font-medium text-adreena-600">
                {formatCurrency(
                  items.reduce((sum, item) => sum + calculateSubtotal(item), 0) - 
                  items.reduce((sum, item) => sum + (item.costPrice * item.quantity), 0)
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionItemForm;
