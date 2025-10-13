import { Wallet, Transaction } from "@/types/wallet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface WalletDetailsTableProps {
  selectedWallet: string | null;
  wallets: Wallet[];
  transactions: Transaction[];
}

export const WalletDetailsTable = ({ selectedWallet, wallets, transactions }: WalletDetailsTableProps) => {
  if (!selectedWallet) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Wallet Details</CardTitle>
          <CardDescription className="text-muted-foreground">
            Click on a wallet node to view details
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const wallet = wallets.find(w => w.id === selectedWallet);
  const connectedTransactions = transactions.filter(
    t => t.fromAddr === selectedWallet || t.toAddr === selectedWallet
  );

  const connectedWallets = new Set<string>();
  connectedTransactions.forEach(tx => {
    if (tx.fromAddr === selectedWallet) connectedWallets.add(tx.toAddr);
    if (tx.toAddr === selectedWallet) connectedWallets.add(tx.fromAddr);
  });

  const connectedWalletDetails = Array.from(connectedWallets).map(walletId => {
    const w = wallets.find(wallet => wallet.id === walletId);
    const outgoing = connectedTransactions
      .filter(tx => tx.fromAddr === selectedWallet && tx.toAddr === walletId)
      .reduce((sum, tx) => sum + tx.amount, 0);
    const incoming = connectedTransactions
      .filter(tx => tx.toAddr === selectedWallet && tx.fromAddr === walletId)
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    return {
      id: walletId,
      wallet: w,
      outgoing,
      incoming,
      net: incoming - outgoing
    };
  });

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">{selectedWallet}</CardTitle>
          <CardDescription className="text-muted-foreground">Wallet Summary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-secondary/30 border border-border">
              <p className="text-sm text-muted-foreground">Total Received</p>
              <p className="text-xl font-bold text-green-500">{wallet?.totalReceived.toFixed(6)} BTC</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/30 border border-border">
              <p className="text-sm text-muted-foreground">Total Sent</p>
              <p className="text-xl font-bold text-red-500">{wallet?.totalSent.toFixed(6)} BTC</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/30 border border-border">
              <p className="text-sm text-muted-foreground">Net Balance</p>
              <p className={`text-xl font-bold ${(wallet?.netBalance ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {wallet?.netBalance.toFixed(6)} BTC
              </p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/30 border border-border">
              <p className="text-sm text-muted-foreground">Transactions</p>
              <p className="text-xl font-bold text-foreground">{wallet?.transactionCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Connected Wallets</CardTitle>
          <CardDescription className="text-muted-foreground">
            {connectedWallets.size} wallet(s) connected
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-foreground">Wallet ID</TableHead>
                  <TableHead className="text-right text-foreground">Received</TableHead>
                  <TableHead className="text-right text-foreground">Sent</TableHead>
                  <TableHead className="text-right text-foreground">Net Flow</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {connectedWalletDetails.map((detail) => (
                  <TableRow key={detail.id}>
                    <TableCell className="font-medium text-foreground">{detail.id}</TableCell>
                    <TableCell className="text-right text-green-500">
                      {detail.incoming.toFixed(6)} BTC
                    </TableCell>
                    <TableCell className="text-right text-red-500">
                      {detail.outgoing.toFixed(6)} BTC
                    </TableCell>
                    <TableCell className={`text-right font-medium ${detail.net >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {detail.net >= 0 ? '+' : ''}{detail.net.toFixed(6)} BTC
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
