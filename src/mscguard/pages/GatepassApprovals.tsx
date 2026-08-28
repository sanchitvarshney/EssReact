import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import SearchInput from "../components/SearchInput";
import DataTable, { type DataTableColumn } from "../components/DataTable";
import StatusPill from "../components/StatusPill";
import Drawer from "../components/Drawer";
import { FieldWrap, TextInput, PrimaryButton, SecondaryButton } from "../components/FormControls";
import { ErrorState } from "../components/AsyncState";
import { TableSkeleton } from "../components/Skeleton";
import Pagination, { usePagination } from "../components/Pagination";
import { useToast } from "../components/ToastProvider";
import {
  fetchGatepassList,
  reassignGatepassManager,
  reassignGatepassTl,
  resendGatepassApproval,
} from "../services/mscguardGatepass";
import { lookupEmployeeByCode } from "../services/mscguardHierarchy";
import type { EmployeeGatepassRow } from "../types/mscguardTypes";
import { McGuardApiError } from "../services/mscguardApi";
import { Dates } from "../utils/mscguardDates";

export default function GatepassApprovals() {
  const [rows, setRows] = useState<EmployeeGatepassRow[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<EmployeeGatepassRow | null>(null);

  useEffect(() => {
    const handle = setTimeout(loadRows, query ? 400 : 0);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  async function loadRows() {
    setLoadState("loading");
    try {
      const data = await fetchGatepassList(query);
      setRows(data);
      setLoadState("loaded");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoadState("error");
    }
  }

  const columns: DataTableColumn<EmployeeGatepassRow>[] = [
    { key: "ref", header: "Ref", render: (r) => <span className="text-blue-700 font-mono text-xs">{r.gp_ref}</span> },
    {
      key: "employee",
      header: "Employee",
      render: (r) => (
        <div>
          <div className="text-gray-800 font-medium">{r.employee_name}</div>
          <div className="text-xs text-gray-500">{r.employee_code}</div>
        </div>
      ),
    },
    {
      key: "tl",
      header: "Team Leader",
      render: (r) => (
        <div>
          <StatusPill status={r.tl_status || "pending"} />
          <div className="text-xs text-gray-500 mt-1">{r.tl_name || "—"}</div>
        </div>
      ),
    },
    {
      key: "manager",
      header: "Manager",
      render: (r) => (
        <div>
          <StatusPill status={r.manager_status || "pending"} />
          <div className="text-xs text-gray-500 mt-1">{r.manager_name || "—"}</div>
        </div>
      ),
    },
    {
      key: "hr",
      header: "HR",
      render: (r) => (
        <div>
          <StatusPill status={r.hr_status || "pending"} />
          <div className="text-xs text-gray-500 mt-1">{r.hr_name || "—"}</div>
        </div>
      ),
    },
    { key: "status", header: "Status", render: (r) => <StatusPill status={r.status} /> },
  ];

  const { pageRows, page, setPage, totalPages, total, pageSize } = usePagination(rows);

  return (
    <div>
      <PageHeader eyebrow="Gate Pass" title="Gate Pass Approvals" />

      <div className="mb-4 max-w-sm">
        <SearchInput value={query} onChange={setQuery} placeholder="Search by ref, employee code, or name" />
      </div>

      {loadState === "loading" && <TableSkeleton columns={6} />}
      {loadState === "error" && <ErrorState message={errorMessage} onRetry={loadRows} />}
      {loadState === "loaded" && (
        <>
          <DataTable
            columns={columns}
            rows={pageRows}
            rowKey={(r) => r.gp_ref}
            emptyMessage="No employee gate passes found."
            onRowClick={setSelected}
          />
          <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onPageChange={setPage} />
        </>
      )}

      {selected && (
        <GatepassDetailDrawer
          gp={selected}
          onClose={() => setSelected(null)}
          onChanged={() => {
            setSelected(null);
            loadRows();
          }}
        />
      )}
    </div>
  );
}

function GatepassDetailDrawer({
  gp,
  onClose,
  onChanged,
}: {
  gp: EmployeeGatepassRow;
  onClose: () => void;
  onChanged: () => void;
}) {
  const toast = useToast();
  const [busy, setBusy] = useState<string | null>(null);

  async function run(label: string, successMessage: string, action: () => Promise<unknown>) {
    setBusy(label);
    try {
      await action();
      toast.success(successMessage);
      onChanged();
    } catch (err) {
      toast.error(err instanceof McGuardApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <Drawer title={gp.gp_ref} onClose={onClose} widthClass="max-w-2xl">
      <div className="mb-5">
        <div className="text-gray-800 font-semibold">{gp.employee_name}</div>
        <div className="text-sm text-gray-500">
          {gp.employee_code} · {gp.department || "—"}
        </div>
        <div className="mt-2">
          <StatusPill status={gp.status} />
        </div>
        {gp.created_at && (
          <div className="text-xs text-gray-500 mt-1">Created {Dates.dateTime(gp.created_at)}</div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <ReassignSection
          title="Team Leader"
          status={gp.tl_status}
          currentName={gp.tl_name}
          busy={busy}
          reassignKey="tl-reassign"
          resendKey="tl-resend"
          onReassign={(code, name, email) =>
            run("tl-reassign", "Team Leader reassigned.", () => reassignGatepassTl(gp.gp_ref, code, name, email))
          }
          onResend={() => run("tl-resend", "Notification resent.", () => resendGatepassApproval(gp.gp_ref, "tl"))}
        />

        <ReassignSection
          title="Manager"
          status={gp.manager_status}
          currentName={gp.manager_name}
          busy={busy}
          reassignKey="mgr-reassign"
          resendKey="mgr-resend"
          onReassign={(_code, name, email) =>
            run("mgr-reassign", "Manager reassigned.", () => reassignGatepassManager(gp.gp_ref, name, email))
          }
          onResend={() => run("mgr-resend", "Notification resent.", () => resendGatepassApproval(gp.gp_ref, "manager"))}
        />
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-gray-800">HR</div>
          <div className="text-xs text-gray-500">{gp.hr_name || "Not assigned"}</div>
        </div>
        <div className="flex items-center gap-3">
          <StatusPill status={gp.hr_status || "pending"} />
          <SecondaryButton
            disabled={busy !== null}
            onClick={() => run("hr-resend", "Notification resent.", () => resendGatepassApproval(gp.gp_ref, "hr"))}
          >
            {busy === "hr-resend" ? "Sending…" : "Resend"}
          </SecondaryButton>
        </div>
      </div>
    </Drawer>
  );
}

// Employee-Code-driven reassign block, shared by the Team Leader and Manager
// sections — enter a code, Tab out, Name/Department/Designation come back
// from the Employee API (Name read-only from here on); Email stays editable
// since a reassignment often targets a different email than the one on file.
function ReassignSection({
  title,
  status,
  currentName,
  busy,
  reassignKey,
  resendKey,
  onReassign,
  onResend,
}: {
  title: string;
  status: string | null;
  currentName: string | null;
  busy: string | null;
  reassignKey: string;
  resendKey: string;
  onReassign: (code: string, name: string, email: string) => void;
  onResend: () => void;
}) {
  const toast = useToast();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [deptDesignation, setDeptDesignation] = useState<string | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);

  async function handleCodeBlur() {
    const trimmed = code.trim();
    if (!trimmed) return;
    setIsLookingUp(true);
    try {
      const result = await lookupEmployeeByCode(trimmed);
      if (result) {
        setName(result.fullName);
        setEmail(result.email || email);
        setDeptDesignation([result.department, result.designation].filter(Boolean).join(" · ") || null);
      } else {
        setName("");
        setDeptDesignation(null);
        toast.warning(`No employee found for code "${trimmed}".`);
      }
    } finally {
      setIsLookingUp(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold text-gray-800">{title}</div>
        <StatusPill status={status || "pending"} />
      </div>
      <div className="text-xs text-gray-500 mb-3">{currentName || "Not assigned"}</div>

      <FieldWrap label="Employee Code">
        <TextInput value={code} onChange={(e) => setCode(e.target.value)} onBlur={handleCodeBlur} placeholder="Enter code, then Tab" />
      </FieldWrap>
      <FieldWrap label="Name">
        <TextInput
          value={isLookingUp ? "Looking up…" : name}
          readOnly
          placeholder="Auto-filled from Employee Code"
          className="bg-gray-50 text-gray-500 cursor-not-allowed"
        />
      </FieldWrap>
      {deptDesignation && <div className="text-xs text-gray-400 -mt-3 mb-4">{deptDesignation}</div>}
      <FieldWrap label="Email">
        <TextInput value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" />
      </FieldWrap>
      <div className="flex gap-2">
        <PrimaryButton
          disabled={!code || !name || !email || busy !== null}
          onClick={() => onReassign(code, name, email)}
        >
          {busy === reassignKey ? "Saving…" : "Reassign"}
        </PrimaryButton>
        <SecondaryButton disabled={busy !== null} onClick={onResend}>
          {busy === resendKey ? "Sending…" : "Resend"}
        </SecondaryButton>
      </div>
    </div>
  );
}
