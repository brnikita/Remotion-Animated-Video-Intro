import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const RenderRequest = z.object({
  clientName: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientName } = RenderRequest.parse(body);

    console.log("Local rendering requested for:", clientName);

    // For now, return a message indicating that local rendering is being set up
    return NextResponse.json(
      { 
        message: "Local rendering is being set up. Please use the video preview for now.",
        clientName: clientName,
        status: "development"
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Render error:", error);
    return NextResponse.json(
      { 
        error: "Failed to process render request", 
        message: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
} 