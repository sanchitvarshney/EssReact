import { useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { loginMscGuard, McGuardAuthError } from "../services/mscguardAuth";
import { ToastProvider, useToast } from "../components/ToastProvider";
import gatepassIcon from "../assets/gatepass-icon.png";
import "../mscguard.css";

// Same site key ESS's own /sign-in page uses — reCAPTCHA site keys are
// registered per domain, not per page, so this is safe to reuse here.
// Note: this only gates the button client-side (the widget must be
// completed to submit) — there's no server-side token verification yet,
// since that needs the GatePass backend to hold the matching secret key.
const RECAPTCHA_SITE_KEY = "6LdmVcArAAAAAOb1vljqG4DTEEi2zP1TIjDd_0wR";

export default function Login() {
  return (
    <ToastProvider>
      <LoginForm />
    </ToastProvider>
  );
}

function LoginForm() {
  const navigate = useNavigate();
  const toast = useToast();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await loginMscGuard(username.trim(), password);
      navigate("/gp/sp", { replace: true });
    } catch (err) {
      toast.error(err instanceof McGuardAuthError ? err.message : "Something went wrong. Please try again.");
      recaptchaRef.current?.reset();
      setCaptchaVerified(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mscguard-font flex min-h-screen bg-white">
      <div className="w-2/5 lg:flex hidden flex-col items-center justify-center gap-5 bg-blue-700 px-16">
        <img src={gatepassIcon} alt="" className="w-20 h-20 rounded-2xl" />
        <div className="flex items-baseline gap-2">
          <span className="text-white font-extrabold text-2xl tracking-[0.3em]">MSCGUARD</span>
          <span className="text-white font-bold text-xs tracking-widest">ADMIN</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <form onSubmit={handleSubmit} className="w-full max-w-[420px]">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Log in</h1>

          <label className="block mb-5">
            <span className="block text-xs font-bold text-blue-700 uppercase tracking-wide mb-1.5">Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              className="w-full bg-white border border-gray-300 focus:border-blue-600 outline-none text-gray-800 rounded-md px-3 py-2.5 transition-colors"
            />
          </label>

          <label className="block mb-5">
            <span className="block text-xs font-bold text-blue-700 uppercase tracking-wide mb-1.5">Password</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full bg-white border border-gray-300 focus:border-blue-600 outline-none text-gray-800 rounded-md px-3 py-2.5 pr-10 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <div className="mb-6">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={(token) => setCaptchaVerified(!!token)}
              onExpired={() => setCaptchaVerified(false)}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !captchaVerified}
            className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-md py-3 transition-colors"
          >
            {isSubmitting ? "Signing in…" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
