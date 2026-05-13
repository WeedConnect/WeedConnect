import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  showText?: boolean;
  textClassName?: string;
}

export function LogoWeedConnect({
  className,
  showText = false,
  textClassName,
  ...props
}: LogoProps) {
  // Coordinates for nodes
  const nodes = {
    // Outer tips
    P1: [50, 10], // Top
    P2: [32, 28], // Upper Left
    P3: [68, 28], // Upper Right
    P4: [20, 48], // Mid Left
    P5: [80, 48], // Mid Right
    P6: [26, 65], // Lower Left
    P7: [74, 65], // Lower Right
    P8: [50, 82], // Base Stem

    // Inner Connection Points (Nodos Dorados)
    C1: [50, 30],
    C2: [50, 52],
    C3: [50, 68],
    L1: [38, 42],
    R1: [62, 42],
    L2: [36, 58],
    R2: [64, 58],
    L3: [38, 66],
    R3: [62, 66],
  };

  // Function to render lines easily
  const line = (p1: number[], p2: number[], key: string) => (
    <line
      key={key}
      x1={p1[0]}
      y1={p1[1]}
      x2={p2[0]}
      y2={p2[1]}
      className="stroke-brand-green dark:stroke-emerald-600/80 transition-all duration-500"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  );

  const goldDot = (p: number[], key: string, size = 1.8) => (
    <circle
      key={key}
      cx={p[0]}
      cy={p[1]}
      r={size}
      className="fill-brand-gold animate-pulse-slow select-none transition-transform hover:scale-150 duration-300"
      style={{ transformOrigin: `${p[0]}px ${p[1]}px` }}
    />
  );

  const greenDot = (p: number[], key: string, size = 1.2) => (
    <circle
      key={key}
      cx={p[0]}
      cy={p[1]}
      r={size}
      className="fill-brand-green dark:fill-emerald-600/80"
    />
  );

  const leafIcon = (
    <svg
      viewBox="0 0 100 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-10 overflow-visible select-none", className)}
      {...props}
    >
      {/* Central axis */}
      {line(nodes.P1, nodes.C1, "c-axis-1")}
      {line(nodes.C1, nodes.C2, "c-axis-2")}
      {line(nodes.C2, nodes.C3, "c-axis-3")}
      {line(nodes.C3, nodes.P8, "c-axis-4")}

      {/* Outer borders */}
      {line(nodes.P1, nodes.P2, "outer-1")}
      {line(nodes.P1, nodes.P3, "outer-2")}
      {line(nodes.P2, nodes.L1, "outer-3")}
      {line(nodes.P3, nodes.R1, "outer-4")}
      {line(nodes.L1, nodes.P4, "outer-5")}
      {line(nodes.R1, nodes.P5, "outer-6")}
      {line(nodes.P4, nodes.L2, "outer-7")}
      {line(nodes.P5, nodes.R2, "outer-8")}
      {line(nodes.L2, nodes.P6, "outer-9")}
      {line(nodes.R2, nodes.P7, "outer-10")}
      {line(nodes.P6, nodes.L3, "outer-11")}
      {line(nodes.P7, nodes.R3, "outer-12")}
      {line(nodes.L3, nodes.P8, "outer-13")}
      {line(nodes.R3, nodes.P8, "outer-14")}

      {/* Inner geometry / Webbing */}
      {line(nodes.C1, nodes.P2, "web-1")}
      {line(nodes.C1, nodes.P3, "web-2")}
      {line(nodes.C1, nodes.L1, "web-3")}
      {line(nodes.C1, nodes.R1, "web-4")}
      {line(nodes.L1, nodes.C2, "web-5")}
      {line(nodes.R1, nodes.C2, "web-6")}
      {line(nodes.L1, nodes.P4, "web-7")}
      {line(nodes.R1, nodes.P5, "web-8")}
      {line(nodes.C2, nodes.L2, "web-9")}
      {line(nodes.C2, nodes.R2, "web-10")}
      {line(nodes.C2, nodes.P4, "web-11")}
      {line(nodes.C2, nodes.P5, "web-12")}
      {line(nodes.L2, nodes.C3, "web-13")}
      {line(nodes.R2, nodes.C3, "web-14")}
      {line(nodes.C3, nodes.P6, "web-15")}
      {line(nodes.C3, nodes.P7, "web-16")}
      {line(nodes.C3, nodes.L3, "web-17")}
      {line(nodes.C3, nodes.R3, "web-18")}

      {/* Structural diagonals */}
      {line(nodes.P2, nodes.P4, "diag-1")}
      {line(nodes.P3, nodes.P5, "diag-2")}
      {line(nodes.L1, nodes.L2, "diag-3")}
      {line(nodes.R1, nodes.R2, "diag-4")}
      {line(nodes.P4, nodes.P6, "diag-5")}
      {line(nodes.P5, nodes.P7, "diag-6")}
      {line(nodes.L2, nodes.L3, "diag-7")}
      {line(nodes.R2, nodes.R3, "diag-8")}

      {/* Green nodes (Outer tips) */}
      {greenDot(nodes.P1, "dot-p1")}
      {greenDot(nodes.P2, "dot-p2")}
      {greenDot(nodes.P3, "dot-p3")}
      {greenDot(nodes.P4, "dot-p4")}
      {greenDot(nodes.P5, "dot-p5")}
      {greenDot(nodes.P6, "dot-p6")}
      {greenDot(nodes.P7, "dot-p7")}

      {/* Golden nodes (Network Connections) */}
      {goldDot(nodes.C1, "gold-c1")}
      {goldDot(nodes.C2, "gold-c2")}
      {goldDot(nodes.C3, "gold-c3")}
      {goldDot(nodes.L1, "gold-l1")}
      {goldDot(nodes.R1, "gold-r1")}
      {goldDot(nodes.L2, "gold-l2")}
      {goldDot(nodes.R2, "gold-r2")}
      {goldDot(nodes.L3, "gold-l3")}
      {goldDot(nodes.R3, "gold-r3")}
      {goldDot(nodes.P8, "gold-p8", 2.2)} {/* Bigger stem node */}
    </svg>
  );

  if (showText) {
    return (
      <div className="flex items-center gap-2">
        {leafIcon}
        <span
          className={cn(
            "font-sans font-semibold tracking-tight text-brand-green dark:text-brand-gold",
            textClassName
          )}
        >
          WeedConnect
        </span>
      </div>
    );
  }

  return leafIcon;
}
