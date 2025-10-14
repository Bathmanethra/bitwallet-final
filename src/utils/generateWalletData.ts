import { Wallet, Transaction } from "@/types/wallet";

export const generateWalletData = (count: number = 200) => {
  const wallets: Wallet[] = [];
  const transactions: Transaction[] = [];

  // Generate wallets
  for (let i = 0; i < count; i++) {
    wallets.push({
      id: `wallet_${String(i).padStart(4, '0')}`,
      totalReceived: 0,
      totalSent: 0,
      netBalance: 0,
      transactionCount: 0,
    });
  }

  // Generate transactions
  const txCount = count * 3;
  for (let i = 0; i < txCount; i++) {
    const fromIndex = Math.floor(Math.random() * count);
    let toIndex = Math.floor(Math.random() * count);
    
    while (toIndex === fromIndex) {
      toIndex = Math.floor(Math.random() * count);
    }

    const amount = Math.random() * 10 + 0.1;
    const daysAgo = Math.floor(Math.random() * 60);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    transactions.push({
      id: `tx_${String(i).padStart(6, '0')}`,
      fromAddr: wallets[fromIndex].id,
      toAddr: wallets[toIndex].id,
      amount: parseFloat(amount.toFixed(6)),
      timestamp: date.toISOString(),
    });

    // Update wallet balances
    wallets[fromIndex].totalSent += amount;
    wallets[fromIndex].transactionCount++;
    wallets[toIndex].totalReceived += amount;
    wallets[toIndex].transactionCount++;
  }

  // Calculate net balances
  wallets.forEach(wallet => {
    wallet.netBalance = wallet.totalReceived - wallet.totalSent;
  });

  return { wallets, transactions };
};
