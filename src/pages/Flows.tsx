import { Navigation } from "@/components/Navigation";
import { SankeyFlowChart } from "@/components/SankeyFlowChart";

const Flows = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent mb-2">
            Transaction Flow Network
          </h1>
          <p className="text-muted-foreground text-lg">
            Interactive Sankey diagram showing wallet-to-wallet transaction flows
          </p>
        </div>
        
        <SankeyFlowChart />
      </main>
    </div>
  );
};

export default Flows;
