import { Transaction } from "@/types/wallet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface WalletDetailsTableProps {
  walletId: string;
  transactions: Transaction[];
}

export const WalletDetailsTable = ({ walletId, transactions }: WalletDetailsTableProps) => {
  const walletTransactions = transactions.filter(
    (tx) => tx.fromAddr === walletId || tx.toAddr === walletId
  );

  if (walletTransactions.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">No Transactions</CardTitle>
          <CardDescription className="text-muted-foreground">
            This wallet has no transaction history
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Transactions for {walletId}</CardTitle>
        <CardDescription className="text-muted-foreground">
          Showing {walletTransactions.length} of {walletTransactions.length} transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/30">
                <TableHead className="text-muted-foreground">Transaction ID</TableHead>
                <TableHead className="text-muted-foreground">From</TableHead>
                <TableHead className="text-muted-foreground w-12"></TableHead>
                <TableHead className="text-muted-foreground">To</TableHead>
                <TableHead className="text-muted-foreground text-right">Amount (BTC)</TableHead>
                <TableHead className="text-muted-foreground">Timestamp</TableHead>
                <TableHead className="text-muted-foreground text-center">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {walletTransactions.map((tx) => {
                const isOutgoing = tx.fromAddr === walletId;
                const fromShort = tx.fromAddr.split('_')[1];
                const toShort = tx.toAddr.split('_')[1];
                
                return (
                  <TableRow key={tx.id} className="hover:bg-secondary/20">
                    <TableCell className="font-mono text-sm text-foreground">{tx.id}</TableCell>
                    <TableCell className="font-mono text-sm">
                      <span className={tx.fromAddr === walletId ? "text-primary font-bold" : "text-foreground"}>
                        {fromShort}
                      </span>
                    </TableCell>
                    <TableCell>
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      <span className={tx.toAddr === walletId ? "text-primary font-bold" : "text-foreground"}>
                        {toShort}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono text-foreground">
                      {tx.amount.toFixed(6)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(tx.timestamp)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={isOutgoing ? "destructive" : "default"}
                        className={isOutgoing ? "bg-destructive text-destructive-foreground" : "bg-green-600 text-white"}
                      >
                        {isOutgoing ? "Outgoing" : "Incoming"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
