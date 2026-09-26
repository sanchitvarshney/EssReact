import { useEffect, useState } from "react";
import { Box, Button, Chip, CircularProgress, Drawer } from "@mui/material";
import PaymentsIcon from "@mui/icons-material/Payments";
import EmptyData from "../components/reuseable/EmptyData";
import LoanApplyDrawer from "../components/reuseable/LoanApplyDrawer";
import LoanDetailDrawer from "../components/reuseable/LoanDetailDrawer";
import { useToast } from "../hooks/useToast";
import { useGetLoanPolicyMutation, useGetMyLoansMutation } from "../services/loan";
import { LOAN_STATUS_COLOR } from "../utils/loanUtils";

const rupees = (n: number | string) => `₹${Math.round(Number(n) || 0).toLocaleString("en-IN")}`;
const day = (v?: string) => (v ? String(v).slice(0, 10).split("-").reverse().join("-") : "");

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="flex-1 min-w-[130px] bg-white border border-gray-100 rounded-2xl p-3.5">
    <p className="text-[11px] font-medium text-gray-400">{label}</p>
    <p className="text-lg font-bold text-gray-800 tabular-nums mt-0.5">{value}</p>
  </div>
);

const LoanPage = () => {
  const { showToast } = useToast();
  const [policy, setPolicy] = useState<any | null>(null);
  const [loans, setLoans] = useState<any[]>([]);
  const [applyFor, setApplyFor] = useState<any | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);
  const [reloadTick, setReloadTick] = useState(0);

  const [getPolicy, { isLoading: loadingPolicy }] = useGetLoanPolicyMutation();
  const [getMyLoans, { isLoading: loadingLoans }] = useGetMyLoansMutation();

  useEffect(() => {
    (async () => {
      const [p, l]: any[] = await Promise.all([getPolicy(), getMyLoans({ limit: 50 })]);
      if (p?.data?.success) setPolicy(p.data.data);
      else showToast(p?.data?.message || "Could not load the loan rules", "error");
      if (l?.data?.success) setLoans(l.data.data?.loans || []);
    })();
  }, [reloadTick]);

  const snap = policy?.snapshot;
  const first = !policy && loadingPolicy;

  return (
    <div className="h-full flex flex-col overflow-y-auto px-3 py-4 w-full gap-4">
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-1 h-7 rounded-full bg-[#00a0a0]" />
        <PaymentsIcon sx={{ fontSize: 20, color: "#00a0a0" }} />
        <span className="text-lg font-bold text-gray-800">Loan &amp; Salary Advance</span>
      </div>

      {first ? (
        <Box className="w-full flex-1 flex items-center justify-center"><CircularProgress sx={{ color: "#00a0a0" }} /></Box>
      ) : (
        <>
          {snap && (
            <div className="flex gap-3 flex-wrap flex-shrink-0">
              <Stat label="Service" value={`${snap.service_months} months`} />
              <Stat label="Outstanding" value={rupees(snap.outstanding_total)} />
              <Stat label="Active loans" value={String(snap.active_count)} />
              <Stat label="EMIs per month" value={rupees(snap.active_emi_total)} />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 flex-shrink-0">
            {(policy?.types || []).map((t: any) => (
              <div key={t.type} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-gray-800">{t.label}</p>
                    <p className="text-2xl font-bold text-[#007f86] tabular-nums mt-1">
                      Up to {rupees(t.max_amount)}
                    </p>
                  </div>
                  {t.in_progress && <Chip size="small" label="Request in progress" sx={{ bgcolor: "#f59e0b1a", color: "#b45309", fontWeight: 700 }} />}
                  {!t.in_progress && t.has_active && <Chip size="small" label="Active" sx={{ bgcolor: "#16a34a1a", color: "#166534", fontWeight: 700 }} />}
                </div>
                <ul className="text-xs text-gray-500 list-disc pl-4 space-y-0.5">
                  {(t.rules || []).map((r: string) => <li key={r}>{r}</li>)}
                </ul>
                {!t.eligible && !t.hide_apply && t.blockers?.length > 0 && (
                  <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 space-y-0.5">
                    {t.blockers.map((b: string) => <p key={b}>{b}</p>)}
                  </div>
                )}
                {!t.hide_apply && (
                  <div>
                    <Button
                      variant="contained" disabled={!t.enabled || !t.eligible}
                      onClick={() => setApplyFor(t)}
                      sx={{ bgcolor: "#00a0a0", "&:hover": { bgcolor: "#007f86" } }}
                    >
                      Apply
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex-shrink-0">
            <p className="text-sm font-bold text-gray-700 mb-2">My requests</p>
            {loadingLoans && loans.length === 0 ? (
              <div className="flex justify-center py-6"><CircularProgress size={22} sx={{ color: "#00a0a0" }} /></div>
            ) : loans.length === 0 ? (
              <EmptyData title="No requests yet" subtitle="Loans and advances you apply for will show up here." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {loans.map((l) => {
                  const c = LOAN_STATUS_COLOR[l.status] || "#607d8b";
                  return (
                    <div
                      key={l.id} onClick={() => setOpenId(l.id)}
                      className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-[#00a0a0]/40 transition-all cursor-pointer p-4 flex flex-col gap-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 text-sm">{l.loan_type_label}</p>
                          <p className="text-[11px] text-gray-400">{l.ticket_id}</p>
                        </div>
                        <Chip size="small" label={l.status_label} sx={{ bgcolor: `${c}1a`, color: c, fontWeight: 700, maxWidth: 190 }} />
                      </div>
                      <p className="text-xl font-bold text-[#007f86] tabular-nums">{rupees(l.approved_amount)}</p>
                      <p className="text-[11px] text-gray-400">
                        {l.tenure_months} month{l.tenure_months === 1 ? "" : "s"} · EMI {rupees(l.emi_amount)} · applied {day(l.created_at)}
                      </p>
                      {l.total_emis > 0 && (
                        <p className="text-[11px] text-gray-500">{l.paid_emis} of {l.total_emis} EMIs paid · outstanding {rupees(l.outstanding)}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      <Drawer anchor="right" open={!!applyFor} onClose={() => setApplyFor(null)} PaperProps={{ sx: { width: { xs: "100%", sm: 520 } } }}>
        {applyFor && (
          <LoanApplyDrawer
            type={applyFor} purposes={policy?.purposes || []}
            onClose={() => setApplyFor(null)}
            onApplied={() => { setApplyFor(null); setReloadTick((x) => x + 1); }}
          />
        )}
      </Drawer>

      <Drawer anchor="right" open={!!openId} onClose={() => setOpenId(null)} PaperProps={{ sx: { width: { xs: "100%", sm: 520 } } }}>
        {openId && <LoanDetailDrawer loanId={openId} onClose={() => setOpenId(null)} onChanged={() => setReloadTick((x) => x + 1)} />}
      </Drawer>
    </div>
  );
};

export default LoanPage;
