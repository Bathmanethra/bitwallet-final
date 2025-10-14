import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import Plot from "react-plotly.js";

// Generate sample wallet flow data with suspicious detection
const generateFlowData = () => {
  const wallets = Array.from({ length: 30 }, (_, i) => `Wallet_${i + 1}`);
  const flows: { from: string; to: string; amount: number }[] = [];
  
  // Generate random transactions
  for (let i = 0; i < 80; i++) {
    const from = wallets[Math.floor(Math.random() * wallets.length)];
    let to = wallets[Math.floor(Math.random() * wallets.length)];
    while (to === from) {
      to = wallets[Math.floor(Math.random() * wallets.length)];
    }
    const amount = Math.random() * 5 + 0.1;
    
    flows.push({ from, to, amount });
  }
  
  // Mark some wallets as suspicious (high activity)
  const walletActivity = new Map<string, number>();
  flows.forEach(({ from, to }) => {
    walletActivity.set(from, (walletActivity.get(from) || 0) + 1);
    walletActivity.set(to, (walletActivity.get(to) || 0) + 1);
  });
  
  const avgActivity = Array.from(walletActivity.values()).reduce((a, b) => a + b, 0) / walletActivity.size;
  const suspiciousWallets = new Set<string>();
  walletActivity.forEach((activity, wallet) => {
    if (activity > avgActivity * 1.5) {
      suspiciousWallets.add(wallet);
    }
  });
  
  // Aggregate flows
  const aggregated = new Map<string, number>();
  flows.forEach(({ from, to, amount }) => {
    const key = `${from}->${to}`;
    aggregated.set(key, (aggregated.get(key) || 0) + amount);
  });
  
  // Convert to arrays for Sankey
  const uniqueWallets = Array.from(new Set(flows.flatMap(f => [f.from, f.to])));
  const walletIndex = new Map(uniqueWallets.map((w, i) => [w, i]));
  
  const sources: number[] = [];
  const targets: number[] = [];
  const values: number[] = [];
  
  aggregated.forEach((amount, key) => {
    const [from, to] = key.split('->');
    sources.push(walletIndex.get(from)!);
    targets.push(walletIndex.get(to)!);
    values.push(amount);
  });
  
  return {
    labels: uniqueWallets,
    sources,
    targets,
    values,
    suspiciousWallets
  };
};

export const SankeyFlowChart = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const flowData = useMemo(() => generateFlowData(), [refreshKey]);
  
  const suspiciousCount = flowData.suspiciousWallets.size;
  
  const data = [{
    type: "sankey" as const,
    orientation: "h" as const,
    node: {
      pad: 15,
      thickness: 20,
      line: {
        color: flowData.labels.map(wallet => 
          flowData.suspiciousWallets.has(wallet) 
            ? "rgba(239, 68, 68, 0.8)" 
            : "rgba(255, 149, 0, 0.5)"
        ),
        width: flowData.labels.map(wallet => 
          flowData.suspiciousWallets.has(wallet) ? 3 : 2
        )
      },
      label: flowData.labels.map(wallet => 
        flowData.suspiciousWallets.has(wallet) ? `⚠️ ${wallet}` : wallet
      ),
      color: flowData.labels.map(wallet => {
        if (flowData.suspiciousWallets.has(wallet)) {
          return "hsl(0, 85%, 60%)"; // Red for suspicious
        }
        const hue = Math.random() * 60 + 10; // Orange/yellow range
        return `hsl(${hue}, 95%, 60%)`;
      })
    },
    link: {
      source: flowData.sources,
      target: flowData.targets,
      value: flowData.values,
      color: flowData.sources.map((sourceIdx, i) => {
        const sourceWallet = flowData.labels[sourceIdx];
        const targetWallet = flowData.labels[flowData.targets[i]];
        const isSuspicious = 
          flowData.suspiciousWallets.has(sourceWallet) || 
          flowData.suspiciousWallets.has(targetWallet);
        
        if (isSuspicious) {
          return "hsla(0, 85%, 60%, 0.4)"; // Red for suspicious flows
        }
        const hue = Math.random() * 60 + 10;
        return `hsla(${hue}, 95%, 60%, 0.3)`;
      })
    }
  }];
  
  const layout = {
    title: {
      text: "Wallet Transaction Flow Network",
      font: { color: "hsl(30, 100%, 98%)", size: 18 }
    },
    font: {
      size: 11,
      color: "hsl(30, 100%, 98%)"
    },
    plot_bgcolor: "rgba(0, 0, 0, 0.3)",
    paper_bgcolor: "transparent",
    height: 600,
    margin: { t: 50, l: 20, r: 20, b: 20 }
  };
  
  const config = {
    displayModeBar: true,
    displaylogo: false,
    responsive: true,
    modeBarButtonsToRemove: ['lasso2d', 'select2d']
  };

  return (
    <Card className="bg-card border-primary/20">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
              Sankey Flow Diagram
              {suspiciousCount > 0 && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {suspiciousCount} suspicious
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Visual representation of wallet-to-wallet transaction flows • 🔴 Red nodes/flows indicate suspicious activity
            </CardDescription>
          </div>
          <Button 
            onClick={() => setRefreshKey(k => k + 1)}
            className="bg-primary text-black hover:bg-primary/90 font-semibold"
          >
            Generate New Data
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="w-full rounded-lg overflow-hidden bg-black/20 p-4">
          <Plot
            data={data}
            layout={layout}
            config={config}
            className="w-full"
            style={{ width: "100%" }}
            useResizeHandler={true}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
            <p className="text-sm text-muted-foreground mb-1">Total Wallets</p>
            <p className="text-2xl font-bold text-primary">{flowData.labels.length}</p>
          </div>
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
            <p className="text-sm text-muted-foreground mb-1">Total Flows</p>
            <p className="text-2xl font-bold text-primary">{flowData.values.length}</p>
          </div>
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
            <p className="text-sm text-muted-foreground mb-1">Total Volume</p>
            <p className="text-2xl font-bold text-primary">{flowData.values.reduce((a, b) => a + b, 0).toFixed(2)} BTC</p>
          </div>
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-red-500" />
              Suspicious
            </p>
            <p className="text-2xl font-bold text-red-500">{suspiciousCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
