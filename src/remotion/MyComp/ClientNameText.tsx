import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";

// Load Inter font for client name
loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "600", "700"],
});

// Helper function to calculate responsive text size
const getTextSize = (name: string) => {
  if (name.length <= 10) return "4rem";
  if (name.length <= 20) return "3rem";
  return "2.5rem";
};

export const ClientNameText: React.FC<{
  clientName: string;
}> = ({ clientName }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation timeline: 4-6s (frames 120-180)
  const startFrame = 120; // 4 seconds
  const endFrame = 180; // 6 seconds

  const scaleProgress = spring({
    fps,
    frame: frame - startFrame,
    config: {
      damping: 200,
      stiffness: 150,
    },
    durationInFrames: 60,
  });

  const opacity = interpolate(
    frame,
    [startFrame, startFrame + 15, endFrame + 60, endFrame + 75],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const scale = interpolate(
    scaleProgress,
    [0, 1],
    [0.5, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Glow effect animation
  const glowIntensity = interpolate(
    Math.sin((frame - startFrame) * 0.1) + 1,
    [0, 2],
    [0.3, 0.8]
  );

  // Breathing effect for final seconds
  const breathingScale = interpolate(
    Math.sin((frame - 240) * 0.2) + 1, // Start breathing at 8s (frame 240)
    [0, 2],
    [0.98, 1.02]
  );

  const finalScale = frame > 240 ? scale * breathingScale : scale;

  if (frame < startFrame) {
    return null;
  }

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: "10%",
          top: "50%",
          transform: `scale(${finalScale})`,
          transformOrigin: "left center",
          opacity,
          fontFamily,
          fontSize: getTextSize(clientName),
          fontWeight: 700,
          color: "#ffffff",
          textShadow: `
            0 0 20px rgba(99, 102, 241, ${glowIntensity}),
            0 0 40px rgba(99, 102, 241, ${glowIntensity * 0.5}),
            0 4px 20px rgba(0, 0, 0, 0.5)
          `,
          letterSpacing: "0.05em",
          maxWidth: "80%",
        }}
      >
        {clientName}
      </div>
    </AbsoluteFill>
  );
}; 