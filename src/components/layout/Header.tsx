
import React from "react";
import { useStore } from "@/contexts/StoreContext";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { storeProfile } = useStore();
  
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-lg font-bold text-adreena-800">
            {title || storeProfile.storeName}
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
