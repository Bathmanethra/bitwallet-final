import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { Clock, TrendingUp } from "lucide-react";
import { Wallet, Transaction } from "@/types/wallet";
import { getTemporalActivity } from "@/utils/suspiciousAnalytics";

interface TemporalAnalysisChartProps {
  wallet: Wallet | null;
  transactions: Transaction[];
}

export const TemporalAnalysisChart = ({
  wallet,
  transactions,
}: TemporalAnalysisChartProps) => {
  const temporalData = useMemo(() => {
    if (!wallet) return [];
    
    const activity = getTemporalActivity(wallet, transactions, 24);
    
    return activity.map((item) => ({
      date: new Date(item.timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      transactions: item.count,
      volume: parseFloat(item.volume.toFixed(2)),
    }));
  }, [wallet, transactions]);

  if (!wallet) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-8 text-center">
          <Clock className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">
            Select a wallet to view temporal analysis
          </p>
        </CardContent>
      </Card>
    );
  }

  const maxVolume = Math.max(...temporalData.map(d => d.volume));
  const maxTxCount = Math.max(...temporalData.map(d => d.transactions));

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <CardTitle>Temporal Activity Analysis</CardTitle>
        </div>
        <CardDescription>
          Transaction patterns over time for {wallet.id}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Transaction Frequency Chart */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Transaction Frequency (per day)
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={temporalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Bar
                dataKey="transactions"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Volume Chart */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            Transaction Volume (BTC per day)
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={temporalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="volume"
                stroke="hsl(25, 95%, 53%)"
                strokeWidth={2}
                dot={{ fill: "hsl(25, 95%, 53%)", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Peak Day</p>
            <p className="text-lg font-bold text-foreground">
              {temporalData.length > 0 
                ? temporalData.reduce((max, curr) => 
                    curr.transactions > max.transactions ? curr : max
                  ).date
                : "N/A"
              }
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Max Transactions</p>
            <p className="text-lg font-bold text-primary">{maxTxCount}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Max Volume</p>
            <p className="text-lg font-bold text-orange-500">{maxVolume} BTC</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
