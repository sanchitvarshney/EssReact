import { CircularProgress } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { formatINR } from "./payslipUtils";

type Props = {
  periodLabel: string;
  earnings: number;
  deductions: number;
  visible: boolean;
  onToggleVisible: () => void;
  onDownload: () => void;
  downloading: boolean;
};

const R = 54;
const C = 2 * Math.PI * R;

const NetPayHero = ({
  periodLabel,
  earnings,
  deductions,
  visible,
  onToggleVisible,
  onDownload,
  downloading,
}: Props) => {
  const net = earnings - deductions;
  const takeHome = earnings > 0 ? Math.max(0, Math.min(1, net / earnings)) : 0;
  const mask = "••••••";

  return (
    <section
      className="relative overflow-hidden rounded-3xl text-white p-5 sm:p-7"
      style={{ background: "linear-gradient(125deg, #0f2f3a 0%, #0b5563 50%, #00a0a0 100%)" }}
    >
      <div className="pointer-events-none absolute -left-10 -bottom-24 w-64 h-64 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute right-40 -top-24 w-56 h-56 rounded-full border-[26px] border-white/5" />

      <div className="relative flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] uppercase tracking-widest text-white/60">Net pay · {periodLabel}</p>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-4xl sm:text-5xl font-bold tabular-nums leading-tight truncate">
              ₹ {visible ? formatINR(net) : mask}
            </p>
            <button
              onClick={onToggleVisible}
              aria-label={visible ? "Hide amounts" : "Show amounts"}
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center cursor-pointer flex-shrink-0 transition-colors"
            >
              {visible ? <VisibilityOffIcon sx={{ fontSize: 18 }} /> : <VisibilityIcon sx={{ fontSize: 18 }} />}
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/60">Earnings</p>
              <p className="text-base font-semibold text-emerald-200 tabular-nums">
                + ₹ {visible ? formatINR(earnings) : mask}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/60">Deductions</p>
              <p className="text-base font-semibold text-rose-200 tabular-nums">
                − ₹ {visible ? formatINR(deductions) : mask}
              </p>
            </div>
          </div>

          <button
            onClick={onDownload}
            disabled={downloading}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#007f86] text-sm font-semibold shadow-lg hover:bg-teal-50 transition-colors cursor-pointer disabled:opacity-70"
          >
            {downloading ? <CircularProgress size={16} sx={{ color: "#007f86" }} /> : <FileDownloadIcon sx={{ fontSize: 18 }} />}
            Download PDF
          </button>
        </div>

        {/* take-home ring */}
        <div className="flex items-center gap-4 md:flex-col md:gap-2">
          <div className="relative w-[132px] h-[132px]">
            <svg viewBox="0 0 130 130" className="w-full h-full -rotate-90">
              <circle cx="65" cy="65" r={R} fill="none" stroke="rgba(253,164,175,0.55)" strokeWidth="12" />
              <circle
                cx="65"
                cy="65"
                r={R}
                fill="none"
                stroke="#5eead4"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - takeHome)}
                style={{ transition: "stroke-dashoffset 0.8s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold tabular-nums">{visible ? `${Math.round(takeHome * 100)}%` : "••"}</span>
              <span className="text-[10px] text-white/60">take-home</span>
            </div>
          </div>
          <div className="text-[11px] text-white/70 space-y-1">
            <p className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-300" /> Net pay
            </p>
            <p className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-300" /> Deductions
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NetPayHero;
