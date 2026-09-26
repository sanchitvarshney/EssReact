import { useEffect, useRef, useState } from "react";
import AuthShell from "../components/auth/AuthShell";
import { Shield, ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useToast } from "../hooks/useToast";
import { useAuth } from "../contextapi/AuthContext";
import { useAuthenticationMutation } from "../services/auth";
import { consumeReturnToPath } from "../helper/returnTo";
import { markAiSurveyPendingForLogin } from "../helper/aiSurveyStorage";
import { markAssetConfirmationPendingForLogin } from "../helper/assetVerificationStorage";
import { persistLoginUser } from "../helper/userStorage";

const TwoFactorAuthPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { signIn } = useAuth();
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [authentication] = useAuthenticationMutation();

  // Check if user has temporary credentials (came from sign-in)
  useEffect(() => {
    const tempUser = sessionStorage.getItem("tempUser");
    if (!tempUser) {
      // If no temp user data, redirect to sign-in
      navigate("/sign-in");
    }
  }, [navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
      // Auto-redirect to sign-in when timer expires
      localStorage.removeItem("tempUser");
      sessionStorage.removeItem("tempUser");
      navigate("/sign-in");
    }
  }, [timeLeft, navigate]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle paste
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const pastedOtp = text.replace(/\D/g, "").slice(0, 6);
        const newOtp = [...otp];
        for (let i = 0; i < pastedOtp.length; i++) {
          newOtp[i] = pastedOtp[i];
        }
        setOtp(newOtp);
        // Focus the next empty input or the last one
        const nextIndex = Math.min(pastedOtp.length, 5);
        inputRefs.current[nextIndex]?.focus();
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    const username = localStorage.getItem("username");

    if (otpString.length !== 6) {
      showToast("Please enter the complete 6-digit OTP", "error");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call - replace with actual 2FA verification
      const response = await authentication({ otp: otpString, username }).unwrap();

      // For demo purposes, accept any 6-digit OTP
      if(response?.success){
        showToast(response?.message, "success");
        persistLoginUser(response);
        markAiSurveyPendingForLogin();
        markAssetConfirmationPendingForLogin();
        signIn();
        navigate(consumeReturnToPath(), { replace: true });
      }
       else {
        showToast(response?.message||"Invalid OTP. Please try again.", "error");
      }
    } catch (error) {
      showToast("Verification failed. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      // Simulate resend API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOtp(new Array(6).fill(""));
      setTimeLeft(300);
      setCanResend(false);
      showToast("New OTP sent to your registered device", "success");
      inputRefs.current[0]?.focus();
    } catch (error) {
      showToast("Failed to resend OTP. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSignIn = () => {
    // Clear temp user data when going back
    localStorage.removeItem("tempUser");
    sessionStorage.removeItem("tempUser");
    navigate("/sign-in");
  };

  const filled = otp.filter(Boolean).length;
  const pct = Math.max(0, Math.min(100, (timeLeft / 300) * 100));

  return (
    <AuthShell
      icon={<Shield className="h-6 w-6" />}
      title="Two-factor authentication"
      subtitle="Enter the 6-digit verification code sent to your registered email address."
      footer="Never share this code with anyone. It expires in 5 minutes."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP boxes */}
        <div className="flex justify-between gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el: HTMLInputElement | null) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              aria-label={`Digit ${index + 1}`}
              className={`w-full min-w-0 aspect-square max-w-[52px] text-center text-xl font-bold rounded-xl border-2 text-gray-800 focus:outline-none focus:bg-white focus:border-[#00a0a0] focus:ring-4 focus:ring-[#00a0a0]/15 transition-all duration-200 ${
                digit ? "border-[#00a0a0] bg-[#f0fbfb]" : "border-gray-200 bg-gray-50/70"
              }`}
              disabled={isLoading}
            />
          ))}
        </div>

        {/* Expiry timer */}
        <div>
          {!canResend ? (
            <>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                <span>Code expires in</span>
                <span className="font-bold text-[#007f86] tabular-nums">{formatTime(timeLeft)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-linear"
                  style={{
                    width: `${pct}%`,
                    background: pct > 25 ? "linear-gradient(90deg, #00a0a0, #4fd1c5)" : "linear-gradient(90deg, #f97316, #ef4444)",
                  }}
                />
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isLoading}
              className="text-[#007f86] hover:underline text-sm font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 mx-auto"
            >
              <RefreshCw className="h-4 w-4" />
              Resend code
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || filled < 6}
          className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-xl shadow-lg shadow-[#00a0a0]/25 bg-gradient-to-r from-[#0b5563] via-[#007f86] to-[#00a0a0] hover:brightness-110 active:scale-[0.99] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#00a0a0]/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <CircularProgress size={18} sx={{ color: "#fff" }} /> Verifying…
            </>
          ) : (
            "Verify & Continue"
          )}
        </button>

        <button
          type="button"
          onClick={handleBackToSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-1.5 text-sm font-semibold text-[#007f86] hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </button>
      </form>
    </AuthShell>
  );
};

export default TwoFactorAuthPage;
