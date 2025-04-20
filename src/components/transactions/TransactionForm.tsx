
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, formatDate } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TransactionItem } from "@/types";
import { useTransactions } from "@/contexts/TransactionContext";
import TransactionItemForm from "./TransactionItemForm";
import { toast } from "sonner";

const formSchema = z.object({
  customerName: z.string().optional(),
  date: z.date(),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TransactionFormProps {
  defaultValues?: {
    id?: string;
    customerName?: string;
    date?: Date;
    note?: string;
    items?: TransactionItem[];
  };
  isEditMode?: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ 
  defaultValues,
  isEditMode = false
}) => {
  const navigate = useNavigate();
  const { addTransaction, updateTransaction } = useTransactions();
  
  const [items, setItems] = useState<TransactionItem[]>(
    defaultValues?.items || []
  );
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: defaultValues?.customerName || "",
      date: defaultValues?.date || new Date(),
      note: defaultValues?.note || "",
    },
  });

  const onSubmit = (data: FormValues) => {
    if (items.length === 0) {
      toast.error("Harap tambahkan minimal satu barang");
      return;
    }

    // Validate items
    for (const item of items) {
      if (!item.name.trim()) {
        toast.error("Harap isi nama barang");
        return;
      }
      if (item.price <= 0) {
        toast.error("Harga jual harus lebih dari 0");
        return;
      }
      if (item.quantity <= 0) {
        toast.error("Jumlah harus lebih dari 0");
        return;
      }
    }

    if (isEditMode && defaultValues?.id) {
      // Update existing transaction
      updateTransaction(defaultValues.id, {
        ...data,
        items,
      });
      navigate(`/transactions/${defaultValues.id}`);
    } else {
      // Add new transaction
      const newTransactionId = addTransaction({
        ...data,
        items,
      });
      navigate(`/transactions/${newTransactionId}`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Pembeli (Opsional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Masukkan nama pembeli" 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tanggal Transaksi</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        formatDate(field.value)
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />

        <TransactionItemForm items={items} setItems={setItems} />

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catatan (Opsional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tambahkan catatan jika diperlukan" 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Batal
          </Button>
          <Button 
            type="submit"
            className="bg-adreena-500 hover:bg-adreena-600"
          >
            {isEditMode ? "Perbarui Transaksi" : "Simpan Transaksi"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TransactionForm;
