import { Wallet, Transaction } from "@/types/wallet";

export interface SuspiciousWallet {
  wallet: Wallet;
  suspicionScore: number;
  reasons: string[];
  temporalBurst: number;
  largeTransactionSpikes: number;
  unusualBalance: boolean;
  highCounterpartyOverlap: number;
}

export interface AnalyticsMetrics {
  totalWallets: number;
  suspiciousWallets: number;
  averageSuspicionScore: number;
  topSuspicious: SuspiciousWallet[];
}

/**
 * Analyze wallets for suspicious behavior patterns
 */
export const analyzeSuspiciousWallets = (
  wallets: Wallet[],
  transactions: Transaction[],
  threshold: number = 0.5
): SuspiciousWallet[] => {
  const suspiciousWallets: SuspiciousWallet[] = [];

  // Calculate stats for normalization
  const avgTxCount = wallets.reduce((sum, w) => sum + w.transactionCount, 0) / wallets.length;
  const avgBalance = wallets.reduce((sum, w) => sum + Math.abs(w.netBalance), 0) / wallets.length;

  wallets.forEach((wallet) => {
    const reasons: string[] = [];
    let score = 0;

    // 1. Temporal burst analysis (transactions clustered in time)
    const walletTxs = transactions.filter(
      (tx) => tx.fromAddr === wallet.id || tx.toAddr === wallet.id
    );
    
    const temporalBurst = calculateTemporalBurst(walletTxs);
    if (temporalBurst > 0.7) {
      score += 0.3;
      reasons.push(`High temporal burst (${(temporalBurst * 100).toFixed(0)}%)`);
    }

    // 2. Large transaction spikes
    const avgTxAmount =
      walletTxs.reduce((sum, tx) => sum + tx.amount, 0) / (walletTxs.length || 1);
    const largeSpikes = walletTxs.filter((tx) => tx.amount > avgTxAmount * 5).length;
    
    if (largeSpikes > 3) {
      score += 0.25;
      reasons.push(`${largeSpikes} large transaction spikes detected`);
    }

    // 3. Unusual balance (very high or very negative)
    const balanceRatio = Math.abs(wallet.netBalance) / (avgBalance || 1);
    const unusualBalance = balanceRatio > 3;
    
    if (unusualBalance) {
      score += 0.2;
      reasons.push(`Unusual balance ratio (${balanceRatio.toFixed(1)}x average)`);
    }

    // 4. High counterparty overlap (trades with many same wallets)
    const counterparties = new Set(
      walletTxs.map((tx) => (tx.fromAddr === wallet.id ? tx.toAddr : tx.fromAddr))
    );
    const counterpartyRatio = counterparties.size / (wallets.length || 1);
    
    if (counterpartyRatio > 0.3) {
      score += 0.25;
      reasons.push(
        `High counterparty overlap (${counterparties.size} unique wallets)`
      );
    }

    // 5. Transaction count anomaly
    const txCountRatio = wallet.transactionCount / (avgTxCount || 1);
    if (txCountRatio > 2.5) {
      score += 0.15;
      reasons.push(`Very high transaction count (${wallet.transactionCount})`);
    }

    // Normalize score to 0-1
    score = Math.min(score, 1);

    if (score >= threshold) {
      suspiciousWallets.push({
        wallet,
        suspicionScore: score,
        reasons,
        temporalBurst,
        largeTransactionSpikes: largeSpikes,
        unusualBalance,
        highCounterpartyOverlap: counterparties.size,
      });
    }
  });

  return suspiciousWallets.sort((a, b) => b.suspicionScore - a.suspicionScore);
};

/**
 * Calculate temporal burst (how clustered transactions are in time)
 */
const calculateTemporalBurst = (transactions: Transaction[]): number => {
  if (transactions.length < 2) return 0;

  const timestamps = transactions
    .map((tx) => new Date(tx.timestamp).getTime())
    .sort((a, b) => a - b);

  // Calculate time gaps between consecutive transactions
  const gaps: number[] = [];
  for (let i = 1; i < timestamps.length; i++) {
    gaps.push(timestamps[i] - timestamps[i - 1]);
  }

  const avgGap = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
  const smallGaps = gaps.filter((gap) => gap < avgGap * 0.2).length;

  return smallGaps / gaps.length;
};

/**
 * Get analytics metrics summary
 */
export const getAnalyticsMetrics = (
  suspiciousWallets: SuspiciousWallet[],
  totalWallets: number
): AnalyticsMetrics => {
  const avgScore =
    suspiciousWallets.reduce((sum, sw) => sum + sw.suspicionScore, 0) /
    (suspiciousWallets.length || 1);

  return {
    totalWallets,
    suspiciousWallets: suspiciousWallets.length,
    averageSuspicionScore: avgScore,
    topSuspicious: suspiciousWallets.slice(0, 5),
  };
};

/**
 * Get temporal activity data for a wallet
 */
export const getTemporalActivity = (
  wallet: Wallet,
  transactions: Transaction[],
  intervalHours: number = 24
): Array<{ timestamp: number; count: number; volume: number }> => {
  const walletTxs = transactions.filter(
    (tx) => tx.fromAddr === wallet.id || tx.toAddr === wallet.id
  );

  // Group by time intervals
  const intervals = new Map<number, { count: number; volume: number }>();

  walletTxs.forEach((tx) => {
    const time = new Date(tx.timestamp).getTime();
    const intervalKey = Math.floor(time / (intervalHours * 60 * 60 * 1000));

    const existing = intervals.get(intervalKey) || { count: 0, volume: 0 };
    intervals.set(intervalKey, {
      count: existing.count + 1,
      volume: existing.volume + tx.amount,
    });
  });

  return Array.from(intervals.entries())
    .map(([key, data]) => ({
      timestamp: key * intervalHours * 60 * 60 * 1000,
      count: data.count,
      volume: data.volume,
    }))
    .sort((a, b) => a.timestamp - b.timestamp);
};

/**
 * Calculate evaluation metrics (if ground truth is available)
 */
export const calculateEvaluationMetrics = (
  suspiciousWallets: SuspiciousWallet[],
  knownSuspicious: Set<string>
): {
  truePositives: number;
  falsePositives: number;
  falseNegatives: number;
  precision: number;
  recall: number;
  f1Score: number;
} => {
  const predicted = new Set(suspiciousWallets.map((sw) => sw.wallet.id));

  let truePositives = 0;
  let falsePositives = 0;
  let falseNegatives = 0;

  // Count TP and FP
  predicted.forEach((id) => {
    if (knownSuspicious.has(id)) {
      truePositives++;
    } else {
      falsePositives++;
    }
  });

  // Count FN
  knownSuspicious.forEach((id) => {
    if (!predicted.has(id)) {
      falseNegatives++;
    }
  });

  const precision = truePositives / (truePositives + falsePositives || 1);
  const recall = truePositives / (truePositives + falseNegatives || 1);
  const f1Score = (2 * precision * recall) / (precision + recall || 1);

  return {
    truePositives,
    falsePositives,
    falseNegatives,
    precision,
    recall,
    f1Score,
  };
};
