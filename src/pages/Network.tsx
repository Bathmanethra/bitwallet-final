import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { NetworkGraph } from "@/components/NetworkGraph";
import { WalletDetailsTable } from "@/components/WalletDetailsTable";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { generateSampleWalletData } from "@/utils/generateSampleData";

const Network = () => {
  const [data] = useState(() => generateSampleWalletData());
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [animationEnabled, setAnimationEnabled] = useState(true);

  const handleWalletClick = (walletId: string) => {
    setSelectedWallet(selectedWallet === walletId ? null : walletId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent mb-2">
              Wallet Network Diagram
            </h1>
            <p className="text-muted-foreground text-lg">
              Interactive network visualization of wallet transactions
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="animation"
                checked={animationEnabled}
                onCheckedChange={setAnimationEnabled}
              />
              <Label htmlFor="animation" className="text-foreground">
                Enable Animations
              </Label>
            </div>
            {selectedWallet && (
              <Button
                variant="outline"
                onClick={() => setSelectedWallet(null)}
              >
                Clear Selection
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 h-[600px]">
            <NetworkGraph
              wallets={data.wallets}
              transactions={data.transactions}
              selectedWallet={selectedWallet}
              onWalletClick={handleWalletClick}
              animationEnabled={animationEnabled}
            />
          </div>
          <div className="xl:col-span-1">
            <WalletDetailsTable
              selectedWallet={selectedWallet}
              wallets={data.wallets}
              transactions={data.transactions}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-lg bg-card border border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Wallets</h3>
            <p className="text-3xl font-bold text-foreground">{data.wallets.length}</p>
          </div>
          <div className="p-6 rounded-lg bg-card border border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Transactions</h3>
            <p className="text-3xl font-bold text-foreground">{data.transactions.length}</p>
          </div>
          <div className="p-6 rounded-lg bg-card border border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Volume</h3>
            <p className="text-3xl font-bold text-foreground">
              {data.transactions.reduce((sum, tx) => sum + tx.amount, 0).toFixed(2)} BTC
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">How to Use</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Click on any wallet node to view detailed transaction information and connected wallets</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Drag nodes to rearrange the network visualization</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Use mouse wheel to zoom in/out of the network</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Hover over nodes to see wallet summary information</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>When a wallet is selected, animated dots show transaction flows</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Network;
