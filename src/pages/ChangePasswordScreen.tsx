import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import PasswordIcon from "@mui/icons-material/Password";
import LockResetIcon from "@mui/icons-material/LockReset";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { CircularProgress } from "@mui/material";
import {
  useChangePasswordInfoMutation,
  useChangePasswordMutation,
} from "../services/auth";
import { useToast } from "../hooks/useToast";
import DotLoading from "../components/reuseable/DotLoading";

const CRITERIA = [
  { label: "At least 10 characters", test: (pw: string) => /.{10,}/.test(pw) },
  { label: "One uppercase letter",   test: (pw: string) => /[A-Z]/.test(pw) },
  { label: "One lowercase letter",   test: (pw: string) => /[a-z]/.test(pw) },
  { label: "One number",             test: (pw: string) => /[0-9]/.test(pw) },
  { label: "One special character",  test: (pw: string) => /[^A-Za-z0-9]/.test(pw) },
];

const strengthLabel = (s: number) =>
  s === 0 ? "" : s <= 1 ? "Weak" : s <= 3 ? "Moderate" : "Strong";

const strengthColor = (s: number) =>
  s <= 1 ? "#ef4444" : s <= 3 ? "#f59e0b" : "#16a34a";

/* ── Password input field ── */
const PasswordField = ({
  label,
  icon,
  value,
  show,
  onToggleShow,
  onChange,
  error,
  placeholder,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  show: boolean;
  onToggleShow: () => void;
  onChange: (v: string) => void;
  error?: string;
  placeholder: string;
}) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
      {label}
    </label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
        {icon}
      </span>
      <input
        type={show ? "text" : "password"}
        className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2eacb3]/40 focus:border-[#2eacb3] transition-all"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        onClick={onToggleShow}
        disabled={!value}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-30"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
    {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
  </div>
);

const ChangePasswordScreen = () => {
  const { showToast } = useToast();
  const [changePasswordInfo, { isLoading: infoLoading, data: infoData }] =
    useChangePasswordInfoMutation();
  const [changePassword, { isLoading: changing, isSuccess }] =
    useChangePasswordMutation();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [emptyError, setEmptyError] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const strength = CRITERIA.reduce((acc, c) => acc + (c.test(newPassword) ? 1 : 0), 0);

  useEffect(() => {
    if (currentPassword || newPassword || confirmPassword) setEmptyError("");
  }, [currentPassword, newPassword, confirmPassword]);

  useEffect(() => {
    changePasswordInfo()
      .then((res) => {
        if (res?.data?.status === "error") showToast(res?.data?.message, "error");
      })
      .catch((err) => {
        showToast(err?.message || "An unexpected error occurred.", "error");
      });
  }, [isSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setEmptyError("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    changePassword({ oldpassword: currentPassword, newpassword: newPassword })
      .then((res) => {
        const d = res?.data;
        if (d?.status === "error") {
          showToast(d?.message?.msg || d?.message || "An error occurred.", "error");
          return;
        }
        showToast(d?.message || "Password changed successfully", "success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((err) => {
        showToast(
          err?.data?.message?.msg || err?.data?.message || err?.message || "An unexpected error occurred.",
          "error"
        );
      });
  };

  return (
    <div className="w-full">
      {/* Warning banner */}
      <div className="mb-4">
        {infoLoading ? (
          <div className="w-36">
            <DotLoading />
          </div>
        ) : infoData?.data?.message ? (
          <div className="flex items-start gap-2.5 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
            <WarningAmberIcon sx={{ fontSize: 16, color: "#d97706", mt: 0.2 }} />
            <p className="text-xs font-medium text-amber-800">{infoData.data.message}</p>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* ── Left: form ── */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-5 rounded-full bg-[#2eacb3]" />
            <LockIcon sx={{ fontSize: 16, color: "#2eacb3" }} />
            <span className="text-sm font-bold text-gray-800">Change Password</span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <PasswordField
              label="Current Password"
              icon={<PasswordIcon sx={{ fontSize: 18 }} />}
              value={currentPassword}
              show={showCurrent}
              onToggleShow={() => setShowCurrent((p) => !p)}
              onChange={setCurrentPassword}
              placeholder="Enter current password"
              error={emptyError && !currentPassword ? emptyError : undefined}
            />
            <PasswordField
              label="New Password"
              icon={<LockIcon sx={{ fontSize: 18 }} />}
              value={newPassword}
              show={showNew}
              onToggleShow={() => setShowNew((p) => !p)}
              onChange={setNewPassword}
              placeholder="Enter new password"
              error={emptyError && !newPassword ? emptyError : undefined}
            />
            <PasswordField
              label="Confirm New Password"
              icon={<LockResetIcon sx={{ fontSize: 18 }} />}
              value={confirmPassword}
              show={showConfirm}
              onToggleShow={() => setShowConfirm((p) => !p)}
              onChange={setConfirmPassword}
              placeholder="Confirm new password"
              error={emptyError && !confirmPassword ? emptyError : undefined}
            />

            <button
              type="submit"
              disabled={!currentPassword || !newPassword || !confirmPassword}
              className="w-full mt-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200
                bg-gradient-to-r from-[#2eacb3] to-[#1e8a8f]
                hover:from-[#1e8a8f] hover:to-[#2eacb3]
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {changing ? (
                <div className="flex items-center justify-center gap-2">
                  <CircularProgress size={16} sx={{ color: "#fff" }} />
                  <span>Changing…</span>
                </div>
              ) : (
                "Change Password"
              )}
            </button>
          </form>
        </div>

        {/* ── Right: criteria + strength ── */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-5 rounded-full bg-[#2eacb3]" />
            <span className="text-sm font-bold text-gray-800">Password Requirements</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {CRITERIA.map((item, idx) => {
              const passed = item.test(newPassword);
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-2.5 text-xs transition-colors duration-200 ${
                    passed ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {passed ? (
                    <CheckCircleIcon sx={{ fontSize: 15, flexShrink: 0 }} />
                  ) : (
                    <RadioButtonUncheckedIcon sx={{ fontSize: 15, flexShrink: 0 }} />
                  )}
                  <span className={passed ? "font-medium" : ""}>{item.label}</span>
                </div>
              );
            })}
          </div>

          {/* Strength meter */}
          {newPassword.length > 0 && (
            <div className="mt-5">
              <div className="flex gap-1 mb-1.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-1.5 flex-1 rounded-full transition-colors duration-300"
                    style={{
                      backgroundColor:
                        i <= strength ? strengthColor(strength) : "#e2e8f0",
                    }}
                  />
                ))}
              </div>
              <p
                className="text-xs font-semibold"
                style={{ color: strengthColor(strength) }}
              >
                {strengthLabel(strength)} password
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordScreen;
