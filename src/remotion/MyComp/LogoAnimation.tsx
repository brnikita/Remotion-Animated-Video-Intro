import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const LogoAnimation: React.FC<{
  progress: number;
}> = ({ progress }) => {
  const frame = useCurrentFrame();

  const scale = interpolate(
    progress,
    [0, 1],
    [0.3, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const opacity = interpolate(
    progress,
    [0, 0.5, 1],
    [0, 0.8, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const rotation = interpolate(
    progress,
    [0, 1],
    [0, 360],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Subtle breathing effect
  const breathingScale = interpolate(
    Math.sin(frame * 0.1) + 1,
    [0, 2],
    [0.95, 1.05]
  );

  const finalScale = scale * breathingScale;

  return (
    <div
      style={{
        width: 120,
        height: 120,
        transform: `scale(${finalScale}) rotate(${rotation * 0.1}deg)`,
        opacity,
        filter: `drop-shadow(0 10px 30px rgba(99, 102, 241, ${opacity * 0.5}))`,
      }}
    >
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#6366f1" }} />
            <stop offset="50%" style={{ stopColor: "#8b5cf6" }} />
            <stop offset="100%" style={{ stopColor: "#06b6d4" }} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Outer ring with animation */}
        <circle 
          cx="60" 
          cy="60" 
          r="55" 
          stroke="url(#logoGradient)" 
          strokeWidth="3" 
          fill="none" 
          opacity={opacity * 0.7}
          filter="url(#glow)"
          strokeDasharray={progress < 0.8 ? `${progress * 345} 345` : "345 345"}
        />
        
        {/* Inner circle */}
        <circle 
          cx="60" 
          cy="60" 
          r="35" 
          fill="url(#logoGradient)" 
          opacity={opacity * 0.1}
        />
        
        {/* Play button triangle */}
        <polygon 
          points="50,45 50,75 80,60" 
          fill="url(#logoGradient)"
          opacity={opacity}
          filter="url(#glow)"
        />
        
        {/* Decorative corner elements */}
        <circle cx="30" cy="30" r="4" fill="url(#logoGradient)" opacity={opacity * 0.6} />
        <circle cx="90" cy="30" r="4" fill="url(#logoGradient)" opacity={opacity * 0.6} />
        <circle cx="30" cy="90" r="4" fill="url(#logoGradient)" opacity={opacity * 0.6} />
        <circle cx="90" cy="90" r="4" fill="url(#logoGradient)" opacity={opacity * 0.6} />
        
        {/* Center highlight */}
        <circle 
          cx="60" 
          cy="60" 
          r="8" 
          fill="white" 
          opacity={opacity * 0.8}
        />
      </svg>
    </div>
  );
}; 