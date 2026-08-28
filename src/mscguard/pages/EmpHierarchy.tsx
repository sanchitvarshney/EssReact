import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import SearchInput from "../components/SearchInput";
import DataTable, { type DataTableColumn } from "../components/DataTable";
import Modal from "../components/Modal";
import Drawer from "../components/Drawer";
import EmployeeInfoModal from "../components/EmployeeInfoModal";
import ApprovalLevelsEditor, { emptyApprovalLevel } from "../components/ApprovalLevelsEditor";
import { PrimaryButton, SecondaryButton } from "../components/FormControls";
import { LoadingState, ErrorState } from "../components/AsyncState";
import { TableSkeleton, FormSkeleton } from "../components/Skeleton";
import ConfirmDialog from "../components/ConfirmDialog";
import Pagination, { usePagination } from "../components/Pagination";
import { useToast } from "../components/ToastProvider";
import {
  deleteHierarchy,
  fetchHierarchyDetail,
  fetchHierarchyEmployees,
  lookupEmployeeByCode,
  saveHierarchy,
  searchEmployees,
  type EmployeeLookupResult,
} from "../services/mscguardHierarchy";
import type { EmployeeBasic, EmployeeSearchResult, HierarchyEmployee, MaterialChainLevel } from "../types/mscguardTypes";
import { McGuardApiError } from "../services/mscguardApi";

export default function EmpHierarchy() {
  const [employees, setEmployees] = useState<HierarchyEmployee[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [infoCode, setInfoCode] = useState<string | null>(null);
  const [infoResult, setInfoResult] = useState<EmployeeLookupResult | null>(null);
  const [infoLoading, setInfoLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!infoCode) {
      setInfoResult(null);
      return;
    }
    setInfoLoading(true);
    setInfoResult(null);
    lookupEmployeeByCode(infoCode)
      .then(setInfoResult)
      .finally(() => setInfoLoading(false));
  }, [infoCode]);

  async function load() {
    setLoadState("loading");
    try {
      setEmployees(await fetchHierarchyEmployees());
      setLoadState("loaded");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoadState("error");
    }
  }

  const filtered = employees.filter((e) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return e.full_name.toLowerCase().includes(q) || e.emp_code.toLowerCase().includes(q);
  });

  const columns: DataTableColumn<HierarchyEmployee>[] = [
    {
      key: "name",
      header: "Employee",
      render: (e) => (
        <button
          type="button"
          onClick={(ev) => {
            ev.stopPropagation();
            setInfoCode(e.emp_code);
          }}
          className="text-left"
        >
          <div className="text-gray-800 font-medium hover:text-blue-700 hover:underline">{e.full_name}</div>
          <div className="text-xs text-gray-500">{e.emp_code}</div>
        </button>
      ),
    },
    { key: "department", header: "Department", render: (e) => e.department || "—" },
    {
      key: "levels",
      header: "Approval Levels",
      render: (e) => (
        <span className={e.level_count > 0 ? "text-green-600" : "text-gray-500"}>
          {e.level_count > 0 ? `${e.level_count} configured` : "Not configured"}
        </span>
      ),
    },
  ];

  const { pageRows, page, setPage, totalPages, total, pageSize } = usePagination(filtered);

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Employee & Manager Hierarchy"
        actions={<PrimaryButton onClick={() => setShowAdd(true)}>+ Configure Employee</PrimaryButton>}
      />

      <div className="mb-4 max-w-sm">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name or employee code" />
      </div>

      {loadState === "loading" && <TableSkeleton columns={3} />}
      {loadState === "error" && <ErrorState message={errorMessage} onRetry={load} />}
      {loadState === "loaded" && (
        <>
          <DataTable
            columns={columns}
            rows={pageRows}
            rowKey={(e) => e.emp_code}
            emptyMessage="No employees found."
            onRowClick={(e) => setEditingCode(e.emp_code)}
          />
          <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onPageChange={setPage} />
        </>
      )}

      {showAdd && (
        <EmployeePickerModal
          onClose={() => setShowAdd(false)}
          onPicked={(code) => {
            setShowAdd(false);
            setEditingCode(code);
          }}
        />
      )}

      {editingCode && (
        <HierarchyEditDrawer
          empCode={editingCode}
          onClose={() => setEditingCode(null)}
          onChanged={() => {
            setEditingCode(null);
            load();
          }}
        />
      )}

      {infoCode && (
        <EmployeeInfoModal
          title={infoResult?.fullName || infoCode}
          subtitle={infoCode}
          loading={infoLoading}
          onClose={() => setInfoCode(null)}
          fields={
            infoResult
              ? [
                  { label: "Department", value: infoResult.department || "—" },
                  { label: "Designation", value: infoResult.designation || "—" },
                  { label: "Email", value: infoResult.email || "—" },
                  { label: "Phone", value: infoResult.phone || "—" },
                ]
              : [{ label: "Status", value: "Employee record not found" }]
          }
        />
      )}
    </div>
  );
}

