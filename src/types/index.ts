
export interface StoreProfile {
  id: string;
  storeName: string;
  storeAddress?: string;
  storePhone?: string;
  storeWhatsapp?: string;
  storeLogo?: string;
  storeFooter?: string;
}

export interface TransactionItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  costPrice: number; // Modal (cost price), not shown on receipt
}

export interface Transaction {
  id: string;
  customerName?: string;
  date: Date;
  items: TransactionItem[];
  totalAmount: number;
  totalCostPrice: number; // Total modal (total cost price)
  profit: number; // Calculated profit
  note?: string;
}

export interface DashboardSummary {
  totalSales: number;
  totalProfit: number;
  transactionCount: number;
  periodStart: Date;
  periodEnd: Date;
}
