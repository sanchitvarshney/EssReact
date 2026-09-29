import { useMemo } from "react";
import moment from "moment";

type Props = { stats: any; events: any[] };

const TILES = [
  { key: "present", label: "Present", color: "#16a34a", bg: "#f0fdf4" },
  { key: "absent", label: "Absent", color: "#dc2626", bg: "#fef2f2" },
  { key: "mis", label: "Mispunch", color: "#ca8a04", bg: "#fefce8" },
  { key: "srt", label: "Short", color: "#64748b", bg: "#f1f5f9" },
  { key: "late", label: "Late", color: "#ea580c", bg: "#fff7ed" },
];

const LOSS_STATUSES = new Set(["a", "absent", "lwp", "leave without pay"]);

const MonthPulse = ({ stats, events }: Props) => {
  const counts = useMemo(() => {
    const absent = events.filter((e) => String(e.title).toLowerCase() === "a").length;
    return {
      present: Number(stats?.total_present ?? 0),
      absent,
      mis: Number(stats?.total_misspunch ?? 0),
      srt: Number(stats?.srtCount ?? 0),
      late: Number(stats?.lateCount ?? 0),
    };
  }, [stats, events]);


  const { worked, rate } = useMemo(() => {
    const first = events.find((e) => e?.start);
    if (!first) return { worked: 0, rate: 0 };

    const month = moment(first.start);
    const today = moment();
    const daysSoFar = month.isSame(today, "month")
      ? today.date()
      : month.isBefore(today, "month")
        ? month.daysInMonth()
        : 0;
    if (daysSoFar === 0) return { worked: 0, rate: 0 };

    const lost = events.filter((e) => {
      const status = String(e.title).trim().toLowerCase();
      return LOSS_STATUSES.has(status) && !moment(e.start).isAfter(today, "day");
    }).length;

    return { worked: daysSoFar, rate: Math.max(0, Math.round(100 - (lost / daysSoFar) * 100)) };
  }, [events]);

  return (
    <section className="bg-white rounded-3xl border border-gray-100 shadow-[0_1px_4px_rgba(16,24,40,0.05)] p-5 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
      <div className="flex flex-col gap-3 lg:w-[280px] lg:flex-shrink-0">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-gray-400">This month</p>
          <p className="text-2xl font-bold text-gray-800 leading-tight">
            {worked > 0 ? `${rate}%` : "--"}
            <span className="text-xs font-medium text-gray-400 ml-1.5">attendance rate</span>
          </p>
        </div>

        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${rate}%`, background: "linear-gradient(90deg, #00a0a0, #4fd1c5)" }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 flex-1 min-w-0">
        {TILES.map(({ key, label, color, bg }) => (
          <div key={key} className="rounded-2xl px-2 py-3 text-center" style={{ backgroundColor: bg }}>
            <p className="text-lg font-bold tabular-nums leading-none" style={{ color }}>
              {(counts as any)[key]}
            </p>
            <p className="text-[10px] font-medium text-gray-500 mt-1 truncate">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MonthPulse;
