import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import PersonIcon from "@mui/icons-material/Person";
import PasswordIcon from "@mui/icons-material/Password";
import { useNavigate } from "react-router-dom";
import { useLoginGoogleMutation, useLoginMutation } from "../services/auth";
import CircularProgress from "@mui/material/CircularProgress";
import ReCAPTCHA from "react-google-recaptcha";
import { useToast } from "../hooks/useToast";
import { useAuth } from "../contextapi/AuthContext";
import { useApiErrorMessage } from "../hooks/useApiErrorMessage";
import { GoogleLogin } from "@react-oauth/google";
import { consumeReturnToPath } from "../helper/returnTo";
import { markAiSurveyPendingForLogin } from "../helper/aiSurveyStorage";
import { markAssetConfirmationPendingForLogin } from "../helper/assetVerificationStorage";
import { persistLoginUser } from "../helper/userStorage";
import AuthShell from "../components/auth/AuthShell";

const SignInScreen = () => {
  const { signIn } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigation = useNavigate();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [employeeCode, setEmployeeCode] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState("");
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [login, { isLoading, error, data, isError: isErrorLogin, isSuccess }] =
    useLoginMutation();
     const [loginGoogle, { isLoading: isLoadingGoogle }] =
    useLoginGoogleMutation();
  useApiErrorMessage({
    error,
    isError: isErrorLogin,
    isSuccess,
    errorMessage: data?.msg,
  });
  
 

  const togglePasswordVisibility = () => {
    if (password === "") {
      return;
    }
    setShowPassword((prev) => !prev);
  };

  // useEffect(() => {
  

  //   if (dataGoogle?.data) {
  //     localStorage.setItem("user", JSON.stringify(dataGoogle.data));
  //     sessionStorage.setItem("user", JSON.stringify(dataGoogle.data));
  //     signIn();
  //     navigation("/");
  //   }
  // }, [dataGoogle]);

  useEffect(() => {
    if (data?.isTwoStep) {
      localStorage.setItem("tempUser", JSON.stringify(data?.data));
      sessionStorage.setItem("tempUser", JSON.stringify(data?.data));
      navigation("/two-factor-auth");
      return;
    }

    if (data?.data) {
      persistLoginUser(data);
      markAiSurveyPendingForLogin();
      markAssetConfirmationPendingForLogin();
      signIn();
      navigation(consumeReturnToPath(), { replace: true });
    }
  }, [data, navigation, signIn])

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsError("");

    // Basic validation
    if (!employeeCode.trim()) {
      setIsError("Employee code is required");
      return;
    }

    if (!password.trim()) {
      setIsError("Password is required");
      return;
    }

    if (!recaptchaValue) {
      setIsError("Please verify you are not a robot.");
      return;
    }

    const payload = {
      username: employeeCode,
      password: password,
      captchaToken: recaptchaValue,
    };

    try {
      const response = await login(payload).unwrap();
     
      if (response?.success === false) {
        showToast(response?.message, "error");
        return;
      }
      showToast(response?.message, "success");
      localStorage.setItem("cyberAlertAcknowledged", "false");
      localStorage.setItem("username", response?.username);
    } catch (err: any) {
      showToast(
        err?.data?.message ||
          err?.message ||
          "We're Sorry An unexpected error has occured. Our technical staff has been automatically notified and will be looking into this with utmost urgency.",
        "error"
      );
    } finally {
      recaptchaRef.current?.reset();
      setRecaptchaValue(null);
    }
  };

  const handleLoginWithGoogle = (googleResponse: any) => {
    const data: any = {
      credential: googleResponse.credential,
    };
    loginGoogle(data).unwrap().then((res: any) => {
     if (res?.success) {
      showToast(res?.message, "success");
      persistLoginUser(res);
      markAiSurveyPendingForLogin();
      markAssetConfirmationPendingForLogin();
      signIn();
      navigation(consumeReturnToPath(), { replace: true });
     } else {
      showToast(res?.message, "error");
     }
    }).catch((err: any) => {
      showToast(
        err?.data?.message ||
          err?.message ||
          "We're Sorry An unexpected error has occured. Our technical staff has been automatically notified and will be looking into this with utmost urgency.",
        "error"
      );
    });
     
   
  };
  const handleRecaptchaChange = (value: string | null) => {
    setRecaptchaValue(value);
  };

  const inputBase =
    "w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/70 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#00a0a0] focus:ring-4 focus:ring-[#00a0a0]/15 transition-all duration-200";

  const busy = isLoading || isLoadingGoogle;

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in with your employee code to continue."
      footer="Trouble signing in? Contact your HR or IT support team."
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
              ref={inputRef}
              type="text"
              className={inputBase}
              placeholder="e.g. MS0014"
              value={employeeCode}
              onChange={(e) => setEmployeeCode(e.target.value.toUpperCase())}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Password
            </label>
            {!busy && (
              <button
                type="button"
                className="text-[#007f86] hover:underline text-xs font-semibold cursor-pointer"
                onClick={() => navigation("/recover-password")}
              >
                Forgot password?
              </button>
            )}
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
              <PasswordIcon fontSize="small" />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={`${inputBase} pr-11`}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00a0a0] transition-colors cursor-pointer"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
        </div>

        {isError && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">
            {isError}
          </div>
        )}

        <div className="flex justify-center overflow-hidden">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="6LdmVcArAAAAAOb1vljqG4DTEEi2zP1TIjDd_0wR"
            onChange={handleRecaptchaChange}
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-xl shadow-lg shadow-[#00a0a0]/25 bg-gradient-to-r from-[#0b5563] via-[#007f86] to-[#00a0a0] hover:brightness-110 active:scale-[0.99] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#00a0a0]/25 cursor-pointer disabled:opacity-80 disabled:cursor-wait"
        >
          {isLoading ? (
            <>
              <CircularProgress size={18} sx={{ color: "#fff" }} /> Signing in…
            </>
          ) : (
            "Sign In"
          )}
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
            {busy ? "Please wait" : "or"}
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="flex justify-center w-full items-center min-h-[44px]">
          {!busy && (
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                handleLoginWithGoogle(credentialResponse);
              }}
              onError={() => {
                showToast("Login failed", "error");
              }}
              shape="pill"
              text="continue_with"
              width={String(Math.max(200, Math.min(340, window.innerWidth - 96)))}
            />
          )}
        </div>
      </form>
    </AuthShell>
  );
};

export default SignInScreen;
