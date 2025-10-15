import { Navigation } from "@/components/Navigation";
import { SankeyFlowChart } from "@/components/SankeyFlowChart";
import { EvaluationMetrics } from "@/components/EvaluationMetrics";
import { Card, CardContent } from "@/components/ui/card";
import { GitBranch, AlertTriangle, Shield } from "lucide-react";
import { useMemo } from "react";

const Flows = () => {
  // Mock evaluation metrics for flow analysis
  const flowEvaluationMetrics = useMemo(() => {
    // Simulated metrics for suspicious flow detection
    const truePositives = 12; // Correctly identified suspicious flows
    const falsePositives = 3; // Normal flows marked as suspicious
    const falseNegatives = 2; // Missed suspicious flows
    
    const precision = truePositives / (truePositives + falsePositives);
    const recall = truePositives / (truePositives + falseNegatives);
    const f1Score = 2 * (precision * recall) / (precision + recall);
    
    return {
      truePositives,
      falsePositives,
      falseNegatives,
      precision,
      recall,
      f1Score
    };
  }, []);

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

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-card border-primary/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/20">
                  <GitBranch className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Flow Visualization</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Sankey diagram reveals transaction patterns and fund movements
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-card border-orange-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-orange-500/20">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="font-semibold text-foreground">Suspicious Flows</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Highlighted flows involving wallets with anomalous behavior
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500/10 to-card border-red-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <Shield className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="font-semibold text-foreground">Flow Detection</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Advanced analytics to identify risky transaction patterns
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SankeyFlowChart />
          </div>
          <div>
            <EvaluationMetrics
              {...flowEvaluationMetrics}
              title="Flow Detection Accuracy"
              description="Performance of suspicious flow identification"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Flows;
