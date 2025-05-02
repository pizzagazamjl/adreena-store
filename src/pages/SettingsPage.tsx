
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import StoreProfileForm from "@/components/settings/StoreProfileForm";
import { useStore } from "@/contexts/StoreContext";

const SettingsPage: React.FC = () => {
  const { storeProfile } = useStore();
  
  return (
    <PageLayout title="Pengaturan">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Pengaturan Toko</h2>
          <p className="text-gray-500 mb-6">Mengatur profil untuk {storeProfile.storeName}</p>
          <StoreProfileForm />
        </div>
      </div>
    </PageLayout>
  );
};

export default SettingsPage;
