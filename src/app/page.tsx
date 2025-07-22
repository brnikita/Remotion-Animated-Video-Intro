"use client";

import { Player } from "@remotion/player";
import type { NextPage } from "next";
import React, { useMemo, useState } from "react";
import { z } from "zod";
import {
  defaultMyCompProps,
  CompositionProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../../types/constants";
import { LocalRenderControls } from "../components/LocalRenderControls";
import { Spacing } from "../components/Spacing";
import { Main } from "../remotion/MyComp/Main";

const Home: NextPage = () => {
  const [clientName, setClientName] = useState<string>(defaultMyCompProps.clientName);

  const inputProps: z.infer<typeof CompositionProps> = useMemo(() => {
    return {
      clientName: clientName,
    };
  }, [clientName]);

  return (
    <div style={{ 
      background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
      minHeight: "100vh",
      color: "#ffffff"
    }}>
      <div className="max-w-screen-lg m-auto pb-10">
        {/* Header */}
        <div className="text-center pt-16 pb-8">
          <h1 style={{
            fontSize: "3rem",
            fontWeight: 700,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "1rem"
          }}>
            Video Intro Generator
          </h1>
          <p style={{
            fontSize: "1.2rem",
            color: "#94a3b8",
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            Create professional 10-second animated video intros with your client name. 
            Type a name below to see the magic happen!
          </p>
        </div>

        {/* Video Player */}
        <div className="overflow-hidden rounded-xl shadow-2xl mb-8 bg-black">
          <Player
            component={Main}
            inputProps={inputProps}
            durationInFrames={DURATION_IN_FRAMES}
            fps={VIDEO_FPS}
            compositionHeight={VIDEO_HEIGHT}
            compositionWidth={VIDEO_WIDTH}
            style={{
              width: "100%",
              aspectRatio: "16/9"
            }}
            controls
            autoPlay
            loop
          />
        </div>

        {/* Controls */}
        <LocalRenderControls
          text={clientName}
          setText={setClientName}
          inputProps={inputProps}
        />

        <Spacing />
        <Spacing />
      </div>
    </div>
  );
};

export default Home;
