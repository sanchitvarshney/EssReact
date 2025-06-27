import { useState } from "react";
import bgImg from "../assets/img/auth_bg.png";
import logoImg from "../assets/img/hrms_mscorpres_logo.png";
import { Eye, EyeOff } from "lucide-react";
import PersonIcon from '@mui/icons-material/Person';
import PasswordIcon from '@mui/icons-material/Password';

const SignInScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [employeeCode, setEmployeeCode] = useState("");
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ employeeCode, password });
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
    
      <div className="absolute inset-0 bg-black/40 z-0" />
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="bg-white shadow-2xl border border-gray-100 rounded-3xl px-8 py-10 w-full space-y-7 flex flex-col items-center">
          <div className="flex flex-col items-center gap-2">
            <img src={logoImg} alt="mscorpres" className="h-16 w-auto mb-2 drop-shadow-md" />
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight text-center">Sign in to continue</h2>
          </div>

          <form onSubmit={handleSignIn} className="w-full space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1 ml-1">Employee Code</label>
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

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1 ml-1">Password</label>
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
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-[#2eacb3] transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="text-[#2eacb3] hover:underline text-sm font-medium focus:outline-none focus:underline transition-all px-1 py-0.5 rounded"
                tabIndex={0}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#2eacb3] text-white font-semibold py-2.5 rounded-lg shadow-md hover:bg-[#279aa0] active:bg-[#238b91] transition-colors duration-200 text-lg focus:outline-none focus:ring-2 focus:ring-[#2eacb3]/60"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInScreen;
