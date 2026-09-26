import { useEffect, useMemo, useState } from "react";
import { Avatar, Box, CircularProgress, IconButton, TableCell, TableRow, Table, TableBody, TableContainer, TableHead } from "@mui/material";
import { useNavigate } from "react-router-dom";
import GroupsIcon from "@mui/icons-material/Groups";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import moment from "moment";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import dayjs from "dayjs";
import EmptyData from "../components/reuseable/EmptyData";
import { StyledTableCell, StyledTableRow } from "./LeaveStatusPage";
import { getTitleStyle } from "../helper/getcolor";
import { useToast } from "../hooks/useToast";
import {
  useGetTeamAttendanceMutation,
  type TeamAttendanceData,
  type TeamAttendanceGroup,
  type TeamAttendanceMember,
} from "../services/teamAttendance";

const GROUPS: { key: TeamAttendanceGroup; label: string; color: string }[] = [
  { key: "present", label: "Present", color: "#16a34a" },
  { key: "wfh", label: "WFH", color: "#0d9488" },
  { key: "half_day", label: "Half day", color: "#0a9b8e" },
  { key: "absent", label: "Absent", color: "#dc2626" },
  { key: "leave", label: "On leave", color: "#ea580c" },
  { key: "off", label: "Off", color: "#6b7280" },
  { key: "other", label: "Mispunch / other", color: "#a16207" },
];
const GROUP_COLOR = Object.fromEntries(GROUPS.map((g) => [g.key, g.color])) as Record<TeamAttendanceGroup, string>;

const timeOnly = (v?: string | null) => {
  if (!v) return "";
  const m = moment(v, "DD-MM-YYYY HH:mm:ss");
  return m.isValid() ? m.format("hh:mm A") : v;
};

// The employee's own calendar labels each day with getTitleStyle(code); the roll call reuses it so the
// two never disagree, and only adds the two codes that exist here alone.
const pillStyle = (code: string) => {
  if (code === "IN") return { bg: "#dcfce7", color: "#166534", label: "In office" };
  if (code === "--") return { bg: "#f3f4f6", color: "#6b7280", label: "No record" };
  return getTitleStyle(code);
};

