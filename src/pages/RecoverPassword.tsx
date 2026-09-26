import { useRef, useState } from "react";
import AuthShell from "../components/auth/AuthShell";

import PersonIcon from "@mui/icons-material/Person";
import LockResetIcon from "@mui/icons-material/LockReset";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "../services/auth";
import { useToast } from "../hooks/useToast";
import { CircularProgress } from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";

const RecoverPassword = () => {
  const { showToast } = useToast();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const navigation = useNavigate();

  const [employeeCode, setEmployeeCode] = useState("");
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeCode) {
      showToast("Employee code is required", "error");
      return;
    }
    if (!recaptchaValue) {
      showToast("Please verify you are not a robot.", "error");
      return;
    }
    resetPassword({ username: employeeCode })
      .then((res) => {
        if (res?.data?.status === "error") {
          showToast(res?.data?.message, "error");
          return;
        }
        showToast(
          res?.data?.message || "Insructions sent to your email",
          "success"
        );
        setEmployeeCode("");
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        recaptchaRef.current?.reset();
        setRecaptchaValue(null);
      });
  };

  const busy = isLoading;

  return (
    <AuthShell
      icon={<LockResetIcon sx={{ fontSize: 26 }} />}
      title="Forgot your password?"
      subtitle="Enter your employee code and we will email reset instructions to your registered address."
      footer="Still stuck? Contact your HR or IT support team."
    >
      <form onSubmit={handleSignIn} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Employee Code
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
              <PersonIcon fontSize="small" />
            </span>
            <input
              type="text"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/70 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#00a0a0] focus:ring-4 focus:ring-[#00a0a0]/15 transition-all duration-200"
              placeholder="e.g. MS0014"
              value={employeeCode}
              onChange={(e) => setEmployeeCode(e.target.value.toUpperCase())}
              autoFocus
            />
          </div>
        </div>

        <div className="flex justify-center overflow-hidden">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="6LdmVcArAAAAAOb1vljqG4DTEEi2zP1TIjDd_0wR"
            onChange={(value) => setRecaptchaValue(value)}
          />
        </div>

        <button
          disabled={employeeCode === "" || busy}
          type="submit"
          className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-xl shadow-lg shadow-[#00a0a0]/25 bg-gradient-to-r from-[#0b5563] via-[#007f86] to-[#00a0a0] hover:brightness-110 active:scale-[0.99] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#00a0a0]/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {busy ? (
            <>
              <CircularProgress size={18} sx={{ color: "#fff" }} /> Sending…
            </>
          ) : (
            "Send Instructions"
          )}
        </button>

        <button
          type="button"
          onClick={() => navigation("/sign-in")}
          className="w-full flex items-center justify-center gap-1.5 text-sm font-semibold text-[#007f86] hover:underline cursor-pointer"
        >
          <ArrowBackIcon sx={{ fontSize: 16 }} /> Back to sign in
        </button>
      </form>
    </AuthShell>
  );
};

export default RecoverPassword;
