
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { Transaction } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Generate transaction ID with format AS-yymmxxx
export function generateTransactionId(date: Date, currentCount: number): string {
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const count = (currentCount + 1).toString().padStart(3, "0");
  
  return `AS-${year}${month}${count}`;
}

// Format date to Indonesian format
export function formatDate(date: Date): string {
  return format(date, "dd MMMM yyyy");
}

// Format time to Indonesian format
export function formatTime(date: Date): string {
  return format(date, "HH:mm");
}

// Calculate totals for a transaction
export function calculateTransactionTotals(items: Transaction["items"]): {
  totalAmount: number;
  totalCostPrice: number;
  profit: number;
} {
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  
  const totalCostPrice = items.reduce(
    (sum, item) => sum + item.costPrice * item.quantity,
    0
  );
  
  const profit = totalAmount - totalCostPrice;
  
  return { totalAmount, totalCostPrice, profit };
}