const StatusPill = ({ code }: { code: string }) => {
  const s = pillStyle(code);
  return (
    <span className="text-[11px] font-bold uppercase rounded-full px-2.5 py-0.5 whitespace-nowrap" style={{ backgroundColor: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
};

const initials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";

const levelTitle = (level: number) => (level <= 1 ? "Direct reports" : `Level ${level}`);
const levelHint = (level: number) =>
  level <= 1 ? "People who report to you" : level === 2 ? "Report to your direct reports" : `${level - 1} levels below you`;

const MemberCard = ({ m, onOpen }: { m: TeamAttendanceMember; onOpen: () => void }) => {
  const color = GROUP_COLOR[m.group];
  return (
    <button
      onClick={onOpen}
      className="group text-left bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(16,24,40,0.05)] p-3.5 flex items-center gap-3 hover:shadow-md hover:border-[#00a0a0]/50 row-hover cursor-pointer"
    >
      <Avatar
        src={m.photo || undefined}
        sx={{
          width: 46,
          height: 46,
          bgcolor: `${color}1f`,
          color,
          fontWeight: 700,
          fontSize: 15,
          boxShadow: `0 0 0 2.5px #fff, 0 0 0 4.5px ${color}`,
        }}
      >
        {initials(m.name)}
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-gray-800 truncate">{m.name}</p>
        <p className="text-[11px] text-gray-400 truncate">{m.emp_code}</p>
        <p className="text-[11px] text-gray-500 tabular-nums mt-0.5 truncate">
          {m.in_time || m.out_time ? (
            <>
              {timeOnly(m.in_time) || "--"} → {timeOnly(m.out_time) || "--"}
              {m.total_time ? ` · ${m.total_time}` : ""}
            </>
          ) : (
            <span className="text-gray-300">No punches</span>
          )}
        </p>
      </div>
      <StatusPill code={m.code} />
    </button>
  );
};

const TeamAttendancePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const today = dayjs().format("YYYY-MM-DD");
  const [date, setDate] = useState(today);
  const [view, setView] = useState<"card" | "table">("card");
  const [filter, setFilter] = useState<TeamAttendanceGroup | "all">("all");
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});
  const [data, setData] = useState<TeamAttendanceData | null>(null);
  const [getTeamAttendance, { isLoading }] = useGetTeamAttendanceMutation();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res: any = await getTeamAttendance(date);
      if (cancelled) return;
      if (res?.data?.code === 200) setData(res.data.data);
      else showToast(res?.data?.message || res?.error?.data?.message || "Could not load the team's attendance", "error");
    })();
    return () => { cancelled = true; };
  }, [date]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data?.members ?? []).filter(
      (m) => (filter === "all" || m.group === filter) && (!q || m.name.toLowerCase().includes(q) || m.emp_code.toLowerCase().includes(q)),
    );
  }, [data, filter, query]);

  // Nested by reporting level: direct reports first, then the people below them.
  const levels = useMemo(() => {
    const map = new Map<number, TeamAttendanceMember[]>();
    shown.forEach((m) => {
      const lvl = m.direct ? 1 : Math.max(2, m.level || 2);
      map.set(lvl, [...(map.get(lvl) ?? []), m]);
    });
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [shown]);

  const shiftDay = (n: number) => setDate(dayjs(date).add(n, "day").format("YYYY-MM-DD"));
  // A person's full month (opens on the month of the day being viewed); their profile is one click away from there.
  const openEmployee = (m: TeamAttendanceMember) => navigate(`/team-attendance/${m.emp_code}?month=${date.slice(0, 7)}`);
  const first = !data && isLoading;
  const toggleLevel = (lvl: number) => setCollapsed((c) => ({ ...c, [lvl]: !c[lvl] }));
  const allCollapsed = levels.length > 0 && levels.every(([lvl]) => collapsed[lvl]);

  const levelSummary = (members: TeamAttendanceMember[]) =>
    GROUPS.map((g) => ({ ...g, count: members.filter((m) => m.group === g.key).length })).filter((g) => g.count > 0);

  return (
    <div className="h-full overflow-y-auto custom-scrollbar-for-menu px-3 py-4 flex flex-col gap-4 [&>*]:flex-shrink-0">
      {/* Hero */}
      <section
        className="relative overflow-hidden rounded-3xl text-white px-5 sm:px-6 py-5"
        style={{ background: "linear-gradient(120deg, #0f2f3a 0%, #0b5563 50%, #00a0a0 100%)" }}
      >
        <div className="pointer-events-none absolute -right-14 -top-20 w-56 h-56 rounded-full border-[24px] border-white/5" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0">
              <GroupsIcon sx={{ fontSize: 26 }} />
            </span>
            <div>
              <p className="text-xl font-bold leading-tight">Team Attendance</p>
              <p className="text-sm text-white/70">
                {dayjs(date).format("dddd, DD MMM YYYY")}
                {data?.is_manager && <span className="ml-2 text-white/90 font-semibold">· {data.team_size} people</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center bg-white rounded-2xl p-1 gap-1 shadow-lg self-start lg:self-auto text-gray-700">
            <IconButton size="small" onClick={() => shiftDay(-1)} title="Previous day"><ChevronLeftIcon fontSize="small" /></IconButton>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDatePicker
                value={dayjs(date)}
                maxDate={dayjs()}
                onAccept={(v) => v && setDate(v.format("YYYY-MM-DD"))}
                format="ddd, DD MMM YYYY"
                slotProps={{
                  textField: { size: "small", variant: "standard", InputProps: { disableUnderline: true }, sx: { width: 200, "& input": { textAlign: "center", fontWeight: 700, fontSize: 13, cursor: "pointer" } } },
                }}
              />
            </LocalizationProvider>
            <IconButton size="small" onClick={() => shiftDay(1)} disabled={date >= today} title="Next day"><ChevronRightIcon fontSize="small" /></IconButton>
            <button
              onClick={() => setDate(today)}
              disabled={date === today}
              className="px-3 h-8 rounded-xl text-xs font-semibold text-[#007f86] bg-[#e0f6f6] hover:brightness-95 transition cursor-pointer disabled:opacity-40 disabled:cursor-default"
            >
              Today
            </button>
          </div>
        </div>

        {/* Summary tiles double as filters */}
        {data?.is_manager && (
          <div className="relative mt-5 flex gap-2 overflow-x-auto pb-0.5 custom-scrollbar-for-menu">
            <button
              onClick={() => setFilter("all")}
              className={`flex-shrink-0 rounded-2xl px-4 py-2.5 text-left transition-all cursor-pointer border ${
                filter === "all" ? "bg-white text-[#007f86] border-white shadow-lg" : "bg-white/10 border-white/10 hover:bg-white/20"
              }`}
            >
              <p className="text-xl font-bold leading-none tabular-nums">{data.team_size}</p>
              <p className={`text-[10px] uppercase tracking-wider mt-1 ${filter === "all" ? "text-[#007f86]/70" : "text-white/60"}`}>Everyone</p>
            </button>
            {GROUPS.filter((g) => data.summary[g.key] > 0).map((g) => {
              const on = filter === g.key;
              return (
                <button
                  key={g.key}
                  onClick={() => setFilter(on ? "all" : g.key)}
                  className={`flex-shrink-0 rounded-2xl px-4 py-2.5 text-left transition-all cursor-pointer border ${
                    on ? "bg-white shadow-lg border-white" : "bg-white/10 border-white/10 hover:bg-white/20"
                  }`}
                  style={on ? { color: g.color } : undefined}
                >
                  <p className="text-xl font-bold leading-none tabular-nums">{data.summary[g.key]}</p>
                  <p className={`text-[10px] uppercase tracking-wider mt-1 whitespace-nowrap ${on ? "opacity-70" : "text-white/60"}`}>{g.label}</p>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {first ? (
        <Box className="w-full flex-1 min-h-[240px] flex items-center justify-center"><CircularProgress sx={{ color: "#00a0a0" }} /></Box>
      ) : !data ? (
        <div className="flex-1 flex items-center justify-center"><EmptyData title="Could not load" subtitle="Please try again in a moment." /></div>
      ) : !data.is_manager ? (
        <div className="flex-1 flex items-center justify-center">
          <EmptyData title="No team to show" subtitle="The attendance of the people who report to you appears here." />
        </div>
      ) : (
        <>
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-white rounded-2xl border border-gray-100 shadow-sm pl-3.5 pr-2 h-10 w-full sm:w-[320px]">
              <SearchIcon sx={{ color: "#00a0a0", fontSize: 19 }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name or employee code"
                className="flex-1 min-w-0 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
              />
              {query && (
                <button onClick={() => setQuery("")} aria-label="Clear search" className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 cursor-pointer">
                  <CloseIcon sx={{ fontSize: 15 }} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {levels.length > 1 && (
                <button
                  onClick={() => setCollapsed(allCollapsed ? {} : Object.fromEntries(levels.map(([l]) => [l, true])))}
                  className="h-10 px-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm text-xs font-semibold text-gray-600 hover:text-[#007f86] cursor-pointer"
                >
                  {allCollapsed ? "Expand all" : "Collapse all"}
                </button>
              )}
              <div className="flex items-center bg-white border border-gray-100 shadow-sm rounded-2xl p-1 gap-0.5">
                {(
                  [
                    { id: "card", icon: GridViewIcon, label: "Cards" },
                    { id: "table", icon: ViewListIcon, label: "Table" },
                  ] as const
                ).map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setView(id)}
                    title={label}
                    aria-label={`${label} view`}
                    className={`w-9 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      view === id ? "text-white bg-gradient-to-r from-[#00a0a0] to-[#007f86] shadow-sm" : "text-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    <Icon sx={{ fontSize: 18 }} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {isLoading && <div className="h-0.5 bg-[#00a0a0]/30 -mt-2 animate-pulse rounded-full" />}

          {levels.length === 0 ? (
            <div className="py-10"><EmptyData title="Nobody here" subtitle="No one in your team matches this filter." /></div>
          ) : (
            <div className="flex flex-col gap-5 pb-2">
              {levels.map(([lvl, members]) => {
                const closed = !!collapsed[lvl];
                const nested = lvl > 1;
                return (
                  <section
                    key={lvl}
                    className="relative"
                    style={nested ? { marginLeft: Math.min(lvl - 1, 3) * 20 } : undefined}
                  >
                    {nested && <span className="absolute -left-4 top-0 bottom-3 w-px bg-[#00a0a0]/25" />}

                    <button
                      onClick={() => toggleLevel(lvl)}
                      className="w-full flex items-center justify-between gap-3 text-left mb-3 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
                          style={{ background: "linear-gradient(135deg, #00a0a0, #007f86)" }}
                        >
                          {nested ? <SubdirectoryArrowRightIcon sx={{ fontSize: 19 }} /> : <GroupsIcon sx={{ fontSize: 19 }} />}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-800 leading-tight">
                            {levelTitle(lvl)}
                            <span className="ml-2 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#e0f6f6] text-[#007f86]">{members.length}</span>
                          </p>
                          <p className="text-[11px] text-gray-400">{levelHint(lvl)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-1.5">
                          {levelSummary(members).map((g) => (
                            <span
                              key={g.key}
                              title={g.label}
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                              style={{ backgroundColor: `${g.color}1a`, color: g.color }}
                            >
                              {g.count} {g.label}
                            </span>
                          ))}
                        </div>
                        <ExpandMoreIcon
                          sx={{ fontSize: 22, color: "#9ca3af", transform: closed ? "rotate(-90deg)" : "none", transition: "transform .2s" }}
                        />
                      </div>
                    </button>

                    {!closed &&
                      (view === "card" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
                          {members.map((m) => (
                            <MemberCard key={m.emp_code} m={m} onOpen={() => openEmployee(m)} />
                          ))}
                        </div>
                      ) : (
                        <TableContainer sx={{ borderRadius: 3, border: "1px solid #f1f5f9", bgcolor: "#fff" }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <StyledTableCell>Employee</StyledTableCell>
                                <StyledTableCell>Status</StyledTableCell>
                                <StyledTableCell>In</StyledTableCell>
                                <StyledTableCell>Out</StyledTableCell>
                                <StyledTableCell>Hours</StyledTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {members.map((m) => (
                                <StyledTableRow key={m.emp_code} onClick={() => openEmployee(m)} sx={{ cursor: "pointer" }}>
                                  <TableCell>
                                    <div className="flex items-center gap-2.5">
                                      <Avatar src={m.photo || undefined} sx={{ width: 30, height: 30, fontSize: 11, bgcolor: `${GROUP_COLOR[m.group]}1f`, color: GROUP_COLOR[m.group], fontWeight: 700 }}>
                                        {initials(m.name)}
                                      </Avatar>
                                      <div>
                                        <p className="text-sm font-semibold text-gray-800 leading-tight">{m.name}</p>
                                        <p className="text-[11px] text-gray-400">{m.emp_code}</p>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell><StatusPill code={m.code} /></TableCell>
                                  <TableCell className="tabular-nums">{timeOnly(m.in_time) || "--"}</TableCell>
                                  <TableCell className="tabular-nums">{timeOnly(m.out_time) || "--"}</TableCell>
                                  <TableCell className="tabular-nums">{m.total_time || "--"}</TableCell>
                                </StyledTableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      ))}
                  </section>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TeamAttendancePage;
