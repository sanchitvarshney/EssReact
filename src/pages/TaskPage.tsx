import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Drawer,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import EmptyData from "../components/reuseable/EmptyData";
import TaskCard from "../components/reuseable/TaskCard";
import CreateTaskDrawer from "../components/reuseable/CreateTaskDrawer";
import TaskDetailDrawer from "../components/reuseable/TaskDetailDrawer";
import { StyledTableCell, StyledTableRow } from "./LeaveStatusPage";
import {
  useGetManagedTasksMutation,
  useGetManagerTaskMetricsMutation,
  useGetMyTaskMetricsMutation,
  useGetMyTasksMutation,
} from "../services/tasks";
import { deadlineText, PRIORITY_COLOR, STATUS_COLOR, statusLabel } from "../utils/taskBoxUtils";

const FILTERS = [
  { value: "", label: "All" },
  { value: "active", label: "Open" },
  { value: "overdue", label: "Overdue" },
  { value: "waiting", label: "Waiting to close" },
  { value: "closed", label: "Closed" },
];

const BOARD_COLUMNS = [
  { id: "todo", label: "To do", color: "#607d8b", statuses: ["Assigned", "Reopened"] },
  { id: "doing", label: "In progress", color: "#1e88e5", statuses: ["InProgress", "Forwarded"] },
  { id: "waiting", label: "Waiting", color: "#8e24aa", statuses: ["Completed", "PendingApproval"] },
  { id: "done", label: "Closed", color: "#2e7d32", statuses: ["Closed", "FinalClosed", "Withdrawn", "Surrendered"] },
];

