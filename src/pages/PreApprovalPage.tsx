import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Drawer } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EmptyData from "../components/reuseable/EmptyData";
import ConfirmationModal from "../components/reuseable/ConfirmationModal";
import PreApprovalDrawer from "../components/reuseable/PreApprovalDrawer";
import { useToast } from "../hooks/useToast";
import {
  useCancelPreApprovalMutation,
  useGetPreApprovalHistoryMutation,
  useRegeneratePreApprovalMutation,
} from "../services/visitorPreApproval";
import { copyText, formatMobile, otpShareMessage, PRE_APPROVAL_STATUS } from "../utils/preApprovalUtils";

const FILTERS = ["all", "pending", "used", "expired", "cancelled"] as const;
const PAGE_SIZE = 20;

const PreApprovalPage = () => {
  const { showToast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [showNew, setShowNew] = useState(false);
  const [reloadTick, setReloadTick] = useState(0);
  const [toCancel, setToCancel] = useState<any | null>(null);
  const [regen, setRegen] = useState<{ visitorName: string; otp: string; ref: string; item: any; date: string; time: string } | null>(null);
  const [busyRef, setBusyRef] = useState<string | null>(null);

  const [getHistory, { isLoading }] = useGetPreApprovalHistoryMutation();
  const [cancelPreApproval] = useCancelPreApprovalMutation();
  const [regeneratePreApproval] = useRegeneratePreApprovalMutation();

  const load = async (pageNo = 1) => {
    const res: any = await getHistory({ page: pageNo, limit: PAGE_SIZE });
    if (!res?.data?.success) return showToast(res?.data?.message || "Could not load your pre-approvals", "error");
    setItems((prev) => (pageNo === 1 ? res.data.data : [...prev, ...res.data.data]));
    setPage(pageNo);
    setTotal(res.data.pagination?.total ?? 0);
    setHasMore(pageNo < (res.data.pagination?.total_pages ?? 1));
  };
  useEffect(() => { load(1); }, [reloadTick]);

  const shown = filter === "all" ? items : items.filter((i) => i.status === filter);

  const confirmCancel = async () => {
    const item = toCancel;
    setToCancel(null);
    if (!item) return;
    setBusyRef(item.ref);
    const res: any = await cancelPreApproval(item.ref);
    setBusyRef(null);
    if (res?.data?.success) {
      showToast(res.data.data?.emailSent ? "Invitation cancelled and the visitor was told" : "Invitation cancelled", "success");
      setReloadTick((x) => x + 1);
    } else showToast(res?.data?.message || res?.error?.data?.message || "Could not cancel the invitation", "error");
  };

  const regenerate = async (item: any) => {
    setBusyRef(item.ref);
    const res: any = await regeneratePreApproval(item.ref);
    setBusyRef(null);
    if (res?.data?.success) {
      // The server restarts the visit window at "now" (IST), so that is the date/time to tell the visitor.
      setRegen({ visitorName: item.visitorName, otp: res.data.data.otp, ref: item.ref, item, date: dayjs().format("DD MMM YYYY"), time: dayjs().format("hh:mm A") });
      setReloadTick((x) => x + 1);
    } else showToast(res?.data?.message || res?.error?.data?.message || "Could not generate a new OTP", "error");
  };

  const copyMessage = async (item: any, otp: string) => {
    const ok = await copyText(otpShareMessage({ visitorName: item.visitorName, expectedDate: item.expectedDate, expectedTime: item.expectedTime, otp }));
    showToast(ok ? "Message copied" : "Could not copy", ok ? "success" : "error");
  };

  return (
    <div className="h-full flex flex-col overflow-hidden px-3 py-4 w-full">
      <div className="flex items-center justify-between gap-2 mb-3 flex-shrink-0 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-1 h-7 rounded-full bg-[#00a0a0]" />
          <ConfirmationNumberIcon sx={{ fontSize: 20, color: "#00a0a0" }} />
          <span className="text-lg font-bold text-gray-800">Gate Pass</span>
          <span className="text-xs text-gray-400 hidden sm:inline">Pre-approve visitors coming to meet you</span>
          {total > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#e0f6f6] text-[#00a0a0] border border-[#00a0a0]/20">{total}</span>
          )}
        </div>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: "#00a0a0", "&:hover": { bgcolor: "#007f86" } }} onClick={() => setShowNew(true)}>
          Pre-approve a visitor
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-3 overflow-x-auto flex-shrink-0">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer capitalize ${
              filter === f ? "text-white bg-gradient-to-r from-[#00a0a0] to-[#007f86] shadow-sm" : "bg-white border border-gray-100 text-gray-500 hover:text-[#007f86] hover:border-[#00a0a0]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading && items.length === 0 ? (
        <Box className="w-full flex-1 flex items-center justify-center"><CircularProgress sx={{ color: "#00a0a0" }} /></Box>
      ) : shown.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <EmptyData
            title={items.length === 0 ? "No pre-approvals yet" : "Nothing here"}
            subtitle={items.length === 0 ? "Visitors you pre-approve will show up here." : "No pre-approval matches this filter."}
          />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 p-1 content-start">
            {shown.map((i) => {
              const st = PRE_APPROVAL_STATUS[i.status] || { label: i.status, color: "#607d8b" };
              const busy = busyRef === i.ref;
              return (
                <div key={i.ref} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{i.visitorName}</p>
                      <p className="text-[11px] text-gray-400">{i.ref}</p>
                    </div>
                    <Chip size="small" label={st.label} sx={{ bgcolor: `${st.color}1a`, color: st.color, fontWeight: 700 }} />
                  </div>
                  <div className="text-xs text-gray-600 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
                    <span className="text-gray-400">When</span><span>{i.expectedDate} · {i.expectedTime}</span>
                    <span className="text-gray-400">Purpose</span><span>{i.purpose}</span>
                    <span className="text-gray-400">Mobile</span><span>{formatMobile(i.mobile)}</span>
                    {i.company && (<><span className="text-gray-400">Company</span><span className="truncate">{i.company}</span></>)}
                    {i.email && (<><span className="text-gray-400">Email</span><span className="truncate">{i.email}</span></>)}
                    {i.checkedInAt && (<><span className="text-gray-400">Checked in</span><span>{i.checkedInAt}{i.checkedInBy ? ` · ${i.checkedInBy}` : ""}</span></>)}
                    {i.checkedOutAt && (<><span className="text-gray-400">Checked out</span><span>{i.checkedOutAt}{i.checkedOutBy ? ` · ${i.checkedOutBy}` : ""}</span></>)}
                  </div>

                  {i.otp && (
                    <div className="flex items-center justify-between rounded-xl bg-[#00a0a0]/10 px-3 py-2">
                      <span className="text-xl font-black tracking-[0.3em] text-[#007f86]">{i.otp}</span>
                      <Button size="small" startIcon={<ContentCopyIcon sx={{ fontSize: 14 }} />} onClick={() => copyMessage(i, i.otp)}>Copy message</Button>
                    </div>
                  )}

                  {(i.status === "pending" || i.status === "expired") && (
                    <div className="flex gap-2 pt-1">
                      {i.status === "expired" && (
                        <Button size="small" variant="outlined" disabled={busy} onClick={() => regenerate(i)}>
                          {busy ? <CircularProgress size={14} /> : "New OTP"}
                        </Button>
                      )}
                      <Button size="small" color="error" variant="outlined" disabled={busy} onClick={() => setToCancel(i)}>Cancel</Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {hasMore && (
            <div className="flex justify-center py-3">
              <Button size="small" variant="outlined" disabled={isLoading} onClick={() => load(page + 1)}>
                {isLoading ? <CircularProgress size={16} /> : "Load more"}
              </Button>
            </div>
          )}
        </div>
      )}

      <Drawer anchor="right" open={showNew} onClose={() => setShowNew(false)} PaperProps={{ sx: { width: { xs: "100%", sm: 520 } } }}>
        <PreApprovalDrawer onClose={() => setShowNew(false)} onCreated={() => setReloadTick((x) => x + 1)} />
      </Drawer>

      <ConfirmationModal
        open={!!toCancel}
        close={() => setToCancel(null)}
        aggree={confirmCancel}
        title="Cancel this invitation?"
        description={toCancel ? `${toCancel.visitorName}'s OTP will stop working${toCancel.email ? " and they will be emailed" : ""}.` : ""}
      />

      <Dialog open={!!regen} onClose={() => setRegen(null)} fullWidth maxWidth="xs">
        <DialogTitle>New OTP generated</DialogTitle>
        <DialogContent>
          <p className="text-sm text-gray-600 mb-3">
            {regen?.visitorName}'s invitation now runs from now for 2 hours. The OTP was sent to them where possible — you can also share it yourself.
          </p>
          <div className="rounded-2xl bg-[#00a0a0]/10 py-4 text-center text-3xl font-black tracking-[0.4em] text-[#007f86] pl-[0.4em]">{regen?.otp}</div>
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<ContentCopyIcon />}
            onClick={() => regen && copyMessage({ ...regen.item, expectedDate: regen.date, expectedTime: regen.time }, regen.otp)}
          >
            Copy message
          </Button>
          <Button variant="contained" onClick={() => setRegen(null)} sx={{ bgcolor: "#00a0a0", "&:hover": { bgcolor: "#007f86" } }}>Done</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PreApprovalPage;
