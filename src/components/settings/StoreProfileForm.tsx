
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useStore } from "@/contexts/StoreContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const formSchema = z.object({
  storeName: z.string().min(1, "Nama toko tidak boleh kosong"),
  storeAddress: z.string().optional(),
  storePhone: z.string().optional(),
  storeWhatsapp: z.string().optional(),
  storeFooter: z.string().optional(),
});

const StoreProfileForm = () => {
  const { storeProfile, updateStoreProfile } = useStore();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      storeName: storeProfile.storeName,
      storeAddress: storeProfile.storeAddress || "",
      storePhone: storeProfile.storePhone || "",
      storeWhatsapp: storeProfile.storeWhatsapp || "",
      storeFooter: storeProfile.storeFooter || "",
    },
  });
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    updateStoreProfile(values);
    toast.success("Pengaturan berhasil disimpan");
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
                <Input placeholder="Nama Toko" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="storeAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat</FormLabel>
              <FormControl>
                <Input placeholder="Alamat Toko" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="storePhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No. Telepon</FormLabel>
                <FormControl>
                  <Input placeholder="No. Telepon" {...field} />
                </FormControl>
                <FormDescription>
                  Nomor telepon yang ditampilkan pada nota
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="storeWhatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No. WhatsApp</FormLabel>
                <FormControl>
                  <Input placeholder="No. WhatsApp" {...field} />
                </FormControl>
                <FormDescription>
                  Format: 62812XXXXXXX (tanpa +/0 di depan)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="storeFooter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teks Footer Nota</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Pesan di bagian bawah nota" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="pt-4">
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
