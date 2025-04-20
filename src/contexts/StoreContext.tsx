
import React, { createContext, useContext, useState, useEffect } from "react";
import { StoreProfile } from "@/types";

interface StoreContextType {
  storeProfile: StoreProfile;
  updateStoreProfile: (profile: Partial<StoreProfile>) => void;
  isLoading: boolean;
}

const defaultStoreProfile: StoreProfile = {
  storeName: "Adreena Store",
  storeAddress: "Jl. Pemuda No.34, Majalengka",
  storePhone: "085351881666",
  storeWhatsapp: "085351881666",
  storeFooter: "Terima kasih telah berbelanja di Adreena Store",
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [storeProfile, setStoreProfile] = useState<StoreProfile>(defaultStoreProfile);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would load from Supabase here
    const storedProfile = localStorage.getItem("storeProfile");
    
    if (storedProfile) {
      setStoreProfile(JSON.parse(storedProfile));
    }
    
    setIsLoading(false);
  }, []);

  const updateStoreProfile = (profile: Partial<StoreProfile>) => {
    const updatedProfile = { ...storeProfile, ...profile };
    setStoreProfile(updatedProfile);
    localStorage.setItem("storeProfile", JSON.stringify(updatedProfile));
    
    // In a real app, we would save to Supabase here too
  };

  return (
    <StoreContext.Provider value={{ storeProfile, updateStoreProfile, isLoading }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  
  return context;
};
