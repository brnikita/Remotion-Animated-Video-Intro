import { z } from "zod";

export const COMP_NAME = "VideoIntro";

export const CompositionProps = z.object({
  clientName: z.string(),
});

export const defaultMyCompProps: z.infer<typeof CompositionProps> = {
  clientName: "Your Company",
};

// Video specifications according to project requirements
export const DURATION_IN_FRAMES = 300; // 10 seconds at 30fps
export const VIDEO_WIDTH = 1920; // Full HD width
export const VIDEO_HEIGHT = 1080; // Full HD height
export const VIDEO_FPS = 30;
