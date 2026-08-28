import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import SearchInput from "../components/SearchInput";
import DataTable, { type DataTableColumn } from "../components/DataTable";
import Modal from "../components/Modal";
import EmployeeInfoModal from "../components/EmployeeInfoModal";
import { FieldWrap, TextInput, PrimaryButton, SecondaryButton } from "../components/FormControls";
import { ErrorState } from "../components/AsyncState";
import { TableSkeleton } from "../components/Skeleton";
import Pagination, { usePagination } from "../components/Pagination";
import { useToast } from "../components/ToastProvider";
import {
  createStaff,
  fetchStaffList,
  resetStaffPasscode,
  toggleStaff,
  type CreateStaffInput,
} from "../services/mscguardDailyStaff";
import type { DailyStaffListItem } from "../types/mscguardTypes";
import { McGuardApiError } from "../services/mscguardApi";

export default function EmployeeCodes() {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [staff, setStaff] = useState<DailyStaffListItem[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [passcodeReveal, setPasscodeReveal] = useState<{ ref: string; passcode: string } | null>(null);
  const [infoStaff, setInfoStaff] = useState<DailyStaffListItem | null>(null);

  useEffect(() => {
    const handle = setTimeout(load, search ? 400 : 0);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function load() {
    setLoadState("loading");
    try {
      const { staff: rows } = await fetchStaffList({ search });
      setStaff(rows);
      setLoadState("loaded");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoadState("error");
    }
  }

  async function handleToggle(ref: string, wasActive: boolean) {
    try {
      await toggleStaff(ref);
      toast.success(wasActive ? "Staff deactivated." : "Staff activated.");
      load();
    } catch (err) {
      toast.error(err instanceof McGuardApiError ? err.message : "Something went wrong. Please try again.");
    }
  }

  async function handleResetPasscode(ref: string) {
    try {
      const result = await resetStaffPasscode(ref);
      setPasscodeReveal(result);
    } catch (err) {
      toast.error(err instanceof McGuardApiError ? err.message : "Something went wrong. Please try again.");
    }
  }

  const columns: DataTableColumn<DailyStaffListItem>[] = [
    {
      key: "name",
      header: "Name",
      render: (s) => (
        <button type="button" onClick={() => setInfoStaff(s)} className="text-left">
          <div className="text-gray-800 font-medium hover:text-blue-700 hover:underline">{s.name}</div>
          <div className="text-xs text-gray-500">{s.empCode}</div>
        </button>
      ),
    },
    { key: "department", header: "Department", render: (s) => s.department || "—" },
    { key: "designation", header: "Designation", render: (s) => s.designation || "—" },
    { key: "mobile", header: "Mobile", render: (s) => s.mobile },
    {
      key: "status",
      header: "Status",
      render: (s) => (
        <span className={`text-xs font-semibold ${s.isActive ? "text-green-600" : "text-gray-400"}`}>
          {s.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (s) => (
        <div className="flex gap-3 text-xs">
          <button type="button" onClick={() => handleToggle(s.ref, s.isActive)} className="text-blue-700 hover:text-blue-600">
            {s.isActive ? "Deactivate" : "Activate"}
          </button>
          <button type="button" onClick={() => handleResetPasscode(s.ref)} className="text-blue-700 hover:text-blue-600">
            Reset Passcode
          </button>
        </div>
      ),
    },
  ];

  const { pageRows, page, setPage, totalPages, total, pageSize } = usePagination(staff);

  return (
    <div>
      <PageHeader
        eyebrow="Daily Staff"
        title="Employee Codes"
        actions={<PrimaryButton onClick={() => setShowCreate(true)}>+ Add Staff</PrimaryButton>}
      />

      <div className="mb-4 max-w-sm">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name or mobile" />
      </div>

      {loadState === "loading" && <TableSkeleton columns={5} />}
      {loadState === "error" && <ErrorState message={errorMessage} onRetry={load} />}
      {loadState === "loaded" && (
        <>
          <DataTable columns={columns} rows={pageRows} rowKey={(s) => s.ref} emptyMessage="No daily staff registered yet." />
          <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onPageChange={setPage} />
        </>
      )}

      {showCreate && (
        <CreateStaffModal
          onClose={() => setShowCreate(false)}
          onCreated={(result) => {
            setShowCreate(false);
            setPasscodeReveal(result);
            load();
          }}
        />
      )}

      {passcodeReveal && (
        <Modal title="Passcode" onClose={() => setPasscodeReveal(null)} widthClass="max-w-sm">
          <div className="text-sm text-gray-500 mb-2">Share this 5-digit passcode with the staff member.</div>
          <div className="text-3xl font-bold text-gray-800 font-mono tracking-widest mb-6">{passcodeReveal.passcode}</div>
          <PrimaryButton onClick={() => setPasscodeReveal(null)} className="w-full">
            Done
          </PrimaryButton>
        </Modal>
      )}

      {infoStaff && (
        <EmployeeInfoModal
          title={infoStaff.name}
          subtitle={infoStaff.empCode}
          onClose={() => setInfoStaff(null)}
          fields={[
            { label: "Department", value: infoStaff.department || "—" },
            { label: "Designation", value: infoStaff.designation || "—" },
            { label: "Mobile", value: infoStaff.mobile },
            { label: "Email", value: infoStaff.email || "—" },
            { label: "Status", value: infoStaff.isActive ? "Active" : "Inactive" },
            { label: "Currently Inside", value: infoStaff.isInsideNow ? "Yes" : "No" },
          ]}
        />
      )}
    </div>
  );
}

function CreateStaffModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (result: { ref: string; passcode: string }) => void;
}) {
  const toast = useToast();
  const [form, setForm] = useState<CreateStaffInput>({ name: "", mobile: "", email: "", department: "" });
  const [saving, setSaving] = useState(false);

  function set<K extends keyof CreateStaffInput>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const result = await createStaff(form);
      toast.success("Staff created.");
      onCreated(result);
    } catch (err) {
      toast.error(err instanceof McGuardApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title="Add Daily Staff" onClose={onClose}>
      <FieldWrap label="Name" required>
        <TextInput value={form.name} onChange={(e) => set("name", e.target.value)} />
      </FieldWrap>
      <FieldWrap label="Mobile" required>
        <TextInput value={form.mobile} onChange={(e) => set("mobile", e.target.value)} />
      </FieldWrap>
      <FieldWrap label="Email">
        <TextInput type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
      </FieldWrap>
      <FieldWrap label="Department" required>
        <TextInput value={form.department} onChange={(e) => set("department", e.target.value)} />
      </FieldWrap>
      <div className="flex justify-end gap-2 mt-2">
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        <PrimaryButton onClick={handleSave} disabled={!form.name || !form.mobile || !form.department || saving}>
          {saving ? "Creating…" : "Create"}
        </PrimaryButton>
      </div>
    </Modal>
  );
}
