
import React from "react";
import { useStore } from "@/contexts/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const formSchema = z.object({
  storeName: z.string().min(1, "Nama toko harus diisi"),
  storeAddress: z.string().optional(),
  storePhone: z.string().optional(),
  storeWhatsapp: z.string().optional(),
  storeFooter: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const StoreProfileForm = () => {
  const { storeProfile, updateStoreProfile, isLoading } = useStore();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: storeProfile,
  });

  const onSubmit = (data: FormValues) => {
    updateStoreProfile(data);
    toast.success("Pengaturan toko berhasil diperbarui");
  };

  if (isLoading) {
    return <div className="text-center py-4">Memuat...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="storeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Toko</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Nama ini akan muncul di bagian atas nota transaksi.
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="storeAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat Toko (Opsional)</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="storePhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Telepon (Opsional)</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="storeWhatsapp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor WhatsApp (Opsional)</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  value={field.value || ""}
                  placeholder="contoh: 6281234567890"
                />
              </FormControl>
              <FormDescription>
                Digunakan untuk berbagi nota via WhatsApp. Masukkan dengan format internasional tanpa karakter tambahan.
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="storeFooter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catatan Footer Nota (Opsional)</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  value={field.value || ""}
                  placeholder="contoh: Terima kasih telah berbelanja di Adreena Store"
                />
              </FormControl>
              <FormDescription>
                Teks ini akan muncul di bagian bawah nota transaksi.
              </FormDescription>
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button 
            type="submit"
            className="bg-adreena-500 hover:bg-adreena-600"
          >
            Simpan Pengaturan
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StoreProfileForm;
