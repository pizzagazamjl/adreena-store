
import React, { createContext, useContext, useState, useEffect } from "react";
import { StoreProfile } from "@/types";

interface StoreContextType {
  storeProfile: StoreProfile;
  updateStoreProfile: (profile: Partial<StoreProfile>) => void;
  isLoading: boolean;
  availableStores: StoreProfile[];
  activeStoreId: string;
  switchStore: (storeId: string) => void;
}

const defaultStores: StoreProfile[] = [
  {
    id: "adreena-store",
    storeName: "Adreena Store",
    storeAddress: "Jl. Pemuda No.34, Majalengka",
    storePhone: "085351881666",
    storeWhatsapp: "085351881666",
    storeFooter: "Terima kasih telah berbelanja di Adreena Store",
  },
  {
    id: "alzena-point",
    storeName: "Alzena Point",
    storeAddress: "Jl. Pahlawan No.12, Majalengka",
    storePhone: "085351881777",
    storeWhatsapp: "085351881777",
    storeFooter: "Terima kasih telah berbelanja di Alzena Point",
  }
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [availableStores, setAvailableStores] = useState<StoreProfile[]>(defaultStores);
  const [activeStoreId, setActiveStoreId] = useState<string>("adreena-store");
  const [isLoading, setIsLoading] = useState(true);

  // Get the active store profile based on activeStoreId
  const storeProfile = availableStores.find(store => store.id === activeStoreId) || availableStores[0];

  useEffect(() => {
    // Load stores from localStorage
    const storedStores = localStorage.getItem("availableStores");
    const storedActiveStoreId = localStorage.getItem("activeStoreId");
    
    if (storedStores) {
      setAvailableStores(JSON.parse(storedStores));
    }
    
    if (storedActiveStoreId) {
      setActiveStoreId(storedActiveStoreId);
    }
    
    setIsLoading(false);
  }, []);

  const updateStoreProfile = (profile: Partial<StoreProfile>) => {
    const updatedStores = availableStores.map(store => 
      store.id === activeStoreId ? { ...store, ...profile } : store
    );
    
    setAvailableStores(updatedStores);
    localStorage.setItem("availableStores", JSON.stringify(updatedStores));
    
    // In a real app, we would save to Supabase here too
  };

  const switchStore = (storeId: string) => {
    if (availableStores.some(store => store.id === storeId)) {
      setActiveStoreId(storeId);
      localStorage.setItem("activeStoreId", storeId);
    }
  };

  return (
    <StoreContext.Provider value={{ 
      storeProfile, 
      updateStoreProfile, 
      isLoading, 
      availableStores, 
      activeStoreId, 
      switchStore 
    }}>
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
