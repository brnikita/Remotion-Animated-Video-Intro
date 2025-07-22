import { z } from "zod";
import {
  AbsoluteFill,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CompositionProps } from "../../../types/constants";
import React from "react";
import { AnimatedBackground } from "./AnimatedBackground";
import { WelcomeText } from "./WelcomeText";
import { ClientNameText } from "./ClientNameText";
import { LogoAnimation } from "./LogoAnimation";

export const Main = ({ clientName }: z.infer<typeof CompositionProps>) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation timeline based on project specifications:
  // 0-1s: Logo fade-in and scale
  // 1-3s: Background particles start moving  
  // 2-4s: "Welcome to" text slide-in from left
  // 4-6s: Client name text scale-in with glow effect
  // 6-8s: Background gradient shift animation
  // 8-10s: All elements subtle breathing effect + fade out

  const logoStartFrame = 0;
  const logoEndFrame = 30; // 1 second
  const logoTransitionDuration = 30; // 1 second

  const logoProgress = spring({
    fps,
    frame,
    config: {
      damping: 200,
      stiffness: 100,
    },
    durationInFrames: logoTransitionDuration,
    delay: logoStartFrame,
  });

  // Final fade out for all elements
  const finalFadeFrame = 270; // 9 seconds
  const finalFadeOpacity = frame > finalFadeFrame ? 
    Math.max(0, 1 - (frame - finalFadeFrame) / 30) : 1;

  return (
    <AbsoluteFill>
      {/* Animated Background - runs throughout entire duration */}
      <AnimatedBackground />
      
      {/* Logo Animation - 0-1s with fade-in and scale */}
      <Sequence from={logoStartFrame} durationInFrames={logoEndFrame + 60}>
        <AbsoluteFill 
          style={{ 
            opacity: finalFadeOpacity,
            transform: `scale(${0.6 + logoProgress * 0.4})`, // Scale from 0.6 to 1
          }}
        >
          <AbsoluteFill className="justify-center items-center">
            <div style={{ 
              position: "absolute", 
              top: "15%", 
              opacity: logoProgress,
              transform: `translateY(${(1 - logoProgress) * 50}px)`,
            }}>
              <LogoAnimation progress={logoProgress} />
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      </Sequence>

      {/* Welcome Text - 2-4s slide-in from left */}
      <Sequence from={0} durationInFrames={300}>
        <div style={{ opacity: finalFadeOpacity }}>
          <WelcomeText />
        </div>
      </Sequence>

      {/* Client Name Text - 4-6s scale-in with glow */}
      <Sequence from={0} durationInFrames={300}>
        <div style={{ opacity: finalFadeOpacity }}>
          <ClientNameText clientName={clientName} />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
