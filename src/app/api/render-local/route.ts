import { NextRequest, NextResponse } from "next/server";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { z } from "zod";
import path from "path";
import fs from "fs";
import os from "os";
import { COMP_NAME } from "../../../../types/constants";

const RenderRequest = z.object({
  clientName: z.string(),
});

export async function POST(request: NextRequest) {
  let outputPath: string | null = null;
  
  try {
    const body = await request.json();
    const { clientName } = RenderRequest.parse(body);

    console.log("Starting video rendering for:", clientName);

    // Create temporary output path
    const tempDir = os.tmpdir();
    outputPath = path.join(tempDir, `video-${Date.now()}-${Math.random().toString(36).substring(7)}.mp4`);

    // Bundle the Remotion project
    console.log("Creating bundle...");
    const bundleLocation = await bundle({
      entryPoint: path.join(process.cwd(), "src", "remotion", "index.ts"),
      webpackOverride: (config) => config,
    });

    // Get the composition
    console.log("Getting composition...");
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: COMP_NAME,
    });

    // Render the video
    console.log("Rendering video...");
    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation: outputPath,
      inputProps: {
        clientName: clientName,
      },
    });

    console.log("Video rendered successfully:", outputPath);

    // Read the generated video file
    const videoBuffer = fs.readFileSync(outputPath);

    // Return the video file as response
    return new NextResponse(videoBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="welcome-${clientName.replace(/[^a-zA-Z0-9]/g, '-')}.mp4"`,
        "Content-Length": videoBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error("Render error:", error);
    return NextResponse.json(
      { 
        error: "Failed to render video", 
        message: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  } finally {
    // Clean up temporary file
    if (outputPath && fs.existsSync(outputPath)) {
      try {
        fs.unlinkSync(outputPath);
        console.log("Temporary file cleaned up:", outputPath);
      } catch (cleanupError) {
        console.warn("Failed to clean up temporary file:", cleanupError);
      }
    }
  }
} 