function EmployeePickerModal({ onClose, onPicked }: { onClose: () => void; onPicked: (empCode: string) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<EmployeeSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const handle = setTimeout(async () => {
      setIsSearching(true);
      try {
        setResults(await searchEmployees(query.trim()));
      } finally {
        setIsSearching(false);
      }
    }, 350);
    return () => clearTimeout(handle);
  }, [query]);

  return (
    <Modal title="Find Employee" onClose={onClose} widthClass="max-w-md">
      <SearchInput value={query} onChange={setQuery} placeholder="Search by name or employee code" />
      <div className="mt-4 max-h-72 overflow-y-auto flex flex-col gap-1">
        {isSearching && <LoadingState label="Searching…" />}
        {!isSearching &&
          results.map((r) => (
            <button
              key={r.employeeCode}
              type="button"
              onClick={() => onPicked(r.employeeCode)}
              className="text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <div className="text-gray-800 text-sm font-medium">{r.fullName}</div>
              <div className="text-xs text-gray-500">
                {r.employeeCode} · {r.department || "—"}
              </div>
            </button>
          ))}
      </div>
    </Modal>
  );
}

function HierarchyEditDrawer({
  empCode,
  onClose,
  onChanged,
}: {
  empCode: string;
  onClose: () => void;
  onChanged: () => void;
}) {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<EmployeeBasic | null>(null);
  const [levels, setLevels] = useState<MaterialChainLevel[]>([emptyApprovalLevel(1)]);
  const [saving, setSaving] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    fetchHierarchyDetail(empCode)
      .then(({ employee: emp, levels: existing }) => {
        setEmployee(emp);
        setLevels(existing.length ? existing : [emptyApprovalLevel(1)]);
      })
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : "Could not load employee.");
        onClose();
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empCode]);

  async function handleSave() {
    setSaving(true);
    try {
      await saveHierarchy(empCode, levels);
      toast.success("Approval levels saved.");
      onChanged();
    } catch (err) {
      toast.error(err instanceof McGuardApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleClear() {
    setSaving(true);
    try {
      await deleteHierarchy(empCode);
      toast.success("Approval levels cleared.");
      onChanged();
    } catch (err) {
      toast.error(err instanceof McGuardApiError ? err.message : "Something went wrong. Please try again.");
      setSaving(false);
      setConfirmClear(false);
    }
  }

  return (
    <Drawer title={employee ? `${employee.full_name} (${employee.emp_code})` : empCode} onClose={onClose} widthClass="max-w-2xl">
      {loading ? (
        <FormSkeleton fields={4} />
      ) : (
        <>
          {employee?.department && <div className="text-sm text-gray-500 mb-4">{employee.department}</div>}

          <ApprovalLevelsEditor levels={levels} onChange={setLevels} />

          <div className="mt-6 flex items-center justify-between">
            <button type="button" onClick={() => setConfirmClear(true)} disabled={saving} className="text-red-500 hover:text-red-600 text-sm">
              Clear all levels
            </button>
            <div className="flex gap-2">
              <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
              <PrimaryButton onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </PrimaryButton>
            </div>
          </div>
        </>
      )}

      {confirmClear && (
        <ConfirmDialog
          title="Clear Approval Levels"
          message={`Remove all approval levels for ${employee?.full_name || empCode}? This cannot be undone.`}
          confirmLabel="Clear"
          destructive
          busy={saving}
          onConfirm={handleClear}
          onCancel={() => setConfirmClear(false)}
        />
      )}
    </Drawer>
  );
}
