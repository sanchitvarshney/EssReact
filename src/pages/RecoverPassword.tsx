import { useRef, useState } from "react";
import bgImg from "../assets/img/auth_bg.png";
import logoImg from "../assets/img/hrms_mscorpres_logo.png";

import PersonIcon from "@mui/icons-material/Person";
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

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex items-center justify-start relative p-4 sm:pl-8 md:pl-10 lg:pl-25 xl:pl-30"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="absolute inset-0 bg-black/40 z-0" />
      <div className="relative z-10 w-full max-w-md ">
        <div className="bg-white shadow-2xl border border-gray-100 rounded-3xl px-8 py-10 w-full space-y-7 flex flex-col items-center">
          <div className="flex flex-col items-center gap-2">
            <img src={logoImg} alt="mscorpres" className="h-16 w-auto mb-2 " />
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight text-center">
              Recover Password
            </h2>
            <p>
              Please enter your employee code below to receive instructions for
              resetting password on your registered e-mail address.
            </p>
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
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2eacb3] focus:border-[#2eacb3] transition-all duration-200 bg-white/80 placeholder-gray-400"
                  placeholder="Enter your employee code"
                  value={employeeCode}
                  onChange={(e) => setEmployeeCode(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <p>If you have password?</p>
              <button
                type="button"
                className="text-[#2eacb3] hover:underline text-sm font-medium focus:outline-none focus:underline transition-all px-1 py-0.5 rounded cursor-pointer pl-4"
                tabIndex={0}
                onClick={() => navigation("/sign-in")}
              >
                SignIn
              </button>
            </div>

            <div className="flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6LdmVcArAAAAAOb1vljqG4DTEEi2zP1TIjDd_0wR"
                onChange={(value) => setRecaptchaValue(value)}
              />
            </div>

            {/* Submit Button */}
         
            {isLoading ? (
              <div className="flex items-center justify-center">
                <CircularProgress color="success" size={"40px"} />
              </div>
            ) : (
              <button
              disabled={employeeCode === ""}
              type="submit"
              className={`${
                employeeCode === "" ? "opacity-50 cursor-not-allowed " : ""
              }  w-full bg-[#2eacb3] text-white font-semibold py-2.5 rounded-lg shadow-md hover:bg-[#279aa0] active:bg-[#238b91] transition-colors duration-200 text-lg focus:outline-none focus:ring-2 focus:ring-[#2eacb3]/60`}
            >
              Send Instruction
            </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecoverPassword;
