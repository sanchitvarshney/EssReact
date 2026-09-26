import { useEffect, useState } from "react";
import { Button, Chip, CircularProgress, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ConfirmationModal from "./ConfirmationModal";
import { useGetLoanDetailMutation, useWithdrawLoanMutation } from "../../services/loan";
import { useToast } from "../../hooks/useToast";
import { LOAN_STATUS_COLOR } from "../../utils/loanUtils";

const rupees = (n: number | string) => `₹${Math.round(Number(n) || 0).toLocaleString("en-IN")}`;
const monthLabel = (ym?: string) => (ym ? new Date(`${ym}-01T00:00:00`).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "");
const dateLabel = (v?: string | null) => (v ? new Date(v.replace(" ", "T")).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "");

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-start justify-between gap-4 text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="text-right font-medium text-gray-800">{value}</span>
  </div>
);

const EMI_COLOR: Record<string, string> = { PENDING: "#f59e0b", DEDUCTED: "#16a34a", PREPAID: "#16a34a" };

const LoanDetailDrawer = ({ loanId, onClose, onChanged }: { loanId: number; onClose: () => void; onChanged: () => void }) => {
  const { showToast } = useToast();
  const [data, setData] = useState<any | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [getDetail, { isLoading }] = useGetLoanDetailMutation();
  const [withdrawLoan] = useWithdrawLoanMutation();

  const load = async () => {
    const res: any = await getDetail(loanId);
    if (res?.data?.success) setData(res.data.data);
    else showToast(res?.data?.message || "Could not load this request", "error");
  };
  useEffect(() => { load(); }, [loanId]);

  const doWithdraw = async () => {
    setConfirm(false);
    const res: any = await withdrawLoan(loanId);
    if (res?.data?.success) { showToast("Request withdrawn", "success"); onChanged(); await load(); }
    else showToast(res?.data?.message || res?.error?.data?.message || "Could not withdraw the request", "error");
  };

  const loan = data?.loan;
  const color = loan ? LOAN_STATUS_COLOR[loan.status] || "#607d8b" : "#607d8b";

  return (
    <div className="w-full h-full p-5 flex flex-col gap-4 overflow-y-auto">
      <div className="flex items-center justify-between">
        <Typography variant="h6" className="font-bold">{loan ? `${loan.loan_type_label} · ${loan.ticket_id}` : "Loan request"}</Typography>
        <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
      </div>

      {!loan ? (
        <div className="flex-1 flex items-center justify-center">{isLoading ? <CircularProgress sx={{ color: "#00a0a0" }} /> : null}</div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <Chip label={loan.status_label} sx={{ bgcolor: `${color}1a`, color, fontWeight: 700 }} />
            {data.can_withdraw && <Button size="small" color="error" variant="outlined" onClick={() => setConfirm(true)}>Withdraw</Button>}
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-2">
            <Row label="Amount" value={<b className="tabular-nums">{rupees(loan.approved_amount)}</b>} />
            {loan.approved_amount !== loan.requested_amount && <Row label="You asked for" value={rupees(loan.requested_amount)} />}
            <Row label="Repayment" value={`${loan.tenure_months} month${loan.tenure_months === 1 ? "" : "s"}`} />
            <Row label="Monthly EMI" value={rupees(loan.emi_amount)} />
            <Row label="Total payable" value={rupees(loan.total_payable)} />
            <Row label="Interest" value={loan.interest_rate_pct > 0 ? `${loan.interest_rate_pct}% p.a.` : "Interest-free"} />
            <Row label="Purpose" value={loan.purpose_label} />
            {loan.remark && <Row label="Remark" value={loan.remark} />}
            <Row label="Applied on" value={dateLabel(loan.created_at)} />
            {loan.total_emis > 0 && <Row label="Paid so far" value={`${loan.paid_emis} of ${loan.total_emis} EMIs · outstanding ${rupees(loan.outstanding)}`} />}
          </div>

          {data.schedule?.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                EMI schedule{data.schedule_is_provisional ? " (provisional until approved)" : ""}
              </p>
              <div className="border border-gray-100 rounded-2xl overflow-hidden">
                {data.schedule.map((s: any) => (
                  <div key={s.installment_no} className="flex items-center justify-between px-4 py-2 text-sm border-b last:border-b-0 border-gray-50">
                    <span className="text-gray-600">#{s.installment_no} · {monthLabel(s.due_month)}</span>
                    <span className="flex items-center gap-3">
                      <span className="tabular-nums font-medium">{rupees(s.emi_amount)}</span>
                      <span className="text-[10px] font-bold uppercase w-16 text-right" style={{ color: EMI_COLOR[s.status] || "#6b7280" }}>{s.status === "DEDUCTED" ? "Paid" : s.status === "PREPAID" ? "Prepaid" : "Due"}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.timeline?.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">History</p>
              <div className="flex flex-col gap-2">
                {data.timeline.map((t: any, i: number) => (
                  <div key={i} className="text-sm border-l-2 border-[#00a0a0]/40 pl-3">
                    <p className="font-medium text-gray-800">{String(t.action).replace(/_/g, " ").toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase())}</p>
                    <p className="text-xs text-gray-400">{t.actor_name} · {dateLabel(t.at)}</p>
                    {t.remark && <p className="text-xs text-gray-600 mt-0.5">{t.remark}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <ConfirmationModal
        open={confirm} close={() => setConfirm(false)} aggree={doWithdraw}
        title="Withdraw this request?" description="It will be cancelled and your approvers will be told."
      />
    </div>
  );
};

export default LoanDetailDrawer;
