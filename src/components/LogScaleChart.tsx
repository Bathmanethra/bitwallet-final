import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Plot from "react-plotly.js";

// Generate sample wallet data
const generateWalletData = () => {
  const wallets = Array.from({ length: 20 }, (_, i) => `Wallet_${i + 1}`);
  const timeFrames = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
  
  const data = wallets.map(wallet => {
    const days = 365;
    const dates = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      return date.toISOString().split('T')[0];
    });
    
    let balance = Math.random() * 100 + 10;
    const received = dates.map(() => Math.random() * 5);
    const sent = dates.map(() => Math.random() * 4);
    const balances = dates.map((_, i) => {
      balance += received[i] - sent[i];
      return Math.max(balance, 0.01);
    });
    
    return {
      wallet,
      dates,
      received,
      sent,
      balances,
    };
  });
  
  return { wallets, data };
};

export const LogScaleChart = () => {
  const [selectedWallet, setSelectedWallet] = useState<string>("Wallet_1");
  const [timeFrame, setTimeFrame] = useState<string>("Daily");
  const { wallets, data } = useMemo(() => generateWalletData(), []);
  
  const walletData = data.find(d => d.wallet === selectedWallet);
  
  if (!walletData) return null;
  
  // Aggregate data based on timeframe
  const aggregateData = (dates: string[], values: number[], frame: string) => {
    if (frame === "Daily") return { dates, values };
    
    const aggregated: { [key: string]: number[] } = {};
    dates.forEach((date, i) => {
      let key = date;
      if (frame === "Weekly") {
        const d = new Date(date);
        key = `${d.getFullYear()}-W${Math.ceil((d.getDate() / 7))}`;
      } else if (frame === "Monthly") {
        key = date.substring(0, 7);
      } else if (frame === "Yearly") {
        key = date.substring(0, 4);
      }
      
      if (!aggregated[key]) aggregated[key] = [];
      aggregated[key].push(values[i]);
    });
    
    const aggDates = Object.keys(aggregated).sort();
    const aggValues = aggDates.map(key => 
      aggregated[key].reduce((a, b) => a + b, 0) / aggregated[key].length
    );
    
    return { dates: aggDates, values: aggValues };
  };
  
  const { dates: aggDates, values: aggReceived } = aggregateData(walletData.dates, walletData.received, timeFrame);
  const { values: aggSent } = aggregateData(walletData.dates, walletData.sent, timeFrame);
  const { values: aggBalances } = aggregateData(walletData.dates, walletData.balances, timeFrame);
  
  // Calculate log values
  const logReceived = aggReceived.map(v => Math.log10(v + 1));
  const logSent = aggSent.map(v => Math.log10(v + 1));
  const logBalances = aggBalances.map(v => Math.log10(v + 1));
  
  const traces = [
    {
      x: aggDates,
      y: logReceived,
      name: 'Received (log)',
      type: 'scatter' as const,
      mode: 'lines+markers' as const,
      line: { color: 'rgb(255, 149, 0)', width: 2 },
      marker: { size: 4 }
    },
    {
      x: aggDates,
      y: logSent,
      name: 'Sent (log)',
      type: 'scatter' as const,
      mode: 'lines+markers' as const,
      line: { color: 'rgb(255, 69, 0)', width: 2 },
      marker: { size: 4 }
    },
    {
      x: aggDates,
      y: logBalances,
      name: 'Balance (log)',
      type: 'scatter' as const,
      mode: 'lines+markers' as const,
      line: { color: 'rgb(255, 215, 0)', width: 3 },
      marker: { size: 5 }
    }
  ];
  
  const layout = {
    title: {
      text: `Log Scale Analysis - ${selectedWallet}`,
      font: { color: 'hsl(30, 100%, 98%)', size: 18 }
    },
    xaxis: {
      title: 'Date',
      color: 'hsl(30, 100%, 98%)',
      gridcolor: 'rgba(255, 255, 255, 0.1)'
    },
    yaxis: {
      title: 'Log10(Amount + 1)',
      color: 'hsl(30, 100%, 98%)',
      gridcolor: 'rgba(255, 255, 255, 0.1)'
    },
    plot_bgcolor: 'rgba(0, 0, 0, 0.3)',
    paper_bgcolor: 'transparent',
    height: 500,
    margin: { t: 50, l: 60, r: 30, b: 60 },
    hovermode: 'x unified' as const,
    legend: {
      font: { color: 'hsl(30, 100%, 98%)' },
      bgcolor: 'rgba(0, 0, 0, 0.5)'
    }
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
        <CardTitle className="text-2xl font-bold text-foreground">Interactive Log Scale Chart</CardTitle>
        <CardDescription className="text-muted-foreground">
          Logarithmic visualization of wallet transactions over time
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Select Wallet</label>
            <Select value={selectedWallet} onValueChange={setSelectedWallet}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {wallets.map(wallet => (
                  <SelectItem key={wallet} value={wallet}>{wallet}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Time Frame</label>
            <Select value={timeFrame} onValueChange={setTimeFrame}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {['Daily', 'Weekly', 'Monthly', 'Yearly'].map(frame => (
                  <SelectItem key={frame} value={frame}>{frame}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Chart */}
        <div className="w-full rounded-lg overflow-hidden bg-black/20 p-4">
          <Plot
            data={traces}
            layout={layout}
            config={config}
            className="w-full"
            style={{ width: '100%' }}
            useResizeHandler={true}
          />
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
            <p className="text-sm text-muted-foreground mb-1">Total Received</p>
            <p className="text-2xl font-bold text-primary">
              {aggReceived.reduce((a, b) => a + b, 0).toFixed(3)} BTC
            </p>
          </div>
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
            <p className="text-sm text-muted-foreground mb-1">Total Sent</p>
            <p className="text-2xl font-bold text-primary">
              {aggSent.reduce((a, b) => a + b, 0).toFixed(3)} BTC
            </p>
          </div>
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
            <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
            <p className="text-2xl font-bold text-primary">
              {aggBalances[aggBalances.length - 1].toFixed(3)} BTC
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
