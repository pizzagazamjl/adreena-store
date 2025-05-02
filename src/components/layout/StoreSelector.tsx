
import React from "react";
import { useStore } from "@/contexts/StoreContext";
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuList, 
  NavigationMenuTrigger 
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Check, Store } from "lucide-react";
import { cn } from "@/lib/utils";

const StoreSelector: React.FC = () => {
  const { availableStores, activeStoreId, switchStore } = useStore();

  const activeStore = availableStores.find(store => store.id === activeStoreId);

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-white/10 hover:bg-white/20 text-white">
            <Store className="h-4 w-4 mr-2" />
            {activeStore?.storeName || "Pilih Toko"}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[220px] p-2">
              <h4 className="font-medium text-sm px-2 py-1.5 text-gray-500">Pilih Toko</h4>
              <div className="mt-1">
                {availableStores.map((store) => (
                  <Button
                    key={store.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-left font-normal mb-1",
                      store.id === activeStoreId && "bg-adreena-50 text-adreena-600"
                    )}
                    onClick={() => switchStore(store.id)}
                  >
                    <Store className="h-4 w-4 mr-2" />
                    <span>{store.storeName}</span>
                    {store.id === activeStoreId && (
                      <Check className="h-4 w-4 ml-auto" />
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default StoreSelector;
