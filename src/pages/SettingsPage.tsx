
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import StoreProfileForm from "@/components/settings/StoreProfileForm";

const SettingsPage: React.FC = () => {
  return (
    <PageLayout title="Pengaturan">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Pengaturan Toko</h2>
          <StoreProfileForm />
        </div>
      </div>
    </PageLayout>
  );
};

export default SettingsPage;
