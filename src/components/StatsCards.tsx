import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnalyticsMetrics } from "@/utils/suspiciousAnalytics";
import { Wallet, AlertTriangle, TrendingUp, Shield, Activity } from "lucide-react";

interface StatsCardsProps {
  metrics: AnalyticsMetrics;
  totalTransactions: number;
}

export const StatsCards = ({ metrics, totalTransactions }: StatsCardsProps) => {
  const suspicionRate = (metrics.suspiciousWallets / metrics.totalWallets) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Wallets */}
      <Card className="bg-gradient-to-br from-card to-card/50 border-border hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              Active
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Total Wallets</p>
          <p className="text-3xl font-bold text-foreground">{metrics.totalWallets}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {totalTransactions} transactions
          </p>
        </CardContent>
      </Card>

      {/* Suspicious Wallets */}
      <Card className="bg-gradient-to-br from-orange-500/10 to-card border-orange-500/30 hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-lg bg-orange-500/10">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            </div>
            <Badge variant="destructive" className="text-xs">
              Alert
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Suspicious Wallets</p>
          <p className="text-3xl font-bold text-orange-500">
            {metrics.suspiciousWallets}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {suspicionRate.toFixed(1)}% of total
          </p>
        </CardContent>
      </Card>

      {/* Average Suspicion Score */}
      <Card className="bg-gradient-to-br from-yellow-500/10 to-card border-yellow-500/30 hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-lg bg-yellow-500/10">
              <TrendingUp className="w-5 h-5 text-yellow-500" />
            </div>
            <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-500">
              Avg
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Avg Suspicion Score</p>
          <p className="text-3xl font-bold text-yellow-500">
            {(metrics.averageSuspicionScore * 100).toFixed(1)}%
          </p>
          <div className="mt-2 w-full h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-500 transition-all"
              style={{ width: `${metrics.averageSuspicionScore * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Top Risk Wallet */}
      <Card className="bg-gradient-to-br from-red-500/10 to-card border-red-500/30 hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-lg bg-red-500/10">
              <Shield className="w-5 h-5 text-red-500" />
            </div>
            <Badge variant="destructive" className="text-xs">
              High Risk
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Highest Risk</p>
          <p className="text-xl font-bold text-red-500">
            {metrics.topSuspicious[0]
              ? `${(metrics.topSuspicious[0].suspicionScore * 100).toFixed(0)}%`
              : "N/A"}
          </p>
          <p className="text-xs text-muted-foreground mt-2 font-mono truncate">
            {metrics.topSuspicious[0]?.wallet.id || "No suspicious wallets"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
