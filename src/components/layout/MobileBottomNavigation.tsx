
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, List, Plus, Settings } from "lucide-react";

const MobileBottomNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    { 
      icon: Home, 
      label: "Dashboard", 
      path: "/", 
      active: location.pathname === "/" 
    },
    { 
      icon: List, 
      label: "Transaksi", 
      path: "/transactions", 
      active: location.pathname.includes("/transactions") && !location.pathname.includes("/new") 
    },
    { 
      icon: Plus, 
      label: "Baru", 
      path: "/transactions/new", 
      active: location.pathname === "/transactions/new" 
    },
    { 
      icon: Settings, 
      label: "Pengaturan", 
      path: "/settings", 
      active: location.pathname === "/settings" 
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full",
              item.active ? "text-adreena-600" : "text-gray-500 hover:text-adreena-500"
            )}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNavigation;
