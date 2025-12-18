import { useEffect, useRef, useState } from "react";
import bgImg from "../assets/img/auth_bg.png";
import logoImg from "../assets/img/hrms_mscorpres_logo.png";
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
import { Typography } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";

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
     const [loginGoogle, { isLoading: isLoadingGoogle, data: dataGoogle,  }] =
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

  useEffect(() => {
  

    if (dataGoogle?.data) {
      localStorage.setItem("user", JSON.stringify(dataGoogle.data));
      sessionStorage.setItem("user", JSON.stringify(dataGoogle.data));
      signIn();
      navigation("/");
    }
  }, [dataGoogle]);

  useEffect(() => {
    if (data?.isTwoStep) {
      localStorage.setItem("tempUser", JSON.stringify(data?.data));
      sessionStorage.setItem("tempUser", JSON.stringify(data?.data));
      navigation("/two-factor-auth");
      return;
    }

    if (data?.data) {
      localStorage.setItem("user", JSON.stringify(data.data));
      sessionStorage.setItem("user", JSON.stringify(data.data));
      signIn();
      navigation("/");
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
        err?.data?.message?.msg ||
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
    try {
      const response: any = loginGoogle(data).unwrap();
      if (response?.success) {
        
        showToast(response?.message, "success");
        localStorage.setItem("cyberAlertAcknowledged", "false");
        localStorage.setItem("username", response?.username);
      } else {
          showToast(response?.message, "error");
      }
    } catch (error: any) {
      showToast(
        error?.data?.message ||
          error?.message ||
          "We're Sorry An unexpected error has occured. Our technical staff has been automatically notified and will be looking into this with utmost urgency.",
        "error"
      );
    }
  };
  const handleRecaptchaChange = (value: string | null) => {
    setRecaptchaValue(value);
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex items-center justify-start relative p-4 sm:pl-8 md:pl-10 lg:pl-25 xl:pl-30"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="absolute inset-0 bg-black/40 z-0 " />
      <div className="relative z-10 w-full max-w-md  ">
        <div className="bg-white shadow-2xl border border-gray-100 rounded-3xl px-8 py-10 w-full space-y-7 flex flex-col items-center">
          <div className="flex flex-col items-center gap-2">
            <img src={logoImg} alt="mscorpres" className="h-16 w-auto mb-2 " />
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight text-center">
              Sign in to continue
            </h2>
          </div>

          <form onSubmit={handleSignIn} className="w-full space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1 ml-1">
                Employee Code
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <PersonIcon fontSize="small" />
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2eacb3] focus:border-[#2eacb3] transition-all duration-200 bg-white/80 placeholder-gray-400"
                  placeholder="Enter your employee code"
                  value={employeeCode}
                  onChange={(e) => {
                    const inputValue = e.target.value.toUpperCase();
                    setEmployeeCode(inputValue);
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-600 mb-1 ml-1">
                  Password
                </label>
                <span
                  className="text-[#2eacb3] hover:underline text-xs font-medium focus:outline-none focus:underline transition-all px-1  rounded cursor-pointer"
                  onClick={() => navigation("/recover-password")}
                >
                  {" "}
                  {!isLoading || !isLoadingGoogle && "Forgot password?"}
                </span>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <PasswordIcon fontSize="small" />
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2eacb3] focus:border-[#2eacb3] transition-all duration-200 bg-white/80 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-[#2eacb3] transition-colors cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {isError && (
              <div className="text-red-500 text-sm text-center bg-red-50 border border-red-200 rounded-lg p-2">
                {isError}
              </div>
            )}

            <div className="flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6LdmVcArAAAAAOb1vljqG4DTEEi2zP1TIjDd_0wR"
                onChange={handleRecaptchaChange}
              />
            </div>

            {isLoading || isLoadingGoogle ? (
              <div className="flex items-center justify-center">
                <CircularProgress color="success" size={"40px"} />
              </div>
            ) : (
              <button
                type="submit"
                className="w-full bg-[#2eacb3] text-white font-semibold py-2 rounded-lg shadow-md hover:bg-[#279aa0] active:bg-[#238b91] transition-colors duration-200 text-lg focus:outline-none focus:ring-2 focus:ring-[#2eacb3]/60 cursor-pointer"
              >
                Sign In
              </button>
            )}
            {(!isLoading && !isLoadingGoogle) ? (
              <Typography textAlign={"center"} variant="subtitle2">
                OR
              </Typography>
            ) : (
                <Typography textAlign={"center"} variant="subtitle2">
                Please wait.....
              </Typography>
            )}
            <div className="flex justify-center w-full items-center py-2 ">
              {(!isLoading && !isLoadingGoogle) && (
                <>
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      handleLoginWithGoogle(credentialResponse);
                    }}
                    onError={() => {
                      showToast("Login failed", "error");
                    }}
                    shape="circle"
                    text="continue_with"
                  />
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInScreen;
