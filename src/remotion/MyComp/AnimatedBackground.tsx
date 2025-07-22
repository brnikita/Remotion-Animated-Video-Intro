import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const FloatingShape: React.FC<{
  size: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  shape: "circle" | "square" | "triangle";
}> = ({ size, x, y, delay, duration, shape }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = interpolate(
    frame,
    [delay, delay + duration],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "extend",
    }
  );

  const opacity = interpolate(
    frame,
    [0, 30, durationInFrames - 30, durationInFrames],
    [0, 0.6, 0.6, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const translateY = interpolate(progress, [0, 1], [0, -100]);
  const rotate = interpolate(progress, [0, 1], [0, 360]);
  const scale = interpolate(
    Math.sin(progress * Math.PI * 2) + 1,
    [0, 2],
    [0.8, 1.2]
  );

  const getShapeStyles = () => {
    const baseStyles = {
      width: size,
      height: size,
      position: "absolute" as const,
      left: x,
      top: y,
      transform: `translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`,
      opacity,
    };

    switch (shape) {
      case "circle":
        return {
          ...baseStyles,
          borderRadius: "50%",
          background: "rgba(99, 102, 241, 0.3)", // Indigo
        };
      case "square":
        return {
          ...baseStyles,
          background: "rgba(139, 92, 246, 0.3)", // Purple
        };
      case "triangle":
        return {
          ...baseStyles,
          width: 0,
          height: 0,
          borderLeft: `${size / 2}px solid transparent`,
          borderRight: `${size / 2}px solid transparent`,
          borderBottom: `${size}px solid rgba(6, 182, 212, 0.3)`, // Cyan
          background: "transparent",
        };
      default:
        return baseStyles;
    }
  };

  return <div style={getShapeStyles()} />;
};

const Particle: React.FC<{
  x: number;
  y: number;
  delay: number;
}> = ({ x, y, delay }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(
    frame,
    [delay, delay + 60, durationInFrames - 60, durationInFrames],
    [0, 0.8, 0.8, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const progress = interpolate(frame, [delay, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(progress, [0, 1], [0, -200]);
  const translateX = interpolate(
    Math.sin(progress * Math.PI * 4) * 50,
    [-50, 50],
    [-30, 30]
  );

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 3,
        height: 3,
        borderRadius: "50%",
        background: "rgba(255, 255, 255, 0.8)",
        transform: `translate(${translateX}px, ${translateY}px)`,
        opacity,
      }}
    />
  );
};

export const AnimatedBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Gradient animation
  const gradientProgress = interpolate(
    frame,
    [0, durationInFrames / 2, durationInFrames],
    [0, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const gradientShift = interpolate(gradientProgress, [0, 1], [0, 180]);

  const backgroundStyle = {
    background: `linear-gradient(${gradientShift}deg, #1e293b 0%, #0f172a 100%)`,
  };

  // Generate shapes and particles
  const shapes = [
    { size: 60, x: 100, y: 200, delay: 30, duration: 240, shape: "circle" as const },
    { size: 40, x: 300, y: 400, delay: 60, duration: 180, shape: "square" as const },
    { size: 50, x: 800, y: 150, delay: 90, duration: 210, shape: "triangle" as const },
    { size: 35, x: 1200, y: 600, delay: 120, duration: 150, shape: "circle" as const },
    { size: 45, x: 1600, y: 300, delay: 150, duration: 120, shape: "square" as const },
    { size: 55, x: 500, y: 800, delay: 180, duration: 90, shape: "triangle" as const },
  ];

  const particles = Array.from({ length: 20 }, (_, i) => ({
    x: Math.random() * 1920,
    y: Math.random() * 1080,
    delay: Math.random() * 60,
  }));

  return (
    <AbsoluteFill style={backgroundStyle}>
      {/* Floating geometric shapes */}
      {shapes.map((shape, index) => (
        <FloatingShape key={`shape-${index}`} {...shape} />
      ))}
      
      {/* Particles */}
      {particles.map((particle, index) => (
        <Particle key={`particle-${index}`} {...particle} />
      ))}
      
      {/* Gradient overlay for depth */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(circle at center, transparent 20%, rgba(0, 0, 0, 0.1) 80%)",
          opacity: interpolate(
            frame,
            [0, 60, durationInFrames - 60, durationInFrames],
            [0, 0.5, 0.5, 0]
          ),
        }}
      />
    </AbsoluteFill>
  );
}; 