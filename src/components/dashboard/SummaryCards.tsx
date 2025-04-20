
import React from "react";
import { DashboardSummary } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface SummaryCardsProps {
  summary: DashboardSummary;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Penjualan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-adreena-700">
            {formatCurrency(summary.totalSales)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Periode {new Date(summary.periodStart).toLocaleDateString('id-ID')} - {new Date(summary.periodEnd).toLocaleDateString('id-ID')}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Keuntungan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-adreena-700">
            {formatCurrency(summary.totalProfit)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Marjin {summary.totalSales > 0 ? ((summary.totalProfit / summary.totalSales) * 100).toFixed(1) : 0}%
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Jumlah Transaksi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-adreena-700">
            {summary.transactionCount}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Rata-rata {formatCurrency(summary.transactionCount > 0 ? summary.totalSales / summary.transactionCount : 0)} per transaksi
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
