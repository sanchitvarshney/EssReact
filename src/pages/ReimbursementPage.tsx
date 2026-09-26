import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Drawer,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmptyData from "../components/reuseable/EmptyData";
import ConfirmationModal from "../components/reuseable/ConfirmationModal";
import NewClaimDrawer from "../components/reuseable/NewClaimDrawer";
import { StyledTableCell, StyledTableRow } from "./LeaveStatusPage";
import { useToast } from "../hooks/useToast";
import { useGetClaimReceiptMutation, useGetMyClaimsMutation, useWithdrawClaimMutation } from "../services/reimbClaims";

const FILTERS = ["", "Pending", "Approved", "Rejected", "On Hold"];
const STATUS_COLOR: Record<string, string> = { Pending: "#f59e0b", Approved: "#16a34a", Rejected: "#dc2626", "On Hold": "#8e24aa" };
const rupees = (n: number | string) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const submittedOn = (v?: string) => (v ? String(v).slice(0, 10).split("-").reverse().join("-") : "");

const StatusChip = ({ status }: { status: string }) => {
  const c = STATUS_COLOR[status] || "#607d8b";
  return <Chip size="small" label={status} sx={{ bgcolor: `${c}1a`, color: c, fontWeight: 700 }} />;
};

const ReimbursementPage = () => {
  const { showToast } = useToast();
  const [status, setStatus] = useState("");
  const [view, setView] = useState<"card" | "table">("card");
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [showNew, setShowNew] = useState(false);
  const [reloadTick, setReloadTick] = useState(0);
  const [toWithdraw, setToWithdraw] = useState<any | null>(null);

  const [getMyClaims, { isLoading }] = useGetMyClaimsMutation();
  const [withdrawClaim] = useWithdrawClaimMutation();
  const [getClaimReceipt] = useGetClaimReceiptMutation();

  const load = async (pageNo = 1) => {
    const res: any = await getMyClaims({ status: status || undefined, page: pageNo, limit: 20 });
    if (!res?.data?.success) return showToast(res?.data?.message || "Could not load your claims", "error");
    setItems((prev) => (pageNo === 1 ? res.data.data : [...prev, ...res.data.data]));
    setPage(pageNo);
    setTotal(res.data.pagination?.total ?? 0);
    setHasMore(pageNo < (res.data.pagination?.total_pages ?? 1));
  };

  useEffect(() => { load(1); }, [status, reloadTick]);

  // Open the tab first (a popup opened after an await gets blocked), then point it at the receipt.
  const openReceipt = async (claim: any, index: number) => {
    const tab = window.open("", "_blank");
    const res: any = await getClaimReceipt({ id: claim.id, index });
    const d = res?.data?.data;
    if (!res?.data?.success || !d) {
      tab?.close();
      return showToast(res?.data?.message || "Could not open the receipt", "error");
    }
    const bytes = Uint8Array.from(atob(d.buffer), (ch) => ch.charCodeAt(0));
    const url = URL.createObjectURL(new Blob([bytes], { type: d.content_type }));
    if (tab) tab.location.href = url;
    else window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  const confirmWithdraw = async () => {
    const claim = toWithdraw;
    setToWithdraw(null);
    if (!claim) return;
    const res: any = await withdrawClaim(claim.claim_ref_id);
    if (res?.data?.success) { showToast("Claim withdrawn", "success"); setReloadTick((x) => x + 1); }
    else showToast(res?.data?.message || res?.error?.data?.message || "Could not withdraw the claim", "error");
  };

  const Receipts = ({ c }: { c: any }) =>
    c.receipt?.length ? (
      <div className="flex flex-wrap gap-1.5">
        {c.receipt.map((_: string, i: number) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); openReceipt(c, i); }}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-gray-200 text-[11px] text-gray-600 hover:border-[#2eacb3] hover:text-[#007f86] cursor-pointer"
          >
            <AttachFileIcon sx={{ fontSize: 12 }} /> Receipt {i + 1}
          </button>
        ))}
      </div>
    ) : <span className="text-xs text-gray-300">No receipts</span>;

  return (
    <div className="h-full flex flex-col overflow-hidden px-3 py-4 w-full">
      <div className="flex items-center justify-between gap-2 mb-3 flex-shrink-0 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-1 h-7 rounded-full bg-[#2eacb3]" />
          <ReceiptLongIcon sx={{ fontSize: 20, color: "#2eacb3" }} />
          <span className="text-lg font-bold text-gray-800">Reimbursement</span>
          {total > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#e0f7fa] text-[#2eacb3] border border-[#2eacb3]/20">
              {total} claim{total === 1 ? "" : "s"}
            </span>
          )}
        </div>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: "#2eacb3", "&:hover": { bgcolor: "#1e8a8f" } }} onClick={() => setShowNew(true)}>
          New claim
        </Button>
      </div>

      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap flex-shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f || "all"}
              onClick={() => setStatus(f)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                status === f ? "text-white bg-gradient-to-r from-[#00a0a0] to-[#007f86] shadow-sm" : "bg-white border border-gray-100 text-gray-500 hover:text-[#007f86] hover:border-[#00a0a0]"
              }`}
            >
              {f || "All"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5">
          <IconButton size="small" onClick={() => setView("card")} sx={{ bgcolor: view === "card" ? "#2eacb31a" : "transparent" }}>
            <GridViewIcon fontSize="small" sx={{ color: view === "card" ? "#2eacb3" : "#9ca3af" }} />
          </IconButton>
          <IconButton size="small" onClick={() => setView("table")} sx={{ bgcolor: view === "table" ? "#2eacb31a" : "transparent" }}>
            <ViewListIcon fontSize="small" sx={{ color: view === "table" ? "#2eacb3" : "#9ca3af" }} />
          </IconButton>
        </div>
      </div>

      {isLoading && items.length === 0 ? (
        <Box className="w-full flex-1 flex items-center justify-center"><CircularProgress sx={{ color: "#2eacb3" }} /></Box>
      ) : items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center"><EmptyData title="No claims yet" subtitle="Claims you submit will show up here." /></div>
      ) : (
        <div className="flex-1 overflow-y-auto min-h-0">
          {view === "card" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-1 content-start">
              {items.map((c) => (
                <div key={c.claim_ref_id} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-sm">{c.category}</p>
                      <p className="text-[11px] text-gray-400">{c.claim_ref_id}</p>
                    </div>
                    <StatusChip status={c.status} />
                  </div>
                  <p className="text-2xl font-bold text-[#007f86] tabular-nums">{rupees(c.amount)}</p>
                  <p className="text-xs text-gray-500 line-clamp-2">{c.description}</p>
                  <p className="text-[11px] text-gray-400">
                    Expense of {c.expense_date} · submitted {submittedOn(c.submitted_on)}
                    {c.requestTo_name ? ` · with ${c.requestTo_name}` : ""}
                  </p>
                  <Receipts c={c} />
                  {c.status === "Pending" && (
                    <div>
                      <Button size="small" color="error" variant="outlined" onClick={() => setToWithdraw(c)}>Withdraw</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <TableContainer sx={{ borderRadius: 2, border: "1px solid #f3f4f6" }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Reference</StyledTableCell>
                    <StyledTableCell>Category</StyledTableCell>
                    <StyledTableCell>Description</StyledTableCell>
                    <StyledTableCell align="right">Amount</StyledTableCell>
                    <StyledTableCell>Expense date</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Receipts</StyledTableCell>
                    <StyledTableCell align="center">Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((c) => (
                    <StyledTableRow key={c.claim_ref_id}>
                      <TableCell><Typography variant="caption">{c.claim_ref_id}</Typography></TableCell>
                      <TableCell>{c.category}</TableCell>
                      <TableCell sx={{ maxWidth: 260 }}><span className="line-clamp-2 text-xs text-gray-600">{c.description}</span></TableCell>
                      <TableCell align="right" className="tabular-nums">{rupees(c.amount)}</TableCell>
                      <TableCell>{c.expense_date}</TableCell>
                      <TableCell><StatusChip status={c.status} /></TableCell>
                      <TableCell><Receipts c={c} /></TableCell>
                      <TableCell align="center">
                        {c.status === "Pending" && <Button size="small" color="error" variant="outlined" onClick={() => setToWithdraw(c)}>Withdraw</Button>}
                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
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
        <NewClaimDrawer onClose={() => setShowNew(false)} onSubmitted={() => { setShowNew(false); setReloadTick((x) => x + 1); }} />
      </Drawer>

      <ConfirmationModal
        open={!!toWithdraw}
        close={() => setToWithdraw(null)}
        aggree={confirmWithdraw}
        title="Withdraw this claim?"
        description={toWithdraw ? `${toWithdraw.category} · ${rupees(toWithdraw.amount)} will be removed. This can't be undone.` : ""}
      />
    </div>
  );
};

export default ReimbursementPage;
