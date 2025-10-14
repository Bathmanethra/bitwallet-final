import { useEffect, useRef, useState } from "react";
import { Wallet, Transaction } from "@/types/wallet";
import * as d3 from "d3";

interface NetworkGraphProps {
  wallets: Wallet[];
  transactions: Transaction[];
  selectedWallet: string | null;
  onWalletClick: (walletId: string) => void;
  animationEnabled: boolean;
}

export const NetworkGraph = ({
  wallets,
  transactions,
  selectedWallet,
  onWalletClick,
  animationEnabled,
}: NetworkGraphProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 700 });
  const animationRef = useRef<number>();

  useEffect(() => {
    const updateDimensions = () => {
      const container = svgRef.current?.parentElement;
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: Math.max(container.clientHeight, 700),
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current || wallets.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    const g = svg.append("g");

    const links = transactions.map(tx => ({
      source: tx.fromAddr,
      target: tx.toAddr,
      amount: tx.amount,
    }));

    const simulation = d3.forceSimulation(wallets as any)
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30))
      .force("link", d3.forceLink(links)
        .id((d: any) => d.id)
        .distance(150));

    const linkElements = g.append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", (d: any) => {
        if (selectedWallet && (
          (d.source.id || d.source) === selectedWallet || 
          (d.target.id || d.target) === selectedWallet
        )) {
          return "hsl(25, 95%, 53%)";
        }
        return "hsl(25, 95%, 53%, 0.1)";
      })
      .attr("stroke-width", (d: any) => Math.min(d.amount / 2, 3))
      .attr("stroke-opacity", (d: any) => {
        if (selectedWallet && (
          (d.source.id || d.source) === selectedWallet || 
          (d.target.id || d.target) === selectedWallet
        )) {
          return 0.8;
        }
        return 0.15;
      });

    const nodes = g.append("g")
      .selectAll("g")
      .data(wallets)
      .enter()
      .append("g")
      .attr("cursor", "pointer")
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    const defs = svg.append("defs");
    
    wallets.forEach((wallet) => {
      const gradient = defs.append("radialGradient")
        .attr("id", `gradient-${wallet.id}`);
      
      const color = wallet.netBalance > 0 
        ? "hsl(25, 95%, 53%)" 
        : wallet.netBalance < 0 
        ? "hsl(0, 70%, 50%)" 
        : "hsl(25, 95%, 53%)";
      
      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", color)
        .attr("stop-opacity", 0.9);
      
      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", color)
        .attr("stop-opacity", 0.4);
    });

    nodes.append("circle")
      .attr("r", (d) => Math.min(6 + d.transactionCount * 0.3, 20))
      .attr("fill", (d) => `url(#gradient-${d.id})`)
      .attr("stroke", "hsl(25, 95%, 53%)")
      .attr("stroke-width", 2)
      .attr("opacity", (d) => {
        if (!selectedWallet) return 1;
        if (d.id === selectedWallet) return 1;
        
        const connected = transactions.some(
          (t) => (t.fromAddr === selectedWallet && t.toAddr === d.id) ||
                 (t.toAddr === selectedWallet && t.fromAddr === d.id)
        );
        
        return connected ? 1 : 0.2;
      })
      .style("filter", (d) => {
        if (d.id === selectedWallet) return "drop-shadow(0 0 15px hsl(25, 95%, 53%))";
        return "drop-shadow(0 0 5px hsl(25, 95%, 53%, 0.5))";
      });

    nodes.append("text")
      .text((d) => d.id.split("_")[1])
      .attr("text-anchor", "middle")
      .attr("dy", 30)
      .attr("fill", "hsl(30, 100%, 98%)")
      .attr("font-size", "9px")
      .attr("opacity", (d) => d.id === selectedWallet ? 1 : 0);

    const tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "hsl(0, 0%, 10%)")
      .style("color", "hsl(30, 100%, 98%)")
      .style("padding", "12px")
      .style("border-radius", "8px")
      .style("border", "1px solid hsl(25, 95%, 53%)")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("z-index", "1000")
      .style("box-shadow", "0 0 20px hsl(25, 95%, 53%, 0.3)");

    nodes
      .on("mouseover", function(event, d: Wallet) {
        tooltip
          .style("visibility", "visible")
          .html(`
            <div style="font-weight: bold; margin-bottom: 8px; color: hsl(25, 95%, 53%)">${d.id}</div>
            <div>Received: <span style="color: hsl(120, 100%, 50%)">${d.totalReceived.toFixed(6)}</span> BTC</div>
            <div>Sent: <span style="color: hsl(0, 70%, 50%)">${d.totalSent.toFixed(6)}</span> BTC</div>
            <div>Net: <span style="color: ${d.netBalance > 0 ? 'hsl(120, 100%, 50%)' : 'hsl(0, 70%, 50%)'}">${d.netBalance > 0 ? '+' : ''}${d.netBalance.toFixed(6)}</span> BTC</div>
            <div>Transactions: ${d.transactionCount}</div>
          `);
      })
      .on("mousemove", function(event) {
        tooltip
          .style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", function() {
        tooltip.style("visibility", "hidden");
      })
      .on("click", function(event, d: Wallet) {
        event.stopPropagation();
        onWalletClick(d.id);
      });

    let particleIndex = 0;
    function animateParticles() {
      if (!animationEnabled || !selectedWallet) return;

      g.selectAll(".particle").remove();

      const connectedTransactions = transactions.filter(
        (t) => t.fromAddr === selectedWallet || t.toAddr === selectedWallet
      );

      connectedTransactions.forEach((tx, i) => {
        const sourceNode = wallets.find((w) => w.id === tx.fromAddr);
        const targetNode = wallets.find((w) => w.id === tx.toAddr);

        if (!sourceNode || !targetNode) return;

        const isOutgoing = tx.fromAddr === selectedWallet;
        const color = isOutgoing ? "hsl(0, 70%, 60%)" : "hsl(120, 100%, 50%)";

        const particle = g.append("circle")
          .attr("class", "particle")
          .attr("r", 4)
          .attr("fill", color)
          .attr("stroke", color)
          .attr("stroke-width", 2)
          .style("filter", `drop-shadow(0 0 8px ${color})`);

        const duration = 2000;
        const delay = i * 200;

        particle
          .attr("cx", (sourceNode as any).x)
          .attr("cy", (sourceNode as any).y)
          .transition()
          .delay(delay)
          .duration(duration)
          .attr("cx", (targetNode as any).x)
          .attr("cy", (targetNode as any).y)
          .on("end", function() {
            d3.select(this).remove();
          });
      });

      animationRef.current = window.setTimeout(animateParticles, 2500);
    }

    simulation.on("tick", () => {
      linkElements
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      nodes.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    if (animationEnabled && selectedWallet) {
      animateParticles();
    }

    return () => {
      simulation.stop();
      tooltip.remove();
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [wallets, transactions, selectedWallet, onWalletClick, animationEnabled, dimensions]);

  return (
    <div className="relative w-full h-full bg-card rounded-xl border border-border overflow-hidden">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
      />
    </div>
  );
};
