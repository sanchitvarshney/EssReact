import { TableRow, Tooltip, Chip } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import {
  useGetLeaveStatusMutation,
  useRejectLeaveMutation,
} from "../services/Leave";
import { useAuth } from "../contextapi/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import LeaveTabs from "../components/leave/LeaveTabs";
import { useToast } from "../hooks/useToast";
import LeaveStatusPageSkeleton from "../skeleton/LeaveStatusPageSkeleton";
import ConfirmationModal from "../components/reuseable/ConfirmationModal";
import DotLoading from "../components/reuseable/DotLoading";
import CustomToolTip from "../components/reuseable/CustomToolTip";

export const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#f8fafc",
    color: "#475569",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    padding: "10px 16px",
    whiteSpace: "nowrap",
    borderBottom: "2px solid #e2e8f0",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    padding: "12px 16px",
    color: "#374151",
    borderBottom: "1px solid #f3f4f6",
  },
}));

export const StyledTableRow = styled(TableRow)(() => ({
  transition: "background-color 0.15s",
  "&:hover": { backgroundColor: "var(--row-hover-bg)" },
  "&:last-child td, &:last-child th": { border: 0 },
}));

export const getStatus = (status: any) => {
  switch (status) {
    case "APR":
      return (
        <Chip
          label="Approved"
          size="small"
          sx={{ bgcolor: "#dcfce7", color: "#15803d", fontWeight: 700, fontSize: 11, height: 22, "& .MuiChip-icon": { color: "#15803d" } }}
        />
      );
    case "PEN":
      return (
        <Chip
          label="Pending"
          size="small"
          sx={{ bgcolor: "#fef9c3", color: "#854d0e", fontWeight: 700, fontSize: 11, height: 22, "& .MuiChip-icon": { color: "#854d0e" } }}
        />
      );
    case "REJ":
      return (
        <Chip
          label="Rejected"
          size="small"
          sx={{ bgcolor: "#fee2e2", color: "#b91c1c", fontWeight: 700, fontSize: 11, height: 22, "& .MuiChip-icon": { color: "#b91c1c" } }}
        />
      );
    default:
      return (
        <Chip
          label="Withdrawn"
          size="small"
          sx={{ bgcolor: "#dbeafe", color: "#1d4ed8", fontWeight: 700, fontSize: 11, height: 22, "& .MuiChip-icon": { color: "#1d4ed8" } }}
        />
      );
  }
};

const LEAVE_TYPE_COLORS: Record<string, string> = {
  EL: "#00a0a0", SL: "#f59e0b", WFH: "#8b5cf6",
  OD: "#3b82f6", CL: "#10b981", ACL: "#ec4899", LWP: "#ef4444",
};

const STATUS_GROUPS = [
  { id: "all", label: "All" },
  { id: "PEN", label: "Pending" },
  { id: "APR", label: "Approved" },
  { id: "REJ", label: "Rejected" },
  { id: "WD", label: "Withdrawn" },
];

const groupOf = (status: string) => (["PEN", "APR", "REJ"].includes(status) ? status : "WD");

const STATUS_ACCENT: Record<string, string> = {
  PEN: "#f59e0b",
  APR: "#16a34a",
  REJ: "#dc2626",
  WD: "#3b82f6",
};

const leaveColor = (type: string) =>
  Object.entries(LEAVE_TYPE_COLORS).find(([k]) => type?.toUpperCase().includes(k))?.[1] ?? "#94a3b8";

const LeaveStatusPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [trackId, setTrackId] = useState<string>("");
  const [filter, setFilter] = useState("all");

  const [getLeaveStatus, { data, isLoading: leaveStatusLoading, error: leaveStatusError }] =
    useGetLeaveStatusMutation();
  const [rejectLeave, { isLoading: rejectLeaveLoading, isSuccess }] = useRejectLeaveMutation();

  const [isConfirm, setIsConfirm] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      //@ts-ignore
      getLeaveStatus({ empcode: user?.id }).unwrap();
    }
  }, [user, isSuccess]);

  useEffect(() => {
    if (leaveStatusError) {
      showToast(
        //@ts-ignore
        leaveStatusError?.message || leaveStatusError?.data?.message || "An unexpected error occurred.",
        "error",
      );
    }
  }, [leaveStatusError]);

  const handleDelete = () => {
    setIsConfirm(false);
    rejectLeave({ trackid: trackId, status: "PEN", type: "CAN" })
      .then((res) => {
        if (res?.data?.status === "success") showToast(res?.data?.message, "success");
        if (res?.data?.status === "error") showToast(res?.data?.message?.msg, "error");
      })
      .catch((err) => {
        showToast(err?.data?.message?.msg || err?.message || "An unexpected error occurred.", "error");
      });
  };

  const rows: any[] = data?.data ?? [];

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length, PEN: 0, APR: 0, REJ: 0, WD: 0 };
    rows.forEach((r) => (c[groupOf(r.status)] += 1));
    return c;
  }, [rows]);

  const visible = filter === "all" ? rows : rows.filter((r) => groupOf(r.status) === filter);

  if (leaveStatusLoading) return <LeaveStatusPageSkeleton />;

  const stats = [
    { label: "Total", value: counts.all },
    { label: "Pending", value: counts.PEN },
    { label: "Approved", value: counts.APR },
    { label: "Rejected", value: counts.REJ },
  ];

  return (
    <div className="h-full overflow-y-auto custom-scrollbar-for-menu px-3 py-4 flex flex-col gap-4 [&>*]:flex-shrink-0">
      <LeaveTabs />

      {/* Hero */}
      <section
        className="relative overflow-hidden rounded-3xl text-white p-5 sm:p-6"
        style={{ background: "linear-gradient(120deg, #0f2f3a 0%, #0b5563 50%, #00a0a0 100%)" }}
      >
        <div className="pointer-events-none absolute -right-14 -top-20 w-60 h-60 rounded-full border-[26px] border-white/5" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <span className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0">
              <EventBusyIcon sx={{ fontSize: 28 }} />
            </span>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-white/60">Leave & WFH</p>
              <p className="text-xl sm:text-2xl font-bold leading-tight">My leave requests</p>
              <p className="text-sm text-white/70">Track approvals and withdraw pending requests.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="grid grid-cols-4 gap-2">
              {stats.map(({ label, value }) => (
                <div key={label} className="rounded-2xl bg-white/12 border border-white/10 px-4 py-2.5 text-center min-w-[74px]" style={{ backgroundColor: "rgba(255,255,255,0.12)" }}>
                  <p className="text-xl font-bold tabular-nums leading-none">{value}</p>
                  <p className="text-[10px] uppercase tracking-wider text-white/60 mt-1">{label}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/self-service/apply-leave")}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-[#007f86] text-sm font-semibold shadow-lg hover:bg-teal-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              <AddIcon sx={{ fontSize: 18 }} /> Apply leave
            </button>
          </div>
        </div>
      </section>

      {/* Filter chips */}
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar-for-menu pb-0.5">
        {STATUS_GROUPS.map(({ id, label }) => {
          const on = filter === id;
          return (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`flex items-center gap-2 flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                on
                  ? "text-white shadow-md bg-gradient-to-r from-[#00a0a0] to-[#007f86]"
                  : "bg-white border border-gray-100 text-gray-600 hover:border-[#00a0a0] hover:text-[#007f86]"
              }`}
            >
              {label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${on ? "bg-white/25" : "bg-gray-100 text-gray-500"}`}>
                {counts[id]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Requests */}
      {visible.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-gray-200 py-16 flex flex-col items-center gap-3 text-center px-6">
          <span className="w-16 h-16 rounded-full bg-[#e0f6f6] flex items-center justify-center">
            <EventBusyIcon sx={{ fontSize: 30, color: "#00a0a0" }} />
          </span>
          <p className="text-sm font-semibold text-gray-700">
            {rows.length === 0 ? "No leave applications yet" : "Nothing in this status"}
          </p>
          <p className="text-xs text-gray-400 max-w-xs">
            {rows.length === 0
              ? "Your submitted leave requests will appear here."
              : "Try another status filter to see your other requests."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 pb-2">
          {visible.map((row: any) => {
            const group = groupOf(row?.status);
            const accent = STATUS_ACCENT[group];
            const canWithdraw = group === "PEN";
            const busy = rejectLeaveLoading && trackId === row?.trackid;

            return (
              <article
                key={row.trackid}
                className="relative bg-white rounded-3xl border border-gray-100 shadow-[0_1px_4px_rgba(16,24,40,0.05)] overflow-hidden hover:shadow-md transition-shadow"
              >
                <span className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: accent }} />
                <div className="pl-6 pr-5 py-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${leaveColor(row?.leavetype)}1a` }}
                      >
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: leaveColor(row?.leavetype) }} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">{row?.leavetype}</p>
                        <p className="text-[11px] text-gray-400">Requested on {row.regdate}</p>
                      </div>
                    </div>
                    {getStatus(row?.status)}
                  </div>

                  <div className="flex items-center gap-3 flex-wrap rounded-2xl bg-[#f6fafa] px-4 py-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <span>{row.fromdt}</span>
                      <span className="text-gray-300">→</span>
                      <span>{row.todt}</span>
                    </div>
                    <span className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full bg-[#e0f6f6] text-[#007f86] whitespace-nowrap">
                      {row?.totalday}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-[11px] text-gray-400">
                        Reporting to <span className="font-semibold text-gray-600">{row.reportto || "—"}</span>
                      </p>
                      {row?.remark ? (
                        <CustomToolTip title={row?.remark} placement="top">
                          <p className="text-xs text-gray-500 line-clamp-1 max-w-[320px]">“{row.remark}”</p>
                        </CustomToolTip>
                      ) : (
                        <p className="text-xs text-gray-300 italic">No remark</p>
                      )}
                    </div>

                    {busy ? (
                      <DotLoading />
                    ) : (
                      <Tooltip title={canWithdraw ? "Withdraw request" : "Cannot withdraw this request"} placement="left">
                        <span>
                          <button
                            disabled={!canWithdraw}
                            onClick={() => {
                              setTrackId(row?.trackid);
                              setIsConfirm(true);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap"
                          >
                            <UndoIcon sx={{ fontSize: 15 }} /> Withdraw
                          </button>
                        </span>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <ConfirmationModal
        open={isConfirm}
        close={() => setIsConfirm(false)}
        aggree={handleDelete}
        title="Withdraw Leave Request"
        description="Are you sure you want to withdraw this leave application? This action cannot be undone."
      />
    </div>
  );
};

export default LeaveStatusPage;
