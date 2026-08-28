import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import DataTable, { type DataTableColumn } from "../components/DataTable";
import StatusPill from "../components/StatusPill";
import Modal from "../components/Modal";
import Drawer from "../components/Drawer";
import ApprovalLevelsEditor, { emptyApprovalLevel } from "../components/ApprovalLevelsEditor";
import { FieldWrap, TextInput, TextArea, PrimaryButton, SecondaryButton } from "../components/FormControls";
import { ErrorState } from "../components/AsyncState";
import { TableSkeleton, FormSkeleton } from "../components/Skeleton";
import ConfirmDialog from "../components/ConfirmDialog";
import Pagination, { usePagination } from "../components/Pagination";
import { useToast } from "../components/ToastProvider";
import {
  createMaterialChain,
  deleteMaterialChain,
  fetchMaterialChain,
  fetchMaterialChains,
  fetchMaterialEntries,
  reassignMaterialEntry,
  resendMaterialEntry,
  updateMaterialChain,
  type MaterialChainInput,
} from "../services/mscguardMaterial";
import type { MaterialChain, MaterialChainLevel, MaterialEntry } from "../types/mscguardTypes";
import { McGuardApiError } from "../services/mscguardApi";
import { Dates } from "../utils/mscguardDates";

const TABS = ["Entries", "Approval Chains"] as const;

export default function MaterialApprovals() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Entries");

  return (
    <div>
      <PageHeader eyebrow="Material" title="Material Approvals" />

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t ? "border-blue-600 text-gray-800" : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Entries" ? <MaterialEntriesTab /> : <MaterialChainsTab />}
    </div>
  );
}

// ── Entries tab ──────────────────────────────────────────────────────────────

function MaterialEntriesTab() {
  const [entries, setEntries] = useState<MaterialEntry[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [selected, setSelected] = useState<MaterialEntry | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoadState("loading");
    try {
      setEntries(await fetchMaterialEntries());
      setLoadState("loaded");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoadState("error");
    }
  }

  const columns: DataTableColumn<MaterialEntry>[] = [
    { key: "ref", header: "Ref", render: (r) => <span className="text-blue-700 font-mono text-xs">{r.entryRef}</span> },
    { key: "direction", header: "Direction", render: (r) => r.flowDirection },
    { key: "item", header: "Item", render: (r) => r.itemDescription },
    { key: "qty", header: "Qty", render: (r) => `${r.itemQty} ${r.qtyUnit || ""}` },
    { key: "requester", header: "Requested By", render: (r) => `${r.requestedBy}${r.deptName ? ` · ${r.deptName}` : ""}` },
    { key: "status", header: "Status", render: (r) => <StatusPill status={r.status || "Pending"} /> },
    { key: "date", header: "Date", render: (r) => Dates.dateTime(r.entryTime) },
  ];

  // usePagination must run on every render regardless of loadState — hooks
  // can't follow the early returns below (Rules of Hooks), so it's called
  // unconditionally here even though its result is unused while loading/erroring.
  const { pageRows, page, setPage, totalPages, total, pageSize } = usePagination(entries);

  if (loadState === "loading") return <TableSkeleton columns={7} />;
  if (loadState === "error") return <ErrorState message={errorMessage} onRetry={load} />;

  return (
    <>
      <DataTable
        columns={columns}
        rows={pageRows}
        rowKey={(r) => r.entryRef}
        emptyMessage="No material entries found."
        onRowClick={(r) => setSelected(r)}
      />
      <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onPageChange={setPage} />
      {selected && (
        <MaterialEntryModal entry={selected} onClose={() => setSelected(null)} onChanged={() => { setSelected(null); load(); }} />
      )}
    </>
  );
}

function MaterialEntryModal({
  entry,
  onClose,
  onChanged,
}: {
  entry: MaterialEntry;
  onClose: () => void;
  onChanged: () => void;
}) {
  const toast = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
    <Modal title={entry.entryRef} onClose={onClose}>
      <div className="mb-5">
        <div className="text-gray-800 font-semibold">{entry.itemDescription}</div>
        <div className="text-sm text-gray-500">
          {entry.itemQty} {entry.qtyUnit} · {entry.flowDirection} · {entry.requestedBy}
        </div>
        <div className="mt-2">
          <StatusPill status={entry.status || "Pending"} />
        </div>
      </div>

      <FieldWrap label="Reassign approver — name">
        <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Approver name" />
      </FieldWrap>
      <FieldWrap label="Reassign approver — email" required>
        <TextInput value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Approver email" />
      </FieldWrap>
      <div className="flex gap-2">
        <PrimaryButton
          disabled={!email || busy !== null}
          onClick={() => run("reassign", "Approver reassigned.", () => reassignMaterialEntry(entry.entryRef, name, email))}
        >
          {busy === "reassign" ? "Saving…" : "Reassign"}
        </PrimaryButton>
        <SecondaryButton
          disabled={busy !== null}
          onClick={() => run("resend", "Notification resent.", () => resendMaterialEntry(entry.entryRef))}
        >
          {busy === "resend" ? "Sending…" : "Resend Notification"}
        </SecondaryButton>
      </div>
    </Modal>
  );
}

// ── Approval Chains tab ──────────────────────────────────────────────────────

