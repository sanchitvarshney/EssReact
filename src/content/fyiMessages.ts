// Dashboard "FYI" marquee content - edited here directly (no admin UI/backend
// for this, by design). One message shows at a time, in order, each cycle;
// `type` drives its color in FyiBanner.tsx (error = red, success = dark
// green, info = dark blue).
export type FyiMessageType = "error" | "info" | "success";

export interface FyiMessage {
  type: FyiMessageType;
  text: string;
}

export const FYI_MESSAGES: FyiMessage[] = [
  {
    type: "info",
    text: "We've launched the new ESS app on the Play Store, packed with new features to make your experience smoother.",
  },
  {
    type: "success",
    text: "Your Q3 performance review window is now open under My KRA.",
  },
];
