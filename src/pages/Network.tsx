import { useState, useMemo } from "react";
import { Navigation } from "@/components/Navigation";
import { NetworkGraph } from "@/components/NetworkGraph";
import { WalletDetailsTable } from "@/components/WalletDetailsTable";
import { SuspiciousWalletsPanel } from "@/components/SuspiciousWalletsPanel";
import { TemporalAnalysisChart } from "@/components/TemporalAnalysisChart";
import { StatsCards } from "@/components/StatsCards";
import { EvaluationMetrics } from "@/components/EvaluationMetrics";
import { generateWalletData } from "@/utils/generateWalletData";
import { analyzeSuspiciousWallets, getAnalyticsMetrics, calculateEvaluationMetrics } from "@/utils/suspiciousAnalytics";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Pause, Play, RotateCcw, Wallet as WalletIcon, Activity, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Network = () => {
  const [walletCount, setWalletCount] = useState(50);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [suspicionThreshold, setSuspicionThreshold] = useState(0.5);

  const { wallets: allWallets, transactions: allTransactions } = useMemo(
    () => generateWalletData(200),
    [resetTrigger]
  );

  const { wallets, transactions } = useMemo(() => {
    const filteredWallets = allWallets.slice(0, walletCount);
    const walletIds = new Set(filteredWallets.map(w => w.id));
    const filteredTransactions = allTransactions.filter(
      tx => walletIds.has(tx.fromAddr) && walletIds.has(tx.toAddr)
    );
    return { wallets: filteredWallets, transactions: filteredTransactions };
  }, [allWallets, allTransactions, walletCount]);

  const selectedWalletData = useMemo(() => {
    if (!selectedWallet) return null;
    return wallets.find(w => w.id === selectedWallet);
  }, [selectedWallet, wallets]);

  const totalVolume = useMemo(() => {
    return transactions.reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions]);

  // Suspicious wallet analysis
  const suspiciousWallets = useMemo(() => {
    return analyzeSuspiciousWallets(wallets, transactions, suspicionThreshold);
  }, [wallets, transactions, suspicionThreshold]);

  const suspiciousWalletIds = useMemo(() => {
    return new Set(suspiciousWallets.map(sw => sw.wallet.id));
  }, [suspiciousWallets]);

  const analyticsMetrics = useMemo(() => {
    return getAnalyticsMetrics(suspiciousWallets, wallets.length);
  }, [suspiciousWallets, wallets.length]);

  // Generate known suspicious wallets for evaluation (mock data)
  const knownSuspicious = useMemo(() => {
    // Simulate known suspicious wallets (in production, this would come from verified data)
    const known = new Set<string>();
    suspiciousWallets.slice(0, Math.floor(suspiciousWallets.length * 0.8)).forEach(sw => {
      known.add(sw.wallet.id);
    });
    // Add some that weren't detected to simulate false negatives
    const randomWallets = wallets.filter(w => !suspiciousWalletIds.has(w.id));
    if (randomWallets.length > 0) {
      known.add(randomWallets[0].id);
      if (randomWallets.length > 1) known.add(randomWallets[1].id);
    }
    return known;
  }, [suspiciousWallets, suspiciousWalletIds, wallets]);

  const evaluationMetrics = useMemo(() => {
    return calculateEvaluationMetrics(suspiciousWallets, knownSuspicious);
  }, [suspiciousWallets, knownSuspicious]);

  const handleReset = () => {
    setSelectedWallet(null);
    setResetTrigger(prev => prev + 1);
  };

  const handleRefreshAnalytics = () => {
    setResetTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Bitcoin <span className="text-primary">Wallet Oracle</span>
          </h1>
          <p className="text-muted-foreground">Advanced Network Visualization & Suspicious Activity Analytics</p>
        </div>

        {/* Stats Cards */}
        <StatsCards metrics={analyticsMetrics} totalTransactions={transactions.length} />

        {/* Controls */}
        <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-lg bg-card border border-border">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-foreground">Display Wallets:</label>
            <Select value={walletCount.toString()} onValueChange={(v) => setWalletCount(Number(v))}>
              <SelectTrigger className="w-32 bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="200">200</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="default"
              onClick={() => setAnimationEnabled(!animationEnabled)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {animationEnabled ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause Animation
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Animation
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleReset}
              className="border-border text-foreground hover:bg-secondary"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset View
            </Button>
          </div>

          {selectedWallet && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary">
              <span className="text-sm text-muted-foreground">Selected:</span>
              <span className="font-mono font-bold text-primary">{selectedWallet}</span>
            </div>
          )}
        </div>

        {/* Selected Wallet Summary */}
        {selectedWalletData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Activity className="w-4 h-4 text-green-500" />
                    Received
                  </p>
                </div>
                <p className="text-2xl font-bold text-green-500">{selectedWalletData.totalReceived.toFixed(6)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {transactions.filter(tx => tx.toAddr === selectedWallet).length} transactions
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Activity className="w-4 h-4 text-destructive" />
                    Sent
                  </p>
                </div>
                <p className="text-2xl font-bold text-destructive">{selectedWalletData.totalSent.toFixed(6)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {transactions.filter(tx => tx.fromAddr === selectedWallet).length} transactions
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    Net Balance
                  </p>
                </div>
                <p className={`text-2xl font-bold ${selectedWalletData.netBalance > 0 ? 'text-green-500' : 'text-destructive'}`}>
                  {selectedWalletData.netBalance > 0 ? '+' : ''}{selectedWalletData.netBalance.toFixed(6)}
                </p>
                <Badge className={selectedWalletData.netBalance > 0 ? "bg-green-600 text-white" : "bg-destructive text-destructive-foreground"}>
                  {selectedWalletData.netBalance > 0 ? 'Positive' : 'Negative'}
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    Total Txs
                  </p>
                </div>
                <p className="text-2xl font-bold text-foreground">{selectedWalletData.transactionCount}</p>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Network Graph & Details */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="network" className="w-full">
              <TabsList className="bg-muted">
                <TabsTrigger value="network" className="data-[state=active]:bg-background">
                  <Activity className="w-4 h-4 mr-2" />
                  Network Graph
                </TabsTrigger>
                <TabsTrigger value="temporal" className="data-[state=active]:bg-background">
                  <Shield className="w-4 h-4 mr-2" />
                  Temporal Analysis
                </TabsTrigger>
              </TabsList>

              <TabsContent value="network" className="space-y-6 mt-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Interactive Network Graph</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Click on wallets to highlight connections • Drag to reposition • Scroll to zoom • 🔴 Red nodes are suspicious
                  </p>
                  <div className="h-[600px]">
                    <NetworkGraph
                      wallets={wallets}
                      transactions={transactions}
                      selectedWallet={selectedWallet}
                      onWalletClick={setSelectedWallet}
                      animationEnabled={animationEnabled}
                      suspiciousWallets={suspiciousWalletIds}
                    />
                  </div>
                </div>

                {selectedWallet && (
                  <WalletDetailsTable
                    walletId={selectedWallet}
                    transactions={transactions}
                  />
                )}
              </TabsContent>

              <TabsContent value="temporal" className="mt-6">
                <TemporalAnalysisChart 
                  wallet={selectedWalletData} 
                  transactions={transactions}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: Suspicious Wallets Panel */}
          <div className="lg:col-span-1 space-y-6">
            <SuspiciousWalletsPanel
              suspiciousWallets={suspiciousWallets}
              threshold={suspicionThreshold}
              onThresholdChange={setSuspicionThreshold}
              selectedWallet={selectedWallet}
              onSelectWallet={setSelectedWallet}
              onClearSelection={() => setSelectedWallet(null)}
              onRefresh={handleRefreshAnalytics}
            />

            {/* Evaluation Metrics */}
            <EvaluationMetrics
              {...evaluationMetrics}
              title="Detection Accuracy"
              description="Suspicious wallet identification performance"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Network;
