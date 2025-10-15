import { Navigation } from "@/components/Navigation";
import { PredictionChart } from "@/components/PredictionChart";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Target, Activity } from "lucide-react";

const Prediction = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent mb-2">
            Bitcoin Price Prediction
          </h1>
          <p className="text-muted-foreground text-lg">
            Advanced forecasting using linear regression and trend analysis
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-card border-primary/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/20">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Linear Regression</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Statistical model analyzing historical trends to forecast future prices
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-card border-orange-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-orange-500/20">
                  <Target className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="font-semibold text-foreground">Model Evaluation</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Performance metrics including precision, recall, and F1 score
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-card border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Activity className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="font-semibold text-foreground">Real-time Data</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Live Bitcoin price data from CoinGecko API
              </p>
            </CardContent>
          </Card>
        </div>
        
        <PredictionChart />
      </main>
    </div>
  );
};

export default Prediction;
