import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Drawer,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import EmptyData from "../components/reuseable/EmptyData";
import TaskCard, { PRIORITY_COLOR, STATUS_COLOR, deadlineText, statusLabel } from "../components/reuseable/TaskCard";
import CreateTaskDrawer from "../components/reuseable/CreateTaskDrawer";
import TaskDetailDrawer from "../components/reuseable/TaskDetailDrawer";
import { StyledTableCell, StyledTableRow } from "./LeaveStatusPage";
import {
  useGetManagedTasksMutation,
  useGetManagerTaskMetricsMutation,
  useGetMyTaskMetricsMutation,
  useGetMyTasksMutation,
} from "../services/tasks";

const FILTERS = [
  { value: "", label: "All" },
  { value: "active", label: "Open" },
  { value: "overdue", label: "Overdue" },
  { value: "waiting", label: "Waiting to close" },
  { value: "closed", label: "Closed" },
];

const MetricTile = ({ label, value, color, onClick }: { label: string; value: number; color: string; onClick: () => void }) => (
  <div onClick={onClick} className="flex-1 min-w-[90px] rounded-xl p-3 cursor-pointer border border-gray-100 hover:shadow-sm transition-shadow" style={{ background: `${color}12` }}>
    <Typography variant="caption" sx={{ color, fontWeight: 700 }}>{label}</Typography>
    <Typography variant="h6" sx={{ color, fontWeight: 700 }}>{value}</Typography>
  </div>
);

const TaskPage = () => {
  const [tab, setTab] = useState(0); // 0 = my tasks, 1 = assigned by me
  const [view, setView] = useState<"card" | "table">("card");
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

  const openList = (f: string) => setFilter(f);

  return (
    <div className="h-[calc(100vh-78px)] flex flex-col overflow-hidden px-3 py-4 w-full">
      {/* Page header - same left-aligned accent-bar style as every other module page */}
      <div className="flex items-center justify-between gap-2 mb-3 flex-shrink-0 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-1 h-7 rounded-full bg-[#2eacb3]" />
          <AssignmentIcon sx={{ fontSize: 20, color: "#2eacb3" }} />
          <span className="text-lg font-bold text-gray-800">Task Box</span>
          {tasks.length > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#e0f7fa] text-[#2eacb3] border border-[#2eacb3]/20">
              {tasks.length} total
            </span>
          )}
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ bgcolor: "#2eacb3", "&:hover": { bgcolor: "#1e8a8f" } }}
          onClick={() => setShowCreate(true)}
        >
          Assign a Task
        </Button>
      </div>

      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap flex-shrink-0">
        <Tabs value={tab} onChange={(_, v) => { setTab(v); setFilter(""); }} sx={{ minHeight: 36 }}>
          <Tab label="My Tasks" sx={{ minHeight: 36, textTransform: "none", fontWeight: 600 }} />
          <Tab label="Assigned by Me" sx={{ minHeight: 36, textTransform: "none", fontWeight: 600 }} />
        </Tabs>
        <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5">
          <IconButton size="small" onClick={() => setView("card")} sx={{ bgcolor: view === "card" ? "#2eacb31a" : "transparent" }}>
            <GridViewIcon fontSize="small" sx={{ color: view === "card" ? "#2eacb3" : "#9ca3af" }} />
          </IconButton>
          <IconButton size="small" onClick={() => setView("table")} sx={{ bgcolor: view === "table" ? "#2eacb31a" : "transparent" }}>
            <ViewListIcon fontSize="small" sx={{ color: view === "table" ? "#2eacb3" : "#9ca3af" }} />
          </IconButton>
        </div>
      </div>

      {metrics && (
        <div className="flex gap-2 mb-3 flex-wrap flex-shrink-0">
          <MetricTile label="Open" value={(metrics.assigned || 0) + (metrics.in_progress || 0)} color="#1e88e5" onClick={() => openList("active")} />
          <MetricTile label="Overdue" value={metrics.overdue || 0} color="#e53935" onClick={() => openList("overdue")} />
          <MetricTile label="Waiting" value={metrics.pending_approval || 0} color="#8e24aa" onClick={() => openList("waiting")} />
          <MetricTile label="Closed" value={metrics.closed || 0} color="#2e7d32" onClick={() => openList("closed")} />
        </div>
      )}

      <div className="mb-3 w-full sm:w-56 flex-shrink-0">
        <TextField select size="small" fullWidth label="Filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
          {FILTERS.map((f) => <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>)}
        </TextField>
      </div>

      {loading ? (
        <Box className="w-full flex-1 flex items-center justify-center"><CircularProgress sx={{ color: "#2eacb3" }} /></Box>
      ) : tasks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center"><EmptyData title="No tasks here" subtitle={byMe ? "Tasks you assigned will show up here." : "Tasks assigned to you will show up here."} /></div>
      ) : view === "card" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full flex-1 overflow-y-auto p-2 content-start">
          {tasks.map((t) => <TaskCard key={t.id} task={t} onClick={() => setSelectedId(t.id)} />)}
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
