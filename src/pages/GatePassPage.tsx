import { useEffect, useState } from "react";
import { Box, Button, Chip, CircularProgress, Drawer } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import EmptyData from "../components/reuseable/EmptyData";
import GatepassApplyDrawer from "../components/reuseable/GatepassApplyDrawer";
import { useToast } from "../hooks/useToast";
import { useGetMyGatepassesMutation } from "../services/gatepassSelf";

const STATUS_COLOR: Record<string, string> = {
  pending_tl_manager: "#f59e0b",
  pending_hr: "#f59e0b",
  approved_guard: "#16a34a",
  exited: "#1e88e5",
  returned: "#0d9488",
  completed: "#6b7280",
  rejected: "#dc2626",
};

const when = (ms?: number | null) =>
  ms ? new Date(ms).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }) : "";

const ApprovalStep = ({ role, name, status }: { role: string; name?: string; status?: string }) => {
  const done = status === "approved" || status === "force_approved";
  const rejected = status === "rejected";
  const Icon = done ? CheckCircleIcon : rejected ? CancelIcon : HourglassEmptyIcon;
  const color = done ? "#16a34a" : rejected ? "#dc2626" : "#9ca3af";
  return (
    <div className="flex items-center gap-1.5 text-[11px]" title={name || ""}>
      <Icon sx={{ fontSize: 15, color }} />
      <span className="font-semibold text-gray-600">{role}</span>
      {name && <span className="text-gray-400 truncate max-w-[110px]">{name}</span>}
    </div>
  );
};

const GatePassPage = () => {
  const { showToast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [reloadTick, setReloadTick] = useState(0);
  const [getMine, { isLoading }] = useGetMyGatepassesMutation();

  useEffect(() => {
    (async () => {
      const res: any = await getMine();
      if (res?.data?.code === 200) setItems(res.data.data || []);
      else showToast(res?.data?.message || "Could not load your gate passes", "error");
    })();
  }, [reloadTick]);

  return (
    <div className="h-full flex flex-col overflow-hidden px-3 py-4 w-full">
      <div className="flex items-center justify-between gap-2 mb-3 flex-shrink-0 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-1 h-7 rounded-full bg-[#00a0a0]" />
          <ConfirmationNumberIcon sx={{ fontSize: 20, color: "#00a0a0" }} />
          <span className="text-lg font-bold text-gray-800">Gate Pass</span>
          {items.length > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#e0f6f6] text-[#00a0a0] border border-[#00a0a0]/20">
              {items.length} pass{items.length === 1 ? "" : "es"}
            </span>
          )}
        </div>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: "#00a0a0", "&:hover": { bgcolor: "#007f86" } }} onClick={() => setShowNew(true)}>
          New gate pass
        </Button>
      </div>

      {isLoading && items.length === 0 ? (
        <Box className="w-full flex-1 flex items-center justify-center"><CircularProgress sx={{ color: "#00a0a0" }} /></Box>
      ) : items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center"><EmptyData title="No gate passes yet" subtitle="Gate passes you raise will show up here." /></div>
      ) : (
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-1 content-start">
            {items.map((g) => {
              const c = STATUS_COLOR[g.status] || "#607d8b";
              return (
                <div key={g.gp_ref} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{g.subtype === "full_day" ? "Full day" : "Half day"} · {g.will_return ? "returning" : "one way"}</p>
                      <p className="text-[11px] text-gray-400">{g.gp_ref}</p>
                    </div>
                    <Chip size="small" label={g.status_label} sx={{ bgcolor: `${c}1a`, color: c, fontWeight: 700, maxWidth: 220 }} />
                  </div>
                  <div className="text-xs text-gray-600 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
                    <span className="text-gray-400">Exit</span><span>{when(g.expected_exit)}</span>
                    {g.will_return && (<><span className="text-gray-400">Return</span><span>{when(g.expected_return)}</span></>)}
                    {g.exited_at && (<><span className="text-gray-400">Left at</span><span>{when(g.exited_at)}</span></>)}
                    {g.returned_at && (<><span className="text-gray-400">Back at</span><span>{when(g.returned_at)}</span></>)}
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{g.reason}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 border-t border-gray-50">
                    {g.approvals.map((a: any) => <ApprovalStep key={a.role} role={a.role} name={a.name} status={a.status} />)}
                  </div>
                  {g.status === "rejected" && (
                    <p className="text-xs text-red-700 bg-red-50 rounded-lg px-3 py-1.5">
                      Rejected{g.rejected_by ? ` by ${g.rejected_by}` : ""}{g.rejection_reason ? `: ${g.rejection_reason}` : ""}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Drawer anchor="right" open={showNew} onClose={() => setShowNew(false)} PaperProps={{ sx: { width: { xs: "100%", sm: 520 } } }}>
        <GatepassApplyDrawer onClose={() => setShowNew(false)} onApplied={() => { setShowNew(false); setReloadTick((x) => x + 1); }} />
      </Drawer>
    </div>
  );
};

export default GatePassPage;
