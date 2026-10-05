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
    text: "New KRA feature has been added to your ESS Web Portal. KRA will be available from the 25th until the end of every month. Please make sure to complete your KRA within this period.",
  },
  {
    type: "error",
    text: "WhatsApp Bot is currently unavailable. Please use the ESS App or Web Portal to continue. We sincerely apologize for the inconvenience and deeply regret the disruption.",
  },
];
