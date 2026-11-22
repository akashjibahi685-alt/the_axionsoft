"use client";

import React, { useEffect, useRef } from "react";

export function HeroVisual() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    // Particle nodes for distributed graph representation
    const nodeCount = Math.min(Math.floor(width / 22), 36);
    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      pulse: number;
      pulseSpeed: number;
      highlight: boolean;
    }> = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 1.5,
        pulse: Math.random() * Math.PI,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        highlight: i % 7 === 0,
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render subtle isometric reference grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.025)";
      ctx.lineWidth = 1;
      const gridSize = 32;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update and connect nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += node.pulseSpeed;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Mouse attraction
        const dx = mouseX - node.x;
        const dy = mouseY - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          node.x += (dx / dist) * 0.6;
          node.y += (dy / dist) * 0.6;
        }

        // Draw node connections (edges)
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const ndx = other.x - node.x;
          const ndy = other.y - node.y;
          const nDist = Math.sqrt(ndx * ndx + ndy * ndy);

          if (nDist < 120) {
            const alpha = (1 - nDist / 120) * (node.highlight || other.highlight ? 0.35 : 0.12);
            ctx.strokeStyle =
              node.highlight || other.highlight
                ? `rgba(182, 255, 92, ${alpha})`
                : `rgba(245, 243, 239, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }

        // Draw node
        ctx.beginPath();
        const currentRadius = node.radius + Math.sin(node.pulse) * 0.8;
        ctx.arc(node.x, node.y, Math.max(1, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = node.highlight ? "#B6FF5C" : "rgba(245, 243, 239, 0.7)";
        ctx.fill();

        if (node.highlight) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, currentRadius * 3, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(182, 255, 92, 0.12)";
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-[380px] sm:h-[450px] lg:h-[500px] border border-[#262626] bg-[#121212] overflow-hidden flex flex-col justify-between p-6">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto"
      />

      {/* Technical HUD Overlay Elements */}
      <div className="relative z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#B6FF5C] animate-ping" />
          <span className="font-mono text-[10px] text-[#B6FF5C] tracking-widest uppercase">
            LIVE GRAPH // PROTOCOL: AX-9
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#666666] tracking-wider">
          LATENCY: 0.8MS // DISTRIBUTED
        </span>
      </div>

      {/* Center abstract schematic badge */}
      <div className="relative z-10 self-center pointer-events-none p-4 bg-[#101010]/80 backdrop-blur-md border border-[#303030] max-w-xs text-center">
        <p className="font-mono text-[11px] text-[#B6FF5C] tracking-wider uppercase mb-1">
          COGNITIVE ENGINE
        </p>
        <p className="text-xs text-[#A5A5A5] leading-relaxed">
          Autonomous agents and high-throughput distributed state synchronizers.
        </p>
      </div>

      {/* Technical corner indicators */}
      <div className="relative z-10 flex items-center justify-between pointer-events-none font-mono text-[9px] text-[#555555]">
        <span>NODE ID: 0x7E4...B9</span>
        <span>ACID // CONSENSUS ACTIVE</span>
      </div>
    </div>
  );
}
