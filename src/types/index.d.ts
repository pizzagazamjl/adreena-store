export interface TransactionItem {
  id: string;
  name: string;
  price: number;
  costPrice: number;
  quantity: number;
}

export interface Transaction {
  id: string;
  customerName?: string;
  date: Date;
  totalAmount: number;
  totalCostPrice: number;
  profit: number;
  note?: string;
  items: TransactionItem[];
}

export interface StoreProfile {
  id: string;
  storeName: string;
  storeAddress?: string;
  storePhone?: string;
  storeWhatsapp?: string;
  storeFooter?: string;
}
