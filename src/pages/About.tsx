import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Network, TrendingUp, Shield, Zap, Globe } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4 py-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-orange-500 to-primary bg-clip-text text-transparent">
            About CryptoFlow
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Advanced blockchain analytics and visualization platform for cryptocurrency transaction analysis
          </p>
        </section>

        {/* Mission Statement */}
        <Card className="bg-gradient-to-br from-card to-secondary border-primary/20">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              CryptoFlow is dedicated to providing cutting-edge tools for cryptocurrency analysis. 
              We combine advanced data visualization techniques with machine learning algorithms to 
              help users understand blockchain transactions, predict market trends, and identify 
              patterns in wallet behavior. Our platform empowers analysts, traders, and researchers 
              with the insights they need to make informed decisions in the cryptocurrency space.
            </p>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-card border-border hover:border-primary/50 transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="w-14 h-14 rounded-lg bg-primary/20 flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Log Scale Analytics</h3>
                <p className="text-muted-foreground">
                  Visualize wallet transactions with logarithmic scaling for better pattern recognition 
                  across different magnitude ranges.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary/50 transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="w-14 h-14 rounded-lg bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Price Prediction</h3>
                <p className="text-muted-foreground">
                  Advanced machine learning models analyze historical data to forecast Bitcoin 
                  price movements with high accuracy.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary/50 transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="w-14 h-14 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Network className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Flow Network</h3>
                <p className="text-muted-foreground">
                  Interactive Sankey diagrams reveal complex transaction flows between wallets 
                  and identify network patterns.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary/50 transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="w-14 h-14 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Secure Analysis</h3>
                <p className="text-muted-foreground">
                  All data processing happens client-side, ensuring your analysis remains 
                  private and secure.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary/50 transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="w-14 h-14 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Real-time Data</h3>
                <p className="text-muted-foreground">
                  Live Bitcoin price feeds and market data keep your analysis current and 
                  actionable.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary/50 transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="w-14 h-14 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Multi-Currency</h3>
                <p className="text-muted-foreground">
                  Support for USD, INR, and other currencies makes our platform accessible 
                  to global users.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Technology Stack */}
        <Card className="bg-gradient-to-br from-card to-secondary border-primary/20">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-6 text-foreground">Technology Stack</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-primary">React</div>
                <p className="text-sm text-muted-foreground">Frontend Framework</p>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-primary">Plotly</div>
                <p className="text-sm text-muted-foreground">Data Visualization</p>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-primary">TypeScript</div>
                <p className="text-sm text-muted-foreground">Type Safety</p>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-primary">Tailwind</div>
                <p className="text-sm text-muted-foreground">Styling</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 CryptoFlow Analytics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
