import { useState, type FormEvent } from "react";
import PageHeader from "../components/PageHeader";
import SearchInput from "../components/SearchInput";
import DataTable, { type DataTableColumn } from "../components/DataTable";
import Modal from "../components/Modal";
import Drawer from "../components/Drawer";
import { FieldWrap, TextInput, TextArea, PrimaryButton, SecondaryButton } from "../components/FormControls";
import { DatePickerField, TimePickerField } from "../components/DatePickerField";
import { LoadingState } from "../components/AsyncState";
import { useToast } from "../components/ToastProvider";
import { createPreApproved, searchPreApproved, type CreatePreApprovedInput } from "../services/mscguardPreApproved";
import { lookupEmployeeByCode, type EmployeeLookupResult } from "../services/mscguardEmployees";
import type { PreApprovedVisitor } from "../types/mscguardTypes";
import { McGuardApiError } from "../services/mscguardApi";
import {
  formatNameInput,
  formatCompanyInput,
  formatEmailInput,
  isValidEmail,
  formatMobileInput,
  isValidMobile,
  nameGuard,
  companyGuard,
  emailGuard,
  mobileGuard,
} from "../../utils/inputFormatters";

export default function PreApprovals() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PreApprovedVisitor[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  async function runSearch(value: string) {
    setQuery(value);
    if (value.trim().length < 2) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    try {
      setResults(await searchPreApproved(value.trim()));
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  const columns: DataTableColumn<PreApprovedVisitor>[] = [
    { key: "name", header: "Visitor", render: (v) => <span className="text-gray-800 font-medium">{v.visitorName}</span> },
    { key: "mobile", header: "Mobile", render: (v) => v.mobile },
    { key: "purpose", header: "Purpose", render: (v) => v.purpose },
    { key: "meet", header: "Meeting", render: (v) => `${v.personToMeet} · ${v.deptName}` },
    { key: "expected", header: "Expected", render: (v) => `${v.expectedDate} ${v.expectedTime}` },
    { key: "status", header: "Status", render: (v) => v.status },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Visitors"
        title="Pre-Approvals"
        actions={<PrimaryButton onClick={() => setShowCreate(true)}>+ New Pre-Approval</PrimaryButton>}
      />

      <div className="mb-4 max-w-sm">
        <SearchInput value={query} onChange={runSearch} placeholder="Search by visitor name or mobile (min 2 chars)" />
      </div>

      {isSearching && <LoadingState label="Searching…" />}
      {!isSearching && query.trim().length >= 2 && (
        <DataTable columns={columns} rows={results} rowKey={(v) => v.ref} emptyMessage="No matching pre-approvals found." />
      )}
      {!isSearching && query.trim().length < 2 && (
        <div className="text-gray-500 text-sm py-16 text-center">
          Type at least 2 characters to search existing pre-approvals, or create a new one.
        </div>
      )}

      {showCreate && (
        <CreatePreApprovalModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
          }}
        />
      )}
    </div>
  );
}

function CreatePreApprovalModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const toast = useToast();
  const [form, setForm] = useState<CreatePreApprovedInput>({
    visitorName: "",
    mobile: "",
    email: "",
    company: "",
    purpose: "",
    personToMeet: "",
    deptName: "",
    expectedDate: "",
    expectedTime: "",
    approvedByName: "",
    remarks: "",
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<{ visitorName: string; otp: string; emailSent: boolean } | null>(null);

  // "Person to Meet" is a company employee — resolved by emp code rather
  // than free-typed, so name/department can't be mistyped or mismatched.
  const [meetEmpCode, setMeetEmpCode] = useState("");
  const [empLookup, setEmpLookup] = useState<
    { status: "idle" } | { status: "loading" } | { status: "found"; data: EmployeeLookupResult } | { status: "not-found" }
  >({ status: "idle" });

  function set<K extends keyof CreatePreApprovedInput>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function resolveEmpCode() {
    const code = meetEmpCode.trim();
    if (!code) {
      setEmpLookup({ status: "idle" });
      set("personToMeet", "");
      set("deptName", "");
      return;
    }
    setEmpLookup({ status: "loading" });
    try {
      const emp = await lookupEmployeeByCode(code);
      setEmpLookup({ status: "found", data: emp });
      set("personToMeet", emp.fullName);
      set("deptName", emp.department || "");
    } catch {
      setEmpLookup({ status: "not-found" });
      set("personToMeet", "");
      set("deptName", "");
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (empLookup.status !== "found") {
      toast.error("Enter a valid employee code for Person to Meet first.");
      return;
    }
    if (!isValidMobile(form.mobile)) {
      toast.error("Enter a valid 10-digit mobile number (starting 6-9).");
      return;
    }
    if (form.email && !isValidEmail(form.email)) {
      toast.error("Enter a valid email address.");
      return;
    }
    setSaving(true);
    try {
      const result = await createPreApproved(form);
      toast.success("Pre-approval created.");
      setSuccess(result);
    } catch (err) {
      toast.error(err instanceof McGuardApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (success) {
    return (
      <Modal title="Pre-Approval Created" onClose={onCreated}>
        <div className="text-gray-800 font-semibold mb-2">{success.visitorName} has been pre-approved.</div>
        <div className="text-sm text-gray-500 mb-1">
          OTP: <span className="text-gray-800 font-mono">{success.otp}</span>
        </div>
        <div className="text-sm text-gray-500 mb-6">
          {success.emailSent ? "The OTP was emailed to the visitor." : "No email was sent — share the OTP manually."}
        </div>
        <PrimaryButton onClick={onCreated}>Done</PrimaryButton>
      </Modal>
    );
  }

  return (
    <Drawer title="New Pre-Approval" onClose={onClose} widthClass="max-w-xl">
      <form onSubmit={handleSubmit}>
        <div className="grid sm:grid-cols-2 gap-x-6">
          <FieldWrap label="Visitor Name" required>
            <TextInput required value={form.visitorName} onChange={(e) => set("visitorName", formatNameInput(e.target.value))} {...nameGuard} />
          </FieldWrap>
          <FieldWrap label="Mobile" required>
            <TextInput
              required
              value={form.mobile}
              onChange={(e) => set("mobile", formatMobileInput(e.target.value))}
              maxLength={10}
              {...mobileGuard}
            />
          </FieldWrap>
          <FieldWrap label="Email">
            <TextInput type="email" value={form.email} onChange={(e) => set("email", formatEmailInput(e.target.value))} {...emailGuard} />
          </FieldWrap>
          <FieldWrap label="Company">
            <TextInput value={form.company} onChange={(e) => set("company", formatCompanyInput(e.target.value))} {...companyGuard} />
          </FieldWrap>
          <FieldWrap label="Purpose" required>
            <TextInput required value={form.purpose} onChange={(e) => set("purpose", e.target.value)} />
          </FieldWrap>
          <FieldWrap label="Person to Meet — Emp Code" required>
            <TextInput
              required
              value={meetEmpCode}
              onChange={(e) => {
                setMeetEmpCode(e.target.value);
                setEmpLookup({ status: "idle" });
              }}
              onBlur={resolveEmpCode}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  resolveEmpCode();
                }
              }}
              placeholder="e.g. MS0014"
            />
          </FieldWrap>
          <div className="sm:col-span-2 -mt-2 mb-3">
            {empLookup.status === "loading" && <p className="text-xs text-gray-500">Looking up employee…</p>}
            {empLookup.status === "not-found" && (
              <p className="text-xs text-red-600 font-medium">Employee code not found.</p>
            )}
            {empLookup.status === "found" && (
              <div className="text-xs bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2 grid sm:grid-cols-2 gap-x-4 gap-y-1">
                <span><span className="text-gray-500">Name:</span> <span className="font-medium text-gray-800">{empLookup.data.fullName}</span></span>
                <span><span className="text-gray-500">Department:</span> <span className="font-medium text-gray-800">{empLookup.data.department || "—"}</span></span>
                <span><span className="text-gray-500">Designation:</span> <span className="font-medium text-gray-800">{empLookup.data.designation || "—"}</span></span>
                <span><span className="text-gray-500">Email:</span> <span className="font-medium text-gray-800">{empLookup.data.email || "—"}</span></span>
                <span><span className="text-gray-500">Mobile:</span> <span className="font-medium text-gray-800">{empLookup.data.phone || "—"}</span></span>
              </div>
            )}
          </div>
          <FieldWrap label="Approved By" required>
            <TextInput required value={form.approvedByName} onChange={(e) => set("approvedByName", formatNameInput(e.target.value))} {...nameGuard} />
          </FieldWrap>
          <FieldWrap label="Expected Date" required>
            <DatePickerField value={form.expectedDate} onChange={(v) => set("expectedDate", v)} />
          </FieldWrap>
          <FieldWrap label="Expected Time" required>
            <TimePickerField value={form.expectedTime} onChange={(v) => set("expectedTime", v)} />
          </FieldWrap>
        </div>
        <FieldWrap label="Remarks">
          <TextArea value={form.remarks} onChange={(e) => set("remarks", e.target.value)} rows={2} />
        </FieldWrap>
        <div className="flex justify-end gap-2 mt-2">
          <SecondaryButton type="button" onClick={onClose}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" disabled={saving}>
            {saving ? "Creating…" : "Create Pre-Approval"}
          </PrimaryButton>
        </div>
      </form>
    </Drawer>
  );
}
