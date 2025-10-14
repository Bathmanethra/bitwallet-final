import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, TrendingUp, X, RefreshCw } from "lucide-react";
import { SuspiciousWallet } from "@/utils/suspiciousAnalytics";

interface SuspiciousWalletsPanelProps {
  suspiciousWallets: SuspiciousWallet[];
  threshold: number;
  onThresholdChange: (value: number) => void;
  selectedWallet: string | null;
  onSelectWallet: (walletId: string) => void;
  onClearSelection: () => void;
  onRefresh: () => void;
}

export const SuspiciousWalletsPanel = ({
  suspiciousWallets,
  threshold,
  onThresholdChange,
  selectedWallet,
  onSelectWallet,
  onClearSelection,
  onRefresh,
}: SuspiciousWalletsPanelProps) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "text-red-500";
    if (score >= 0.6) return "text-orange-500";
    return "text-yellow-500";
  };

  const getScoreBadgeVariant = (score: number): "destructive" | "default" | "secondary" => {
    if (score >= 0.8) return "destructive";
    if (score >= 0.6) return "default";
    return "secondary";
  };

  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <CardTitle className="text-xl">Suspicious Wallets</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        <CardDescription>
          Detected {suspiciousWallets.length} wallets with unusual behavior patterns
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Threshold Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground">
              Suspicion Threshold
            </label>
            <span className="text-sm font-bold text-primary">
              {(threshold * 100).toFixed(0)}%
            </span>
          </div>
          <Slider
            value={[threshold * 100]}
            onValueChange={(value) => onThresholdChange(value[0] / 100)}
            min={0}
            max={100}
            step={5}
            className="w-full"
          />
        </div>

        {/* Selected Wallet Indicator */}
        {selectedWallet && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary">
            <span className="text-sm font-mono text-primary">{selectedWallet}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Suspicious Wallets List */}
        <ScrollArea className="h-[400px] pr-4">
          {suspiciousWallets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No suspicious wallets detected</p>
              <p className="text-xs mt-1">Try lowering the threshold</p>
            </div>
          ) : (
            <div className="space-y-2">
              {suspiciousWallets.map((sw) => (
                <div
                  key={sw.wallet.id}
                  className={`p-3 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                    selectedWallet === sw.wallet.id
                      ? "bg-primary/20 border-primary shadow-md"
                      : "bg-secondary/30 border-border hover:bg-secondary/50"
                  }`}
                  onClick={() => onSelectWallet(sw.wallet.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-medium text-foreground">
                          {sw.wallet.id}
                        </span>
                        <Badge variant={getScoreBadgeVariant(sw.suspicionScore)}>
                          {(sw.suspicionScore * 100).toFixed(0)}%
                        </Badge>
                      </div>
                      
                      {/* Score Bar */}
                      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden mb-2">
                        <div
                          className={`h-full ${getScoreColor(sw.suspicionScore)} bg-current transition-all`}
                          style={{ width: `${sw.suspicionScore * 100}%` }}
                        />
                      </div>

                      {/* Wallet Stats */}
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        <span>Txs: {sw.wallet.transactionCount}</span>
                        <span className={sw.wallet.netBalance > 0 ? "text-green-500" : "text-red-500"}>
                          Net: {sw.wallet.netBalance.toFixed(2)} BTC
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpanded(expanded === sw.wallet.id ? null : sw.wallet.id);
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <TrendingUp className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Reasons (Expanded) */}
                  {expanded === sw.wallet.id && (
                    <div className="mt-2 pt-2 border-t border-border space-y-1">
                      <p className="text-xs font-medium text-foreground mb-1">Detection Reasons:</p>
                      {sw.reasons.map((reason, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="text-orange-500 mt-0.5">•</span>
                          <span>{reason}</span>
                        </div>
                      ))}
                      
                      {/* Additional Metrics */}
                      <div className="mt-2 pt-2 border-t border-border grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Temporal Burst</p>
                          <p className="font-medium text-foreground">
                            {(sw.temporalBurst * 100).toFixed(0)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Large Spikes</p>
                          <p className="font-medium text-foreground">
                            {sw.largeTransactionSpikes}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Counterparties</p>
                          <p className="font-medium text-foreground">
                            {sw.highCounterpartyOverlap}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Balance Status</p>
                          <p className="font-medium text-foreground">
                            {sw.unusualBalance ? "Unusual" : "Normal"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
