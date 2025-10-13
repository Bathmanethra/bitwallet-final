import { Navigation } from "@/components/Navigation";
import { LogScaleChart } from "@/components/LogScaleChart";

const LogScale = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent mb-2">
            Log Scale Wallet Analysis
          </h1>
          <p className="text-muted-foreground text-lg">
            Interactive logarithmic visualization of wallet transactions and balances
          </p>
        </div>
        
        <LogScaleChart />
      </main>
    </div>
  );
};

export default LogScale;