function MaterialChainsTab() {
  const [chains, setChains] = useState<MaterialChain[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [editingId, setEditingId] = useState<number | "new" | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoadState("loading");
    try {
      setChains(await fetchMaterialChains());
      setLoadState("loaded");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoadState("error");
    }
  }

  const columns: DataTableColumn<MaterialChain>[] = [
    { key: "name", header: "Chain Name", render: (c) => <span className="text-gray-800 font-medium">{c.chain_name}</span> },
    { key: "type", header: "Material Type", render: (c) => c.material_type || "Any" },
    { key: "range", header: "Amount Range", render: (c) => `${c.min_amount} — ${c.max_amount ?? "∞"}` },
    { key: "default", header: "Default", render: (c) => (c.is_default ? "Yes" : "No") },
  ];

  // See the matching comment in MaterialEntriesTab — must run before the
  // early returns below to keep hook order stable across renders.
  const { pageRows, page, setPage, totalPages, total, pageSize } = usePagination(chains);

  if (loadState === "loading") return <TableSkeleton columns={4} />;
  if (loadState === "error") return <ErrorState message={errorMessage} onRetry={load} />;

  return (
    <>
      <div className="mb-4 flex justify-end">
        <PrimaryButton onClick={() => setEditingId("new")}>+ New Chain</PrimaryButton>
      </div>
      <DataTable
        columns={columns}
        rows={pageRows}
        rowKey={(c) => String(c.id)}
        emptyMessage="No material approval chains configured."
        onRowClick={(c) => setEditingId(c.id)}
      />
      <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onPageChange={setPage} />
      {editingId !== null && (
        <MaterialChainDrawer
          chainId={editingId}
          onClose={() => setEditingId(null)}
          onChanged={() => {
            setEditingId(null);
            load();
          }}
        />
      )}
    </>
  );
}

function MaterialChainDrawer({
  chainId,
  onClose,
  onChanged,
}: {
  chainId: number | "new";
  onClose: () => void;
  onChanged: () => void;
}) {
  const toast = useToast();
  const [loading, setLoading] = useState(chainId !== "new");
  const [chainName, setChainName] = useState("");
  const [materialType, setMaterialType] = useState("");
  const [minAmount, setMinAmount] = useState("0");
  const [maxAmount, setMaxAmount] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [description, setDescription] = useState("");
  const [levels, setLevels] = useState<MaterialChainLevel[]>([emptyApprovalLevel(1)]);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (chainId === "new") return;
    fetchMaterialChain(chainId)
      .then(({ chain, levels: chainLevels }) => {
        setChainName(chain.chain_name);
        setMaterialType(chain.material_type || "");
        setMinAmount(String(chain.min_amount));
        setMaxAmount(chain.max_amount === null ? "" : String(chain.max_amount));
        setIsDefault(!!chain.is_default);
        setDescription(chain.description || "");
        setLevels(chainLevels.length ? chainLevels : [emptyApprovalLevel(1)]);
      })
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : "Could not load chain.");
        onClose();
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId]);

  async function handleSave() {
    setSaving(true);
    const input: MaterialChainInput = {
      chainName,
      materialType: materialType || null,
      minAmount: Number(minAmount) || 0,
      maxAmount: maxAmount === "" ? null : Number(maxAmount),
      isDefault,
      description: description || null,
      levels,
    };
    try {
      if (chainId === "new") await createMaterialChain(input);
      else await updateMaterialChain(chainId, input);
      toast.success(chainId === "new" ? "Approval chain created." : "Approval chain updated.");
      onChanged();
    } catch (err) {
      toast.error(err instanceof McGuardApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (chainId === "new") return;
    setSaving(true);
    try {
      await deleteMaterialChain(chainId);
      toast.success("Approval chain deleted.");
      onChanged();
    } catch (err) {
      toast.error(err instanceof McGuardApiError ? err.message : "Something went wrong. Please try again.");
      setSaving(false);
      setConfirmDelete(false);
    }
  }

  return (
    <Drawer title={chainId === "new" ? "New Approval Chain" : "Edit Approval Chain"} onClose={onClose} widthClass="max-w-2xl">
      {loading ? (
        <FormSkeleton fields={5} />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 gap-x-6">
            <FieldWrap label="Chain Name" required>
              <TextInput value={chainName} onChange={(e) => setChainName(e.target.value)} />
            </FieldWrap>
            <FieldWrap label="Material Type">
              <TextInput
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value)}
                placeholder="Leave blank for any type"
              />
            </FieldWrap>
            <FieldWrap label="Min Amount">
              <TextInput type="number" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} />
            </FieldWrap>
            <FieldWrap label="Max Amount">
              <TextInput type="number" value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} placeholder="No limit" />
            </FieldWrap>
          </div>

          <FieldWrap label="Description">
            <TextArea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </FieldWrap>

          <label className="flex items-center gap-2 text-sm text-gray-600 mb-5 cursor-pointer">
            <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className="accent-blue-700" />
            Use as default chain when no other chain matches
          </label>

          <ApprovalLevelsEditor levels={levels} onChange={setLevels} />

          <div className="mt-6 flex items-center justify-between">
            {chainId !== "new" ? (
              <button type="button" onClick={() => setConfirmDelete(true)} disabled={saving} className="text-red-500 hover:text-red-600 text-sm">
                Delete chain
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
              <PrimaryButton onClick={handleSave} disabled={!chainName || saving}>
                {saving ? "Saving…" : "Save Chain"}
              </PrimaryButton>
            </div>
          </div>
        </>
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Delete Approval Chain"
          message={`Delete "${chainName}"? This cannot be undone.`}
          confirmLabel="Delete"
          destructive
          busy={saving}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </Drawer>
  );
}
