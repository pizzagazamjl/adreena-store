
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
    <div className="flex flex-col min-h-screen">
      <Header title={title} />
      
      <main className={cn(
        "flex-1 container mx-auto px-4 py-4 mb-16 md:mb-0",
        className
      )}>
        {children}
      </main>
      
      <MobileBottomNavigation />
    </div>
  );
};

export default PageLayout;
