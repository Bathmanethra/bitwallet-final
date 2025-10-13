import { Wallet, Transaction } from "@/types/wallet";

export const generateSampleWalletData = () => {
  const walletCount = 30;
  const transactionCount = 80;
  
  const wallets: Wallet[] = Array.from({ length: walletCount }, (_, i) => {
    const id = `Wallet_${i + 1}`;
    const totalReceived = Math.random() * 10 + 0.5;
    const totalSent = Math.random() * 10 + 0.5;
    const netBalance = totalReceived - totalSent;
    const transactionCount = Math.floor(Math.random() * 15) + 3;
    
    return {
      id,
      totalReceived,
      totalSent,
      netBalance,
      transactionCount,
    };
  });

  const transactions: Transaction[] = [];
  for (let i = 0; i < transactionCount; i++) {
    const fromWallet = wallets[Math.floor(Math.random() * wallets.length)];
    let toWallet = wallets[Math.floor(Math.random() * wallets.length)];
    
    while (toWallet.id === fromWallet.id) {
      toWallet = wallets[Math.floor(Math.random() * wallets.length)];
    }
    
    transactions.push({
      fromAddr: fromWallet.id,
      toAddr: toWallet.id,
      amount: Math.random() * 2 + 0.1,
      timestamp: Date.now() - Math.random() * 86400000 * 30
    });
  }

  return { wallets, transactions };
};
