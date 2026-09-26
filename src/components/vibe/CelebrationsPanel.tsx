import { useState } from "react";
import { Avatar } from "@mui/material";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";

type Props = {
  birthdays?: any;
  anniversaries?: any;
  hires?: any;
  absences?: any;
};

const TABS = [
  { id: "birthdays", label: "Birthdays", icon: CakeOutlinedIcon, empty: "No birthdays this month." },
  { id: "anniversaries", label: "Anniversaries", icon: EmojiEventsOutlinedIcon, empty: "No anniversaries this month." },
  { id: "hires", label: "New hires", icon: PersonAddAlt1OutlinedIcon, empty: "No new joinees right now." },
  { id: "away", label: "Away today", icon: FlightTakeoffIcon, empty: "Everyone is in today." },
] as const;

const photoOf = (p?: string) => (p && !String(p).includes("undefined") ? p : undefined);
const list = (v: any): any[] => (Array.isArray(v) ? v : []);

const CelebrationsPanel = ({ birthdays, anniversaries, hires, absences }: Props) => {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("birthdays");

  const data = {
    birthdays: list(birthdays),
    anniversaries: list(anniversaries),
    hires: list(hires),
    away: list(absences),
  };
  const rows = data[tab];
  const current = TABS.find((t) => t.id === tab)!;

  return (
    <section className="bg-white rounded-3xl border border-gray-100 shadow-[0_1px_4px_rgba(16,24,40,0.05)] overflow-hidden">
      <div
        className="px-5 py-4 text-white"
        style={{ background: "linear-gradient(120deg, #0f2f3a 0%, #0b5563 55%, #00a0a0 100%)" }}
      >
        <p className="text-[11px] uppercase tracking-widest text-white/60">Around the office</p>
        <p className="text-base font-bold">Celebrations &amp; people</p>
      </div>

      <div className="grid grid-cols-4 gap-1 p-2 border-b border-gray-50">
        {TABS.map(({ id, label, icon: Icon }) => {
          const on = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              title={label}
              className={`flex flex-col items-center gap-1 py-2 rounded-2xl transition-colors cursor-pointer ${
                on ? "bg-[#e0f6f6] text-[#007f86]" : "text-gray-400 hover:bg-gray-50"
              }`}
            >
              <Icon sx={{ fontSize: 20 }} />
              <span className="text-[10px] font-semibold leading-none">{data[id].length}</span>
            </button>
          );
        })}
      </div>

      <div className="px-4 pt-3 pb-1">
        <p className="text-xs font-bold text-gray-700">{current.label}</p>
      </div>

      <div className="px-4 pb-4 max-h-[420px] overflow-y-auto custom-scrollbar-for-menu">
        {rows.length === 0 ? (
          <p className="text-xs text-gray-400 py-8 text-center">{current.empty}</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {rows.map((r, i) => {
              const name = r.name ?? r.emp_name;
              const sub =
                tab === "away"
                  ? [r.leave_type, r.date_from, r.will_return ? `Returns ${r.will_return}` : ""]
                      .filter(Boolean)
                      .join(" • ")
                  : r.department;
              const badge = tab === "away" ? null : r.date;
              return (
                <div key={r.time || i} className="flex items-center gap-3 py-2.5 px-2 -mx-2 rounded-xl row-hover">
                  <Avatar
                    src={photoOf(r.photo ?? r.emp_photo)}
                    sx={{ width: 36, height: 36, bgcolor: "#00a0a0", fontSize: 14, fontWeight: 700 }}
                  >
                    {name?.charAt(0)}
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-800 truncate">{name}</p>
                    {sub && <p className="text-[11px] text-gray-400 truncate">{sub}</p>}
                  </div>
                  {badge && (
                    <span className="text-[10px] font-semibold px-2 py-1 rounded-full flex-shrink-0 bg-[#e0f6f6] text-[#007f86]">
                      {badge}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CelebrationsPanel;
