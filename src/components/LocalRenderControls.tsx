import React, { useState } from "react";
import { z } from "zod";
import { AlignEnd } from "./AlignEnd";
import { Button } from "./Button";
import { InputContainer } from "./Container";
import { ErrorComp } from "./Error";
import { Input } from "./Input";
import { Spacing } from "./Spacing";
import { CompositionProps } from "../../types/constants";

type RenderState = 
  | { status: "idle" }
  | { status: "rendering" }
  | { status: "error"; message: string }
  | { status: "success"; downloadUrl: string };

export const LocalRenderControls: React.FC<{
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  inputProps: z.infer<typeof CompositionProps>;
}> = ({ text, setText, inputProps }) => {
  const [renderState, setRenderState] = useState<RenderState>({ status: "idle" });

  const handleRender = async () => {
    if (!text.trim()) {
      setRenderState({ status: "error", message: "Please enter a client name" });
      return;
    }

    setRenderState({ status: "rendering" });

    try {
      const response = await fetch("/api/render-local", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientName: text,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to render video");
      }

      // For development, handle JSON response
      const result = await response.json();
      
      if (result.status === "development") {
        setRenderState({ 
          status: "success", 
          downloadUrl: "" 
        });
        
        // Show success message for development
        alert(`✓ Render request processed for "${text}"!\n\n${result.message}\n\nYou can see the video preview above with your client name.`);
      } else {
        // Handle actual video file download (future implementation)
        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);
        
        setRenderState({ status: "success", downloadUrl });

        // Auto-download the file
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `welcome-${text.replace(/[^a-zA-Z0-9]/g, '-')}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

    } catch (error) {
      console.error("Render error:", error);
      setRenderState({
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  const resetState = () => {
    setRenderState({ status: "idle" });
  };

  return (
    <InputContainer>
      <Input
        disabled={renderState.status === "rendering"}
        setText={setText}
        text={text}
      />
      <Spacing />
      
      <AlignEnd>
        {renderState.status === "success" ? (
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <span style={{ color: "#10b981", fontSize: "0.9rem" }}>
              ✓ Video downloaded successfully!
            </span>
            <Button onClick={resetState}>
              Render Another
            </Button>
          </div>
        ) : (
          <Button
            disabled={renderState.status === "rendering"}
            loading={renderState.status === "rendering"}
            onClick={handleRender}
          >
            {renderState.status === "rendering" ? "Rendering Video..." : "Download Video"}
          </Button>
        )}
      </AlignEnd>

      {renderState.status === "error" && (
        <>
          <Spacing />
          <ErrorComp message={renderState.message} />
          <Spacing />
          <AlignEnd>
            <Button onClick={resetState}>
              Try Again
            </Button>
          </AlignEnd>
        </>
      )}
    </InputContainer>
  );
}; 