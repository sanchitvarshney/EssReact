import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import SearchInput from "../components/SearchInput";
import DataTable, { type DataTableColumn } from "../components/DataTable";
import Drawer from "../components/Drawer";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import { FieldWrap, TextInput, PrimaryButton, SecondaryButton } from "../components/FormControls";
import { ErrorState } from "../components/AsyncState";
import { TableSkeleton, FormSkeleton } from "../components/Skeleton";
import Pagination, { usePagination } from "../components/Pagination";
import { useToast } from "../components/ToastProvider";
import {
  blockGuard,
  fetchGuard,
  fetchGuardActivity,
  fetchGuards,
  forceLogoutGuard,
  registerGuard,
  resetGuardPassword,
  unblockGuard,
  updateGuard,
} from "../services/mscguardGuards";
import type { Guard, GuardActivityEvent } from "../types/mscguardTypes";
import { McGuardApiError } from "../services/mscguardApi";
import { Dates } from "../utils/mscguardDates";

export default function Guards() {
  const [search, setSearch] = useState("");
  const [guards, setGuards] = useState<Guard[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  useEffect(() => {
    const handle = setTimeout(load, search ? 400 : 0);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function load() {
    setLoadState("loading");
    try {
      setGuards(await fetchGuards(search));
      setLoadState("loaded");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoadState("error");
    }
  }

  const columns: DataTableColumn<Guard>[] = [
    {
      key: "name",
      header: "Guard",
      render: (g) => (
        <div>
          <div className="text-gray-800 font-medium">{g.fullName}</div>
          <div className="text-xs text-gray-500">{g.userCode} · {g.username}</div>
        </div>
      ),
    },
    { key: "mobile", header: "Mobile", render: (g) => g.mobile || "—" },
    { key: "gate", header: "Gate", render: (g) => g.gateNumber || "—" },
    {
      key: "status",
      header: "Status",
      render: (g) => (
        <span className={`text-xs font-semibold ${g.isActive ? "text-green-600" : "text-red-500"}`}>
          {g.isActive ? "Active" : "Blocked"}
        </span>
      ),
    },
  ];

  const { pageRows, page, setPage, totalPages, total, pageSize } = usePagination(guards);

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Guards"
        actions={<PrimaryButton onClick={() => setShowRegister(true)}>+ Register Guard</PrimaryButton>}
      />

      <div className="mb-4 max-w-sm">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name, code, or mobile" />
      </div>

      {loadState === "loading" && <TableSkeleton columns={4} />}
      {loadState === "error" && <ErrorState message={errorMessage} onRetry={load} />}
      {loadState === "loaded" && (
        <>
          <DataTable
            columns={columns}
            rows={pageRows}
            rowKey={(g) => g.userCode}
            emptyMessage="No guards registered yet."
            onRowClick={(g) => setSelectedCode(g.userCode)}
          />
          <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onPageChange={setPage} />
        </>
      )}

      {showRegister && (
        <RegisterGuardDrawer
          onClose={() => setShowRegister(false)}
          onRegistered={() => {
            setShowRegister(false);
            load();
          }}
        />
      )}

      {selectedCode && (
        <GuardDetailDrawer
          userCode={selectedCode}
          onClose={() => setSelectedCode(null)}
          onChanged={() => {
            load();
          }}
        />
      )}
    </div>
  );
}

// ── Register ─────────────────────────────────────────────────────────────────

function RegisterGuardDrawer({ onClose, onRegistered }: { onClose: () => void; onRegistered: () => void }) {
  const toast = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [gateNumber, setGateNumber] = useState("");
  const [managerMobile, setManagerMobile] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await registerGuard({ username, password, fullName, email, mobile, gateNumber, managerMobile });
      toast.success("Guard registered.");
      onRegistered();
    } catch (err) {
      toast.error(err instanceof McGuardApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Drawer title="Register New Guard" onClose={onClose} widthClass="max-w-xl">
      <div className="grid sm:grid-cols-2 gap-x-6">
        <FieldWrap label="Full Name" required>
          <TextInput value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </FieldWrap>
        <FieldWrap label="Username" required>
          <TextInput value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="off" />
        </FieldWrap>
        <FieldWrap label="Password" required>
          <TextInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
        </FieldWrap>
        <FieldWrap label="Email">
          <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </FieldWrap>
        <FieldWrap label="Mobile">
          <TextInput value={mobile} onChange={(e) => setMobile(e.target.value)} />
        </FieldWrap>
        <FieldWrap label="Gate Number">
          <TextInput value={gateNumber} onChange={(e) => setGateNumber(e.target.value)} placeholder="e.g. Gate 2" />
        </FieldWrap>
        <FieldWrap label="Manager Mobile">
          <TextInput value={managerMobile} onChange={(e) => setManagerMobile(e.target.value)} />
        </FieldWrap>
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        <PrimaryButton onClick={handleSave} disabled={!username || !password || !fullName || saving}>
          {saving ? "Registering…" : "Register"}
        </PrimaryButton>
      </div>
    </Drawer>
  );
}

// ── Detail ───────────────────────────────────────────────────────────────────

const ACTIVITY_LABELS: Record<string, string> = {
  REGISTERED: "Registered",
  PROFILE_UPDATED: "Profile updated",
  EMAIL_UPDATED: "Email updated",
  GATE_ALLOTTED: "Gate allotted",
  MANAGER_MOBILE_UPDATED: "Manager mobile updated",
  PASSWORD_RESET: "Password reset",
  BLOCKED: "Account blocked",
  UNBLOCKED: "Account unblocked",
  FORCE_LOGOUT: "Force-logged out",
  GATE_EXIT: "Gate exit recorded",
  GATE_ENTRY: "Gate entry recorded",
  MATERIAL_IN: "Material In recorded",
  MATERIAL_OUT: "Material Out recorded",
  STAFF_INWARD: "Staff marked inward",
  STAFF_OUTWARD: "Staff marked outward",
};

function GuardDetailDrawer({
  userCode,
  onClose,
  onChanged,
}: {
  userCode: string;
  onClose: () => void;
  onChanged: () => void;
}) {
  const toast = useToast();
  const [tab, setTab] = useState<"profile" | "security" | "activity">("profile");
  const [loading, setLoading] = useState(true);
  const [guard, setGuard] = useState<Guard | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [gateNumber, setGateNumber] = useState("");
  const [managerMobile, setManagerMobile] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [confirmBlock, setConfirmBlock] = useState(false);
  const [confirmForceLogout, setConfirmForceLogout] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [busyAction, setBusyAction] = useState(false);

  const [activity, setActivity] = useState<GuardActivityEvent[]>([]);
  const [activityLoaded, setActivityLoaded] = useState(false);

  useEffect(() => {
    fetchGuard(userCode)
      .then((g) => {
        setGuard(g);
        setFullName(g.fullName);
        setEmail(g.email || "");
        setMobile(g.mobile || "");
        setGateNumber(g.gateNumber || "");
        setManagerMobile(g.managerMobile || "");
      })
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : "Could not load guard.");
        onClose();
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCode]);

  useEffect(() => {
    if (tab !== "activity" || activityLoaded) return;
    fetchGuardActivity(userCode)
      .then(setActivity)
      .catch(() => {})
      .finally(() => setActivityLoaded(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  async function handleSaveProfile() {
    setSavingProfile(true);
    try {
      const updated = await updateGuard(userCode, { fullName, email, mobile, gateNumber, managerMobile });
      setGuard(updated);
      toast.success("Guard profile updated.");
      onChanged();
      setActivityLoaded(false);
    } catch (err) {
      toast.error(err instanceof McGuardApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleBlockToggle() {
    if (!guard) return;
    setBusyAction(true);
    try {
      if (guard.isActive) {
        await blockGuard(userCode);
        toast.success("Guard blocked.");
      } else {
        await unblockGuard(userCode);
        toast.success("Guard unblocked.");
      }
      setGuard({ ...guard, isActive: !guard.isActive });
      onChanged();
    } catch (err) {
      toast.error(err instanceof McGuardApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusyAction(false);
      setConfirmBlock(false);
    }
  }

  async function handleForceLogout() {
    setBusyAction(true);
    try {
      await forceLogoutGuard(userCode);
      toast.success("Guard's session was ended.");
    } catch (err) {
      toast.error(err instanceof McGuardApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusyAction(false);
      setConfirmForceLogout(false);
    }
  }

  return (
    <Drawer title={guard ? guard.fullName : userCode} onClose={onClose} widthClass="max-w-2xl">
      {loading ? (
        <FormSkeleton fields={5} />
      ) : (
        <>
          <div className="text-xs text-gray-500 mb-4">{userCode}</div>

          <div className="flex gap-2 mb-6 border-b border-gray-200">
            {(["profile", "security", "activity"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px capitalize transition-colors ${
                  tab === t ? "border-blue-600 text-gray-800" : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "profile" && (
            <>
              <div className="grid sm:grid-cols-2 gap-x-6">
                <FieldWrap label="Full Name" required>
                  <TextInput value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </FieldWrap>
                <FieldWrap label="Email">
                  <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </FieldWrap>
                <FieldWrap label="Mobile">
                  <TextInput value={mobile} onChange={(e) => setMobile(e.target.value)} />
                </FieldWrap>
                <FieldWrap label="Gate Number">
                  <TextInput value={gateNumber} onChange={(e) => setGateNumber(e.target.value)} placeholder="e.g. Gate 2" />
                </FieldWrap>
                <FieldWrap label="Manager Mobile">
                  <TextInput value={managerMobile} onChange={(e) => setManagerMobile(e.target.value)} />
                </FieldWrap>
              </div>
              <div className="flex justify-end mt-2">
                <PrimaryButton onClick={handleSaveProfile} disabled={!fullName || savingProfile}>
                  {savingProfile ? "Saving…" : "Save Profile"}
                </PrimaryButton>
              </div>
            </>
          )}

          {tab === "security" && guard && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border border-gray-200 rounded-md px-4 py-3">
                <div>
                  <div className="text-sm font-medium text-gray-800">Reset Password</div>
                  <div className="text-xs text-gray-500">Set a new password for this guard.</div>
                </div>
                <SecondaryButton onClick={() => setShowResetPassword(true)}>Reset</SecondaryButton>
              </div>

              <div className="flex items-center justify-between border border-gray-200 rounded-md px-4 py-3">
                <div>
                  <div className="text-sm font-medium text-gray-800">{guard.isActive ? "Block Account" : "Unblock Account"}</div>
                  <div className="text-xs text-gray-500">
                    {guard.isActive ? "Prevents this guard from logging in or using the app." : "Restores this guard's access."}
                  </div>
                </div>
                <SecondaryButton
                  onClick={() => setConfirmBlock(true)}
                  className={guard.isActive ? "border-red-300 text-red-600 hover:bg-red-50" : ""}
                >
                  {guard.isActive ? "Block" : "Unblock"}
                </SecondaryButton>
              </div>

              <div className="flex items-center justify-between border border-gray-200 rounded-md px-4 py-3">
                <div>
                  <div className="text-sm font-medium text-gray-800">Force Logout</div>
                  <div className="text-xs text-gray-500">Ends this guard's current app session immediately.</div>
                </div>
                <SecondaryButton onClick={() => setConfirmForceLogout(true)}>Force Logout</SecondaryButton>
              </div>
            </div>
          )}

          {tab === "activity" && (
            <>
              {!activityLoaded && <FormSkeleton fields={4} />}
              {activityLoaded && activity.length === 0 && (
                <div className="text-sm text-gray-500 py-8 text-center">No activity recorded yet.</div>
              )}
              {activityLoaded && activity.length > 0 && (
                <ActivityList events={activity} />
              )}
            </>
          )}
        </>
      )}

      {confirmBlock && guard && (
        <ConfirmDialog
          title={guard.isActive ? "Block Guard" : "Unblock Guard"}
          message={
            guard.isActive
              ? `Block ${guard.fullName}? They will be signed out immediately and won't be able to log back in.`
              : `Unblock ${guard.fullName}? They'll be able to log in again.`
          }
          confirmLabel={guard.isActive ? "Block" : "Unblock"}
          destructive={guard.isActive}
          busy={busyAction}
          onConfirm={handleBlockToggle}
          onCancel={() => setConfirmBlock(false)}
        />
      )}

      {confirmForceLogout && guard && (
        <ConfirmDialog
          title="Force Logout"
          message={`End ${guard.fullName}'s current session? They'll need to log in again to keep using the app.`}
          confirmLabel="Force Logout"
          destructive
          busy={busyAction}
          onConfirm={handleForceLogout}
          onCancel={() => setConfirmForceLogout(false)}
        />
      )}

      {showResetPassword && (
        <ResetPasswordModal userCode={userCode} onClose={() => setShowResetPassword(false)} />
      )}
    </Drawer>
  );
}

function ActivityList({ events }: { events: GuardActivityEvent[] }) {
  const { pageRows, page, setPage, totalPages, total, pageSize } = usePagination(events, 15);
  return (
    <>
      <div className="flex flex-col">
        {pageRows.map((ev, i) => (
          <div key={i} className="flex items-start justify-between gap-4 border-b border-gray-100 py-3 last:border-0">
            <div>
              <div className="text-sm text-gray-800 font-medium">{ACTIVITY_LABELS[ev.action] || ev.action}</div>
              {ev.detail && <div className="text-xs text-gray-500">{ev.detail}</div>}
              {ev.actorName && <div className="text-xs text-gray-400">by {ev.actorName}</div>}
            </div>
            <div className="text-xs text-gray-500 shrink-0 text-right">{Dates.dateTime(ev.createdAt)}</div>
          </div>
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onPageChange={setPage} />
    </>
  );
}

function ResetPasswordModal({ userCode, onClose }: { userCode: string; onClose: () => void }) {
  const toast = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await resetGuardPassword(userCode, newPassword);
      toast.success("Password reset.");
      onClose();
    } catch (err) {
      toast.error(err instanceof McGuardApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title="Reset Password" onClose={onClose} widthClass="max-w-sm">
      <FieldWrap label="New Password" required>
        <TextInput type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="off" />
      </FieldWrap>
      <div className="flex justify-end gap-2 mt-2">
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        <PrimaryButton onClick={handleSave} disabled={newPassword.length < 6 || saving}>
          {saving ? "Saving…" : "Reset Password"}
        </PrimaryButton>
      </div>
    </Modal>
  );
}