const TaskPage = () => {
  const [tab, setTab] = useState(0); 
  const [view, setView] = useState<"board" | "card" | "table">("board");
  const [filter, setFilter] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [reloadTick, setReloadTick] = useState(0);

  const [getMyTasks, { isLoading: loadingMine }] = useGetMyTasksMutation();
  const [getMyTaskMetrics] = useGetMyTaskMetricsMutation();
  const [getManagedTasks, { isLoading: loadingManaged }] = useGetManagedTasksMutation();
  const [getManagerTaskMetrics] = useGetManagerTaskMetricsMutation();

  const byMe = tab === 1;
  const loading = byMe ? loadingManaged : loadingMine;

  const load = async () => {
    const listCall: any = byMe ? await getManagedTasks({ filter: filter || undefined }) : await getMyTasks({ filter: filter || undefined });
    if (listCall?.data?.success) setTasks(listCall.data.data?.tasks || []);
    const metricsCall: any = byMe ? await getManagerTaskMetrics() : await getMyTaskMetrics();
    if (metricsCall?.data?.success) setMetrics(metricsCall.data.data);
  };

  useEffect(() => { load(); }, [tab, filter, reloadTick]);

  const groups = useMemo(() => {
    const pick = (statuses: string[]) => tasks.filter((t) => statuses.includes(t.status));
    return BOARD_COLUMNS.map((col) => ({ ...col, items: pick(col.statuses) }));
  }, [tasks]);

  const tiles = [
    { key: "active", label: "Open", value: (metrics?.assigned || 0) + (metrics?.in_progress || 0), color: "#1e88e5", icon: PlayCircleOutlineIcon },
    { key: "overdue", label: "Overdue", value: metrics?.overdue || 0, color: "#e53935", icon: ErrorOutlineIcon },
    { key: "waiting", label: "Waiting", value: metrics?.pending_approval || 0, color: "#8e24aa", icon: HourglassEmptyIcon },
    { key: "closed", label: "Closed", value: metrics?.closed || 0, color: "#2e7d32", icon: TaskAltIcon },
  ];

  const views = [
    { id: "board", label: "Board", icon: ViewKanbanOutlinedIcon },
    { id: "card", label: "Cards", icon: GridViewIcon },
    { id: "table", label: "Table", icon: ViewListIcon },
  ] as const;

  return (
    <div className="h-full flex flex-col overflow-hidden px-3 py-4 w-full gap-3">
      {/* Hero */}
      <section
        className="relative overflow-hidden rounded-3xl text-white p-5 sm:p-6 flex-shrink-0"
        style={{ background: "linear-gradient(120deg, #0f2f3a 0%, #0b5563 50%, #00a0a0 100%)" }}
      >
        <div className="pointer-events-none absolute -right-14 -top-20 w-60 h-60 rounded-full border-[26px] border-white/5" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0">
              <AssignmentIcon sx={{ fontSize: 28 }} />
            </span>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-white/60">Work on your plate</p>
              <p className="text-xl sm:text-2xl font-bold leading-tight">Task Box</p>
              <p className="text-sm text-white/70">
                {byMe ? "Tasks you have assigned to others" : "Tasks assigned to you"} · {tasks.length} shown
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center bg-white/15 rounded-2xl p-1 gap-0.5">
              {["My Tasks", "Assigned by Me"].map((label, idx) => (
                <button
                  key={label}
                  onClick={() => {
                    setTab(idx);
                    setFilter("");
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    tab === idx ? "bg-white text-[#007f86] shadow" : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-[#007f86] text-sm font-semibold shadow-lg hover:bg-teal-50 transition-colors cursor-pointer"
            >
              <AddIcon sx={{ fontSize: 18 }} /> Assign a task
            </button>
          </div>
        </div>
      </section>

      {/* Metric tiles (click to filter) */}
      {metrics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 flex-shrink-0">
          {tiles.map(({ key, label, value, color, icon: Icon }) => {
            const on = filter === key;
            return (
              <button
                key={key}
                onClick={() => setFilter(on ? "" : key)}
                className="flex items-center gap-3 bg-white rounded-2xl border p-3.5 text-left transition-all cursor-pointer hover:shadow-md"
                style={{
                  borderColor: on ? color : "#f3f4f6",
                  boxShadow: on ? `0 0 0 2px ${color}33` : undefined,
                }}
              >
                <span
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${color}14`, color }}
                >
                  <Icon sx={{ fontSize: 22 }} />
                </span>
                <span>
                  <span className="block text-2xl font-bold leading-none tabular-nums" style={{ color }}>
                    {value}
                  </span>
                  <span className="block text-[11px] font-medium text-gray-500 mt-1">{label}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Filter chips + view switch */}
      <div className="flex items-center justify-between gap-3 flex-wrap flex-shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar-for-menu">
          {FILTERS.map((f) => {
            const on = filter === f.value;
            return (
              <button
                key={f.value || "all"}
                onClick={() => setFilter(f.value)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  on
                    ? "text-white bg-gradient-to-r from-[#00a0a0] to-[#007f86] shadow-sm"
                    : "bg-white border border-gray-100 text-gray-500 hover:text-[#007f86] hover:border-[#00a0a0]"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center bg-white border border-gray-100 shadow-sm rounded-2xl p-1 gap-0.5">
          {views.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              title={label}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                view === id
                  ? "text-white bg-gradient-to-r from-[#00a0a0] to-[#007f86] shadow-sm"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Icon sx={{ fontSize: 16 }} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <Box className="w-full flex-1 flex items-center justify-center">
          <CircularProgress sx={{ color: "#00a0a0" }} />
        </Box>
      ) : tasks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <EmptyData
            title="No tasks here"
            subtitle={byMe ? "Tasks you assigned will show up here." : "Tasks assigned to you will show up here."}
          />
        </div>
      ) : view === "board" ? (
        <div className="flex-1 min-h-0 flex gap-3 overflow-x-auto custom-scrollbar-for-menu pb-1">
          {groups.map((col) => (
            <div
              key={col.id}
              className="w-[300px] flex-shrink-0 xl:flex-1 xl:min-w-[260px] flex flex-col rounded-3xl bg-white/70 border border-gray-100 min-h-0"
            >
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                  <span className="text-sm font-bold text-gray-700">{col.label}</span>
                </div>
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${col.color}18`, color: col.color }}
                >
                  {col.items.length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar-for-menu px-3 pb-3 flex flex-col gap-2.5">
                {col.items.length === 0 ? (
                  <p className="text-xs text-gray-300 text-center py-8">Nothing here</p>
                ) : (
                  col.items.map((t) => <TaskCard key={t.id} task={t} onClick={() => setSelectedId(t.id)} />)
                )}
              </div>
            </div>
          ))}
        </div>
      ) : view === "card" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full flex-1 overflow-y-auto p-1 content-start custom-scrollbar-for-menu">
          {tasks.map((t) => (
            <TaskCard key={t.id} task={t} onClick={() => setSelectedId(t.id)} />
          ))}
        </div>
      ) : (
        <TableContainer sx={{ flex: 1, overflow: "auto", borderRadius: 2, border: "1px solid #f3f4f6" }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell>{byMe ? "Assigned To" : "Assigned By"}</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Priority</StyledTableCell>
                <StyledTableCell>Deadline</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((t) => (
                <StyledTableRow key={t.id} sx={{ "&:hover": { backgroundColor: "#f9fafb" } }}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#1f2937" }}>{t.title}</Typography>
                    {t.status === "Forwarded" && t.current_assignee_name && (
                      <Typography variant="caption" sx={{ color: "#1e88e5" }}>With {t.current_assignee_name}</Typography>
                    )}
                  </TableCell>
                  <TableCell>{byMe ? (t.assigned_to_name || t.assigned_to) : t.assigned_by_name}</TableCell>
                  <TableCell>
                    <Chip size="small" label={statusLabel(t.status)} sx={{ bgcolor: `${STATUS_COLOR[t.status] || "#607d8b"}1a`, color: STATUS_COLOR[t.status] || "#607d8b", fontWeight: 600 }} />
                  </TableCell>
                  <TableCell>
                    <Chip size="small" variant="outlined" label={t.priority} sx={{ borderColor: PRIORITY_COLOR[t.priority] || "#999", color: PRIORITY_COLOR[t.priority] || "#999", fontWeight: 600 }} />
                  </TableCell>
                  <TableCell>
                    <span className={Number(t.is_overdue) === 1 ? "text-red-600 font-semibold text-sm" : "text-gray-500 text-sm"}>
                      {Number(t.is_overdue) === 1 ? "Overdue - " : ""}{deadlineText(t)}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    <Button size="small" variant="outlined" onClick={() => setSelectedId(t.id)}>View</Button>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Drawer anchor="right" open={showCreate} onClose={() => setShowCreate(false)} PaperProps={{ sx: { width: { xs: "100%", sm: 560 } } }}>
        <CreateTaskDrawer onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); setReloadTick((x) => x + 1); }} />
      </Drawer>

      <Drawer anchor="right" open={!!selectedId} onClose={() => setSelectedId(null)} PaperProps={{ sx: { width: { xs: "100%", sm: "70vw", md: 680 } } }}>
        {selectedId && (
          <TaskDetailDrawer taskId={selectedId} onClose={() => setSelectedId(null)} onChanged={() => setReloadTick((x) => x + 1)} />
        )}
      </Drawer>
    </div>
  );
};

export default TaskPage;
