import { useState } from "react";

import { Eye, EyeOff } from "lucide-react";
import PasswordIcon from "@mui/icons-material/Password";
import LockResetIcon from '@mui/icons-material/LockReset';
import LockIcon from '@mui/icons-material/Lock';

const ChangePasswordScreen = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");



  
  const [preferences] = useState({
    accountUpdates: true,
    companyUpdates: true,
  });



  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    console.log({ currentPassword, newPassword, confirmPassword });
    // Handle password change logic here
  };

  return (
    <div className=" w-full  flex items-center justify-center gap-20  p-2">
      

      <form onSubmit={handleChangePassword} className="w-full flex flex-col justify-center items-center space-y-4">
     
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Current Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <PasswordIcon />
            </span>
            <input
              type={showCurrent ? "text" : "password"}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2eacb3]"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
         
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            New Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <LockIcon />
            </span>
            <input
              type={showNew ? "text" : "password"}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2eacb3]"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
           
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

     
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Confirm New Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <LockResetIcon />
            </span>
            <input
              type={showConfirm ? "text" : "password"}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2eacb3]"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

  
        <button
          type="submit"
          className=" bg-[#2eacb3] text-white font-semibold py-2 px-2 rounded-lg hover:bg-[#279aa0] transition-colors duration-200"
        >
          Change Password
        </button>
      </form>
  
       <div className="w-full p-4 bg-white space-y-3 flex flex-col justify-center  items-center">
      <h3 className="text-lg font-semibold text-gray-700">e-mail & Notification</h3>
      <p className="text-sm text-gray-600">I'd like to receive the following emails:</p>

      <div className="space-y-3 pt-1">
     
        <label className="flex items-center space-x-2 opacity-60 cursor-not-allowed">
          <input
            type="checkbox"
            checked={preferences.accountUpdates}
            disabled
            className="form-checkbox h-4 w-4 text-cyan-400 border-gray-300 rounded bg-white"
          />
          <span className="text-sm text-gray-600">Account Related Updates</span>
        </label>

    
        <label className="flex items-center space-x-2 opacity-60 cursor-not-allowed">
          <input
            type="checkbox"
            checked={preferences.companyUpdates}
            disabled
            className="form-checkbox h-4 w-4 text-cyan-400 border-gray-300 rounded bg-white"
          />
          <span className="text-sm text-gray-600">Company Related Updates</span>
        </label>
      </div>
    </div>
    </div>
  );
};

export default ChangePasswordScreen;
