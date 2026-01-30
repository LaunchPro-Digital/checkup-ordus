import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { RiskBand } from "@/lib/questionBank";

interface CRPGaugeProps {
  score: number;
  band: RiskBand;
  animate?: boolean;
  className?: string;
}

export function CRPGauge({ score, band, animate = false, className }: CRPGaugeProps) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);
  const [rotation, setRotation] = useState(animate ? -90 : (score / 10) * 180 - 90);

  useEffect(() => {
    if (!animate) {
      setDisplayScore(score);
      setRotation((score / 10) * 180 - 90);
      return;
    }

    // Animate from 0 to score
    const targetRotation = (score / 10) * 180 - 90;
    const duration = 1500; // 1.5 seconds
    const startTime = Date.now();
    const startRotation = -90;
    const startScore = 0;

    const animateGauge = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      
      const currentRotation = startRotation + (targetRotation - startRotation) * eased;
      const currentScore = startScore + (score - startScore) * eased;
      
      setRotation(currentRotation);
      setDisplayScore(currentScore);

      if (progress < 1) {
        requestAnimationFrame(animateGauge);
      }
    };

    // Start animation after a brief delay
    const timeout = setTimeout(() => {
      requestAnimationFrame(animateGauge);
    }, 300);

    return () => clearTimeout(timeout);
  }, [score, animate]);
  
  // Colors for each section of the gauge - Petrol Blue to Red gradient
  const sections = [
    { color: "hsl(200, 80%, 28%)", label: "0" }, // Petrol Blue - Low risk
    { color: "hsl(195, 75%, 32%)", label: "1" },
    { color: "hsl(190, 70%, 38%)", label: "2" },
    { color: "hsl(48, 90%, 50%)", label: "3" },  // Yellow - Medium risk
    { color: "hsl(42, 90%, 50%)", label: "4" },
    { color: "hsl(36, 90%, 50%)", label: "5" },
    { color: "hsl(25, 90%, 50%)", label: "6" },  // Orange
    { color: "hsl(15, 90%, 50%)", label: "7" },
    { color: "hsl(5, 75%, 50%)", label: "8" },   // Red - High risk
    { color: "hsl(0, 72%, 51%)", label: "9" },
    { color: "hsl(0, 72%, 45%)", label: "10" },
  ];

  const bandLabels: Record<RiskBand, { text: string; color: string }> = {
    low: { text: "RISCO BAIXO", color: "text-risk-low" },
    medium: { text: "RISCO MÉDIO", color: "text-risk-medium" },
    high: { text: "RISCO ALTO", color: "text-risk-high" },
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* Gauge SVG */}
      <div className="relative w-64 h-40 md:w-80 md:h-48">
        <svg viewBox="0 0 200 120" className="w-full h-full">
          {/* Gauge arc sections */}
          {sections.map((section, index) => {
            const startAngle = -90 + (index * 180) / 11;
            const endAngle = -90 + ((index + 1) * 180) / 11;
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            
            const innerRadius = 60;
            const outerRadius = 85;
            const centerX = 100;
            const centerY = 100;
            
            const x1 = centerX + innerRadius * Math.cos(startRad);
            const y1 = centerY + innerRadius * Math.sin(startRad);
            const x2 = centerX + outerRadius * Math.cos(startRad);
            const y2 = centerY + outerRadius * Math.sin(startRad);
            const x3 = centerX + outerRadius * Math.cos(endRad);
            const y3 = centerY + outerRadius * Math.sin(endRad);
            const x4 = centerX + innerRadius * Math.cos(endRad);
            const y4 = centerY + innerRadius * Math.sin(endRad);
            
            const largeArc = endAngle - startAngle > 180 ? 1 : 0;
            
            const path = `
              M ${x1} ${y1}
              L ${x2} ${y2}
              A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x3} ${y3}
              L ${x4} ${y4}
              A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1} ${y1}
              Z
            `;
            
            return (
              <path
                key={index}
                d={path}
                fill={section.color}
                stroke="white"
                strokeWidth="1"
              />
            );
          })}
          
          {/* Tick marks and labels */}
          {sections.map((section, index) => {
            const angle = -90 + (index * 180) / 10;
            const rad = (angle * Math.PI) / 180;
            const labelRadius = 95;
            const x = 100 + labelRadius * Math.cos(rad);
            const y = 100 + labelRadius * Math.sin(rad);
            
            return (
              <text
                key={`label-${index}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground text-[8px] font-medium"
              >
                {index}
              </text>
            );
          })}
          
          {/* Last label (10) */}
          <text
            x={100 + 95 * Math.cos((90 * Math.PI) / 180)}
            y={100 + 95 * Math.sin((90 * Math.PI) / 180)}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground text-[8px] font-medium"
          >
            10
          </text>
          
          {/* Needle */}
          <g 
            transform={`rotate(${rotation}, 100, 100)`}
            style={{ transition: animate ? "none" : "transform 0.3s ease-out" }}
          >
            {/* Needle body */}
            <polygon
              points="100,30 96,100 104,100"
              fill="hsl(var(--foreground))"
            />
            {/* Needle center circle */}
            <circle
              cx="100"
              cy="100"
              r="8"
              fill="hsl(var(--foreground))"
            />
            <circle
              cx="100"
              cy="100"
              r="4"
              fill="hsl(var(--background))"
            />
          </g>
        </svg>
      </div>
      
      {/* Score display */}
      <div className="text-center space-y-2">
        <div className="flex items-baseline justify-center gap-2">
          <span className="font-display text-6xl md:text-7xl font-bold text-foreground">
            {displayScore.toFixed(1)}
          </span>
          <span className="text-xl text-muted-foreground">/10</span>
        </div>
        <div className={cn("font-display text-xl font-semibold tracking-wide", bandLabels[band].color)}>
          {bandLabels[band].text}
        </div>
      </div>
    </div>
  );
}
