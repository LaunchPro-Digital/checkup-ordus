import { useState, useEffect, useRef } from "react";
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
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!animate) {
      setDisplayScore(score);
      setRotation((score / 10) * 180 - 90);
      return;
    }

    const targetRotation = (score / 10) * 180 - 90;
    const duration = 1500;
    const startTime = Date.now();
    const startRotation = -90;
    const startScore = 0;

    const animateGauge = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setRotation(startRotation + (targetRotation - startRotation) * eased);
      setDisplayScore(startScore + (score - startScore) * eased);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateGauge);
      }
    };

    const timeout = setTimeout(() => {
      animationRef.current = requestAnimationFrame(animateGauge);
    }, 300);

    return () => {
      clearTimeout(timeout);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [score, animate]);

  // Colors — DS Ordus v3.0: verde → âmbar → vermelho
  const sections = [
    { color: "hsl(163, 100%, 32%)" },
    { color: "hsl(160, 95%, 36%)" },
    { color: "hsl(155, 88%, 40%)" },
    { color: "hsl(48,  92%, 50%)" },
    { color: "hsl(42,  90%, 50%)" },
    { color: "hsl(36,  90%, 50%)" },
    { color: "hsl(25,  88%, 50%)" },
    { color: "hsl(15,  88%, 50%)" },
    { color: "hsl( 5,  75%, 50%)" },
    { color: "hsl( 0,  72%, 51%)" },
    { color: "hsl( 0,  72%, 45%)" },
  ];

  // DS Ordus: band label uses font-label (Lowvetica Bold UPPERCASE)
  const bandLabels: Record<RiskBand, { text: string; color: string }> = {
    low:    { text: "RISCO BAIXO",  color: "text-risk-low" },
    medium: { text: "RISCO MÉDIO",  color: "text-risk-medium" },
    high:   { text: "RISCO ALTO",   color: "text-risk-high" },
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* Gauge SVG */}
      <div className="relative w-64 h-40 md:w-80 md:h-48">
        <svg viewBox="0 0 200 120" className="w-full h-full">
          {sections.map((section, index) => {
            const startAngle = -90 + (index * 180) / 11;
            const endAngle = -90 + ((index + 1) * 180) / 11;
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            const innerRadius = 60;
            const outerRadius = 85;
            const cx = 100, cy = 100;
            const x1 = cx + innerRadius * Math.cos(startRad);
            const y1 = cy + innerRadius * Math.sin(startRad);
            const x2 = cx + outerRadius * Math.cos(startRad);
            const y2 = cy + outerRadius * Math.sin(startRad);
            const x3 = cx + outerRadius * Math.cos(endRad);
            const y3 = cy + outerRadius * Math.sin(endRad);
            const x4 = cx + innerRadius * Math.cos(endRad);
            const y4 = cy + innerRadius * Math.sin(endRad);
            const largeArc = endAngle - startAngle > 180 ? 1 : 0;
            const d = `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1} ${y1} Z`;
            return <path key={index} d={d} fill={section.color} stroke="white" strokeWidth="1" />;
          })}

          {/* Tick labels 0–10 */}
          {Array.from({ length: 11 }, (_, i) => {
            const angle = -90 + (i * 180) / 10;
            const rad = (angle * Math.PI) / 180;
            const r = 95;
            return (
              <text
                key={i}
                x={100 + r * Math.cos(rad)}
                y={100 + r * Math.sin(rad)}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground text-[8px] font-medium"
              >
                {i}
              </text>
            );
          })}

          {/* Needle */}
          <g
            transform={`rotate(${rotation}, 100, 100)`}
            style={{ transition: animate ? "none" : "transform 0.3s ease-out" }}
          >
            <polygon points="100,30 96,100 104,100" fill="hsl(var(--foreground))" />
            <circle cx="100" cy="100" r="8" fill="hsl(var(--foreground))" />
            <circle cx="100" cy="100" r="4" fill="hsl(var(--background))" />
          </g>
        </svg>
      </div>

      {/* Score display — DS: Fractul Black (font-black) for number, font-label for band */}
      <div className="text-center space-y-2">
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-6xl md:text-7xl font-black text-foreground">
            {displayScore.toFixed(1)}
          </span>
          <span className="text-xl text-muted-foreground">/10</span>
        </div>
        {/* Band label — Lowvetica Bold UPPERCASE per DS spec */}
        <div className={cn("font-label text-sm tracking-widest", bandLabels[band].color)}>
          {bandLabels[band].text}
        </div>
      </div>
    </div>
  );
}
