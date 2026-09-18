import { Typography } from "@mui/material";
import { Lock } from "lucide-react";

interface RatingWindowBannerProps {
  targetMonth?: string;
}

const RatingWindowBanner = ({ targetMonth }: RatingWindowBannerProps) => (
  <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
    <div
      className="flex items-center justify-center"
      style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: "#fef9c3" }}
    >
      <Lock size={26} color="#854d0e" />
    </div>
    <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#1f2937" }}>
      Rating window is closed
    </Typography>
    <Typography sx={{ fontSize: 13, color: "#6b7280", maxWidth: 360, textAlign: "center" }}>
      You can submit your KRA rating from the 25th of the month through the 3rd of the
      following month{targetMonth ? ` — the next window covers ${targetMonth}` : ""}.
    </Typography>
  </div>
);

export default RatingWindowBanner;
