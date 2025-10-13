import { Navigation } from "@/components/Navigation";
import { BitcoinPriceCard } from "@/components/BitcoinPriceCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart3, Network, TrendingUp, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-6 py-12">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-orange-500 to-primary bg-clip-text text-transparent animate-pulse">
            CryptoFlow Analytics
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Advanced Bitcoin Transaction Analysis & Price Prediction Platform
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link to="/log-scale">
              <Button size="lg" className="bg-primary text-black hover:bg-primary/90 font-semibold shadow-lg">
                Explore Analytics <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Bitcoin Price Card */}
        <section>
          <BitcoinPriceCard />
        </section>

        {/* Features Grid */}
        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Powerful Analytics Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Link to="/log-scale">
              <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all cursor-pointer group hover:shadow-lg">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Log Scale Analysis</h3>
                <p className="text-muted-foreground">
                  Interactive logarithmic charts for wallet transaction patterns and volume analysis
                </p>
              </div>
            </Link>

            {/* Feature 2 */}
            <Link to="/prediction">
              <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all cursor-pointer group hover:shadow-lg">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Price Prediction</h3>
                <p className="text-muted-foreground">
                  Advanced machine learning models for Bitcoin price forecasting and trend analysis
                </p>
              </div>
            </Link>

            {/* Feature 3 */}
            <Link to="/flows">
              <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all cursor-pointer group hover:shadow-lg">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                  <Network className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Flow Network</h3>
                <p className="text-muted-foreground">
                  Sankey diagrams visualizing wallet-to-wallet transaction flows and connections
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <p className="text-primary text-4xl font-bold mb-2">1000+</p>
            <p className="text-muted-foreground">Wallet Addresses</p>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <p className="text-primary text-4xl font-bold mb-2">50K+</p>
            <p className="text-muted-foreground">Transactions</p>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <p className="text-primary text-4xl font-bold mb-2">Real-time</p>
            <p className="text-muted-foreground">Data Updates</p>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <p className="text-primary text-4xl font-bold mb-2">3</p>
            <p className="text-muted-foreground">Analytics Tools</p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 CryptoFlow Analytics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
