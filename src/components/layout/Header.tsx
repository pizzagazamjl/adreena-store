
import React from "react";
import { useStore } from "@/contexts/StoreContext";
import { Link, useLocation } from "react-router-dom";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { storeProfile } = useStore();
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/transactions", label: "Transaksi" },
    { path: "/settings", label: "Pengaturan" }
  ];
  
  return (
    <header className="sticky top-0 z-10 bg-adreena-500 text-white border-b border-adreena-600 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">
            {title || storeProfile.storeName}
          </h1>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-white/80 ${
                  location.pathname === item.path ? "text-white" : "text-white/70"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
