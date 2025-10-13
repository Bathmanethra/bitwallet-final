import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";

interface PriceData {
  usd: number;
  inr: number;
  change24h: number;
  prediction: number;
}

export const BitcoinPriceCard = () => {
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBitcoinPrice = async () => {
      try {
        // Fetch current Bitcoin price in USD and INR
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,inr&include_24hr_change=true"
        );
        const data = await response.json();
        
        const currentUSD = data.bitcoin.usd;
        const currentINR = data.bitcoin.inr;
        const change24h = data.bitcoin.usd_24h_change;
        
        // Simple linear prediction (30 days ahead based on recent trend)
        const predictionUSD = currentUSD * (1 + (change24h / 100) * 30);
        const predictionINR = currentINR * (1 + (change24h / 100) * 30);
        
        setPriceData({
          usd: currentUSD,
          inr: currentINR,
          change24h: change24h,
          prediction: predictionINR,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Bitcoin price:", error);
        setLoading(false);
      }
    };

    fetchBitcoinPrice();
    const interval = setInterval(fetchBitcoinPrice, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-card to-secondary border-primary/20">
        <CardContent className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!priceData) return null;

  const isPositive = priceData.change24h >= 0;

  return (
    <Card className="bg-gradient-to-br from-card to-secondary border-primary/20 shadow-lg hover:shadow-[var(--glow-orange)] transition-shadow">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <span className="text-primary">₿</span> Bitcoin Price (Live)
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Real-time price with 30-day prediction
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Price USD */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Current (USD)</p>
            <p className="text-3xl font-bold text-foreground">
              ${priceData.usd.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* Current Price INR */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Current (INR)</p>
            <p className="text-3xl font-bold text-primary">
              ₹{priceData.inr.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* 24h Change */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border">
          {isPositive ? (
            <TrendingUp className="w-5 h-5 text-green-500" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-500" />
          )}
          <span className={`text-lg font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{priceData.change24h.toFixed(2)}%
          </span>
          <span className="text-sm text-muted-foreground">24h change</span>
        </div>

        {/* Prediction */}
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
          <p className="text-sm text-muted-foreground mb-2">30-Day Prediction (INR)</p>
          <p className="text-4xl font-bold text-primary">
            ₹{priceData.prediction.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Based on current market trends
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
