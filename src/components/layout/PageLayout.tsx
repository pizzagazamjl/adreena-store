
import React from "react";
import Header from "./Header";
import MobileBottomNavigation from "./MobileBottomNavigation";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  title,
  className = ""
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-adreena-50 to-adreena-100">
      <Header title={title} />
      
      <main className={cn(
        "flex-1 container mx-auto px-4 py-6 mb-16 md:mb-6",
        className
      )}>
        <div className="bg-white rounded-xl shadow-lg p-6">
          {children}
        </div>
      </main>
      
      <MobileBottomNavigation />
    </div>
  );
};

export default PageLayout;
