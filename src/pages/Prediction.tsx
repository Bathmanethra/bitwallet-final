import { Navigation } from "@/components/Navigation";
import { PredictionChart } from "@/components/PredictionChart";

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
        
        <PredictionChart />
      </main>
    </div>
  );
};

export default Prediction;
