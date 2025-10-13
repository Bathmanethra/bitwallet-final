export interface Wallet {
  id: string;
  totalReceived: number;
  totalSent: number;
  netBalance: number;
  transactionCount: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface Transaction {
  fromAddr: string;
  toAddr: string;
  amount: number;
  timestamp?: number;
}
