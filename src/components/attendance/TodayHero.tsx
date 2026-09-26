import { useEffect, useState, type FC } from "react";
import moment from "moment";
import { CircularProgress } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import LoginIcon from "@mui/icons-material/Login";
import ScheduleIcon from "@mui/icons-material/Schedule";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import type { ShiftDetailsTypes } from "../../types/dataTypes/shiftDetailsTypes";
import { useDownloadAttendanceMutation } from "../../services/shift";
import { useToast } from "../../hooks/useToast";

const TARGET_MIN = 8 * 60 + 30;
const R = 52;
const C = 2 * Math.PI * R;

const toMinutes = (v?: string) => {
  const m = String(v ?? "").match(/(\d{1,2}):(\d{2})/);
  return m ? Number(m[1]) * 60 + Number(m[2]) : 0;
};

type Props = { value: ShiftDetailsTypes; date: any };

const PUNCH_FORMATS = ["DD-MM-YYYY HH:mm:ss", "YYYY-MM-DD HH:mm:ss", "DD-MM-YYYY hh:mm A", "HH:mm:ss", "HH:mm"];

const Fact: FC<{ icon: any; label: string; value: string }> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <span className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
      <Icon sx={{ fontSize: 18 }} />
    </span>
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-wider text-white/60 whitespace-nowrap">{label}</p>
      <p className="text-sm font-semibold leading-snug whitespace-nowrap">{value}</p>
    </div>
  </div>
);

// today_in comes back as "DD-MM-YYYY HH:mm:ss" (or already a time) - show just the clock time.
const clock = (v?: string) => {
  if (!v) return "--";
  const m = moment(v, ["DD-MM-YYYY HH:mm:ss", "YYYY-MM-DD HH:mm:ss", "HH:mm:ss", "HH:mm"]);
  return m.isValid() ? m.format("hh:mm A") : v;
};

const TodayHero: FC<Props> = ({ value, date }) => {
  const [downloadAttendance, { data, error, isLoading }] = useDownloadAttendanceMutation();
  const { showToast } = useToast();

  useEffect(() => {
    if (data?.buffer) {
      const file = new Blob([new Uint8Array(data.buffer.data)], { type: "application/pdf" });
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = data.filename ?? "attendance.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    if (error) {
      showToast(
        //@ts-ignore
        error?.data?.message ||
          "We're Sorry An unexpected error has occured. Our technical staff has been automatically notified and will be looking into this with utmost urgency.",
        "error",
      );
    }
  }, [data?.buffer, error]);

  // Tick every 30s so an open shift (punched in, not yet out) keeps counting up.
  const [now, setNow] = useState(() => moment());
  useEffect(() => {
    const t = setInterval(() => setNow(moment()), 30000);
    return () => clearInterval(t);
  }, []);

  const recorded = toMinutes(value?.total_hour);
  const punchIn = value?.today_in ? moment(value.today_in, PUNCH_FORMATS) : null;
  const live =
    recorded === 0 && punchIn?.isValid()
      ? Math.max(0, now.diff(punchIn.isSame(now, "day") ? punchIn : now.clone().set({ hour: punchIn.hour(), minute: punchIn.minute() }), "minutes"))
      : 0;
  const worked = recorded || live;
  const pct = Math.min(1, worked / TARGET_MIN);
  const hh = String(Math.floor(worked / 60)).padStart(2, "0");
  const mm = String(worked % 60).padStart(2, "0");

  return (
    <section
      className="relative overflow-hidden rounded-3xl text-white p-5 sm:p-6"
      style={{ background: "linear-gradient(120deg, #0f2f3a 0%, #0b5563 45%, #00a0a0 100%)" }}
    >
      {/* decorative rings */}
      <div className="pointer-events-none absolute -right-16 -top-20 w-64 h-64 rounded-full border-[28px] border-white/5" />
      <div className="pointer-events-none absolute right-24 -bottom-24 w-56 h-56 rounded-full bg-white/5" />

      <div className="relative flex flex-col items-center gap-5">
        {/* progress ring */}
        <div className="relative w-[156px] h-[156px] min-w-[156px] flex-shrink-0">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="8" />
            <circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              stroke="#5eead4"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - pct)}
              style={{ transition: "stroke-dashoffset 0.8s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold tabular-nums leading-none">
              {hh}:{mm}
            </span>
            <span className="text-[10px] text-white/60 mt-1.5 whitespace-nowrap">of 8h 30m</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[11px] uppercase tracking-widest text-white/60">Today</p>
          <p className="text-xl font-bold leading-tight whitespace-nowrap">{moment().format("dddd")}</p>
          <p className="text-sm text-white/70 whitespace-nowrap">{moment().format("DD MMMM YYYY")}</p>
          <p className="mt-2 text-xs font-medium text-teal-200 whitespace-nowrap">
            {Math.round(pct * 100)}% of daily target{recorded === 0 && live > 0 ? " · live" : ""}
          </p>
        </div>

        {/* facts */}
        <div className="w-full flex flex-col gap-3.5 rounded-2xl bg-white/10 px-4 py-4">
          <Fact icon={LoginIcon} label="Punched in" value={clock(value?.today_in)} />
          <Fact
            icon={ScheduleIcon}
            label="Shift timing"
            value={value?.start_time && value?.end_time ? `${clock(value.start_time)} – ${clock(value.end_time)}` : "--"}
          />
          <Fact
            icon={BadgeOutlinedIcon}
            label="Shift code"
            value={value?.shift ? `${value.shift} (${value.division})` : "--"}
          />
        </div>

        <button
          onClick={() => downloadAttendance({ period: moment(date).format("YYYY-MM") })}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#007f86] text-sm font-semibold shadow-lg hover:bg-teal-50 transition-colors cursor-pointer disabled:opacity-70 whitespace-nowrap"
        >
          {isLoading ? <CircularProgress size={16} sx={{ color: "#007f86" }} /> : <FileDownloadIcon sx={{ fontSize: 18 }} />}
          Download {moment(date).format("MMM")}
        </button>
      </div>
    </section>
  );
};

export default TodayHero;
