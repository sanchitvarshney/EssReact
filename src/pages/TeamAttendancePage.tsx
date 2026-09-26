import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import GroupsIcon from "@mui/icons-material/Groups";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SearchIcon from "@mui/icons-material/Search";
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

const relation = (m: TeamAttendanceMember) => (m.direct ? "Direct report" : `Level ${m.level}`);

const TeamAttendancePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const today = dayjs().format("YYYY-MM-DD");
  const [date, setDate] = useState(today);
  const [view, setView] = useState<"card" | "table">("card");
  const [filter, setFilter] = useState<TeamAttendanceGroup | "all">("all");
  const [query, setQuery] = useState("");
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

  const shiftDay = (n: number) => setDate(dayjs(date).add(n, "day").format("YYYY-MM-DD"));
  const openEmployee = (m: TeamAttendanceMember) => navigate(`/employee/details/${m.emp_code}`);
  const dateLabel = dayjs(date).format("dddd, DD MMM YYYY");
  const first = !data && isLoading;

  return (
    <div className="h-full flex flex-col overflow-hidden px-3 py-4 w-full">
      <div className="flex items-center justify-between gap-2 mb-3 flex-shrink-0 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-1 h-7 rounded-full bg-[#2eacb3]" />
          <GroupsIcon sx={{ fontSize: 20, color: "#2eacb3" }} />
          <span className="text-lg font-bold text-gray-800">Team Attendance</span>
          {data?.is_manager && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#e0f7fa] text-[#2eacb3] border border-[#2eacb3]/20">
              {data.team_size} people
            </span>
          )}
        </div>

        <div className="flex items-center bg-white border border-gray-100 shadow-sm rounded-2xl p-1 gap-1">
          <IconButton size="small" onClick={() => shiftDay(-1)} title="Previous day"><ChevronLeftIcon fontSize="small" /></IconButton>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              value={dayjs(date)}
              maxDate={dayjs()}
              onAccept={(v) => v && setDate(v.format("YYYY-MM-DD"))}
              format="ddd, DD MMM YYYY"
              slotProps={{
                textField: { size: "small", variant: "standard", InputProps: { disableUnderline: true }, sx: { width: 150, "& input": { textAlign: "center", fontWeight: 700, fontSize: 13, cursor: "pointer" } } },
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

      {first ? (
        <Box className="w-full flex-1 flex items-center justify-center"><CircularProgress sx={{ color: "#2eacb3" }} /></Box>
      ) : !data ? (
        <div className="flex-1 flex items-center justify-center"><EmptyData title="Could not load" subtitle="Please try again in a moment." /></div>
      ) : !data.is_manager ? (
        <div className="flex-1 flex items-center justify-center">
          <EmptyData title="No team to show" subtitle="The attendance of the people who report to you appears here." />
        </div>
      ) : (
        <>
          <Typography variant="caption" sx={{ color: "#6b7280", mb: 1 }} className="flex-shrink-0">{dateLabel}</Typography>

          <div className="flex items-center gap-2 mb-3 flex-wrap flex-shrink-0">
            <Chip
              label={`All · ${data.team_size}`}
              onClick={() => setFilter("all")}
              sx={{ fontWeight: 700, bgcolor: filter === "all" ? "#2eacb3" : "#e0f7fa", color: filter === "all" ? "#fff" : "#2eacb3", "&:hover": { bgcolor: filter === "all" ? "#1e8a8f" : "#c8eef2" } }}
            />
            {GROUPS.filter((g) => data.summary[g.key] > 0).map((g) => (
              <Chip
                key={g.key}
                label={`${g.label} · ${data.summary[g.key]}`}
                onClick={() => setFilter(filter === g.key ? "all" : g.key)}
                sx={{ fontWeight: 700, bgcolor: filter === g.key ? g.color : `${g.color}1a`, color: filter === g.key ? "#fff" : g.color, "&:hover": { bgcolor: filter === g.key ? g.color : `${g.color}30` } }}
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-2 mb-3 flex-wrap flex-shrink-0">
            <TextField
              size="small"
              placeholder="Search name or employee code"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{ width: { xs: "100%", sm: 300 } }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
            />
            <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5">
              <IconButton size="small" onClick={() => setView("card")} sx={{ bgcolor: view === "card" ? "#2eacb31a" : "transparent" }}>
                <GridViewIcon fontSize="small" sx={{ color: view === "card" ? "#2eacb3" : "#9ca3af" }} />
              </IconButton>
              <IconButton size="small" onClick={() => setView("table")} sx={{ bgcolor: view === "table" ? "#2eacb31a" : "transparent" }}>
                <ViewListIcon fontSize="small" sx={{ color: view === "table" ? "#2eacb3" : "#9ca3af" }} />
              </IconButton>
            </div>
          </div>

          {isLoading && <div className="h-0.5 bg-[#2eacb3]/30 mb-1 flex-shrink-0 animate-pulse" />}

          {shown.length === 0 ? (
            <div className="flex-1 flex items-center justify-center"><EmptyData title="Nobody here" subtitle="No one in your team matches this filter." /></div>
          ) : view === "card" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 w-full flex-1 overflow-y-auto p-2 content-start">
              {shown.map((m) => (
                <div
                  key={m.emp_code}
                  onClick={() => openEmployee(m)}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex items-center gap-3 cursor-pointer hover:shadow-md hover:border-[#2eacb3]/40 transition-all"
                >
                  <Avatar src={m.photo || undefined} sx={{ width: 44, height: 44, bgcolor: `${GROUP_COLOR[m.group]}1f`, color: GROUP_COLOR[m.group], fontWeight: 700, fontSize: 15 }}>
                    {initials(m.name)}
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-800 truncate">{m.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{m.emp_code} · {relation(m)}</p>
                    {(m.in_time || m.out_time) && (
                      <p className="text-[11px] text-gray-500 tabular-nums mt-0.5">
                        {timeOnly(m.in_time) || "--"} → {timeOnly(m.out_time) || "--"}
                        {m.total_time ? ` · ${m.total_time}` : ""}
                      </p>
                    )}
                  </div>
                  <StatusPill code={m.code} />
                </div>
              ))}
            </div>
          ) : (
            <TableContainer sx={{ flex: 1, overflow: "auto", borderRadius: 2, border: "1px solid #f3f4f6" }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Employee</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>In</StyledTableCell>
                    <StyledTableCell>Out</StyledTableCell>
                    <StyledTableCell>Hours</StyledTableCell>
                    <StyledTableCell>Reports</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {shown.map((m) => (
                    <StyledTableRow key={m.emp_code} onClick={() => openEmployee(m)} sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#f9fafb" } }}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar src={m.photo || undefined} sx={{ width: 28, height: 28, fontSize: 11, bgcolor: `${GROUP_COLOR[m.group]}1f`, color: GROUP_COLOR[m.group], fontWeight: 700 }}>
                            {initials(m.name)}
                          </Avatar>
                          <div>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: "#1f2937" }}>{m.name}</Typography>
                            <Typography variant="caption" sx={{ color: "#9ca3af" }}>{m.emp_code}</Typography>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><StatusPill code={m.code} /></TableCell>
                      <TableCell className="tabular-nums">{timeOnly(m.in_time) || "--"}</TableCell>
                      <TableCell className="tabular-nums">{timeOnly(m.out_time) || "--"}</TableCell>
                      <TableCell className="tabular-nums">{m.total_time || "--"}</TableCell>
                      <TableCell>{relation(m)}</TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
    </div>
  );
};

export default TeamAttendancePage;
