import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Poppins";

// Load Poppins font for headings
loadFont("normal", {
  subsets: ["latin"],
  weights: ["300", "400", "600", "700"],
});

export const WelcomeText: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation timeline: 2-4s (frames 60-120)
  const startFrame = 60; // 2 seconds
  const endFrame = 120; // 4 seconds

  const slideProgress = spring({
    fps,
    frame: frame - startFrame,
    config: {
      damping: 200,
      stiffness: 100,
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

  const translateX = interpolate(
    slideProgress,
    [0, 1],
    [-300, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  if (frame < startFrame) {
    return null;
  }

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: "10%",
          top: "35%",
          transform: `translateX(${translateX}px)`,
          opacity,
          fontFamily,
          fontSize: "4rem",
          fontWeight: 300,
          color: "#ffffff",
          textShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
          letterSpacing: "0.1em",
        }}
      >
        Welcome to
      </div>
    </AbsoluteFill>
  );
}; 