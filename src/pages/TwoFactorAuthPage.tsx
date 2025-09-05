import { useEffect, useRef, useState } from "react";
import bgImg from "../assets/img/auth_bg.png";
import logoImg from "../assets/img/hrms_mscorpres_logo.png";
import { Shield, ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useToast } from "../hooks/useToast";
import { useAuth } from "../contextapi/AuthContext";
import { useAuthenticationMutation } from "../services/auth";

const TwoFactorAuthPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { signIn } = useAuth();
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
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
        navigate("/")
        localStorage.setItem("user", JSON.stringify(response?.data));
        sessionStorage.setItem("user", JSON.stringify(response?.data));
        signIn();
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

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex items-center justify-start relative p-4 sm:pl-8 md:pl-10 lg:pl-25 xl:pl-30"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="absolute inset-0 bg-black/40 z-0" />
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white shadow-2xl border border-gray-100 rounded-3xl px-8 py-10 w-full space-y-7 flex flex-col items-center">
          {/* Header */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <img src={logoImg} alt="mscorpres" className="h-16 w-auto mb-2" />
              <div className="absolute -top-2 -right-2 bg-[#2eacb3] rounded-full p-2">
                <Shield className="h-5 w-5 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight text-center">
              Two-Factor Authentication
            </h2>
            <p className="text-gray-600 text-sm text-center leading-relaxed">
              Enter the 6-digit verification code sent to your registered Email
              address (expires in 10 minutes)
            </p>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-6">
            {/* OTP Input Fields */}
            <div className="flex justify-center gap-3">
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
                  className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2eacb3] focus:border-[#2eacb3] transition-all duration-200 bg-white/80"
                  disabled={isLoading}
                />
              ))}
            </div>

            {/* Timer */}
            <div className="text-center">
              {!canResend ? (
                <p className="text-sm text-gray-500">
                  Code expires in{" "}
                  <span className="font-semibold text-[#2eacb3]">
                    {formatTime(timeLeft)}
                  </span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="text-[#2eacb3] hover:text-[#279aa0] text-sm font-medium focus:outline-none focus:underline transition-all px-1 py-0.5 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 mx-auto"
                >
                  <RefreshCw className="h-4 w-4" />
                  Resend Code
                </button>
              )}
            </div>

            {/* Submit Button */}
            {isLoading ? (
              <div className="flex items-center justify-center py-2">
                <CircularProgress color="success" size={40} />
              </div>
            ) : (
              <button
                type="submit"
                className="w-full bg-[#2eacb3] text-white font-semibold py-3 rounded-lg shadow-md hover:bg-[#279aa0] active:bg-[#238b91] transition-colors duration-200 text-lg focus:outline-none focus:ring-2 focus:ring-[#2eacb3]/60 cursor-pointer"
              >
                Verify & Continue
              </button>
            )}
          </form>

          {/* Back to Sign In */}
          <div className="w-full pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleBackToSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-[#2eacb3] text-sm font-medium focus:outline-none transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </button>
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 w-full">
            <p className="text-xs text-blue-700 text-center leading-relaxed">
              <Shield className="h-3 w-3 inline mr-1" />
              For your security, this code will expire in 5 minutes. Never share
              this code with anyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuthPage;
