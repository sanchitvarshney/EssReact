import { useState } from "react";

import { Eye, EyeOff } from "lucide-react";
import PasswordIcon from "@mui/icons-material/Password";
import LockResetIcon from "@mui/icons-material/LockReset";
import LockIcon from "@mui/icons-material/Lock";
import {
  Box,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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
  };

  const getStrengthColor = (value: number) => {
    switch (value) {
    
      case 1:
        return "error";
      case 2:
      case 3:
        return "warning";
      case 4:
      case 5:
        return "success";
      default:
        return "inherit";
    }
  };

  const criteria = [
    {
      label: "At least 8 characters",
      test: (pw: string) => /.{8,}/.test(pw),
    },
    {
      label: "One uppercase letter",
      test: (pw: string) => /[A-Z]/.test(pw),
    },
    {
      label: "One lowercase letter",
      test: (pw: string) => /[a-z]/.test(pw),
    },
    {
      label: "One number",
      test: (pw: string) => /[0-9]/.test(pw),
    },
    {
      label: "One special character",
      test: (pw: string) => /[^A-Za-z0-9]/.test(pw),
    },
  ];

  const strength = criteria.reduce(
    (acc, curr) => acc + (curr.test(newPassword) ? 1 : 0),
    0
  );

  return (
    <div className=" w-full  flex items-center justify-center gap-20  p-2">
      <form
        onSubmit={handleChangePassword}
        className="w-full flex flex-col justify-center  space-y-4"
      >
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
                      className=" cursor-pointer py-2 text-lg font-bold shadow-xl bg-gradient-to-r from-[#2eacb3] to-[#1e8a8f] hover:from-[#1e8a8f] hover:to-[#2eacb3] rounded-2xl transform hover:scale-101 transition-all duration-200 text-white"
        >
          Change Password
        </button>
      </form>

      <div className="w-full">
        <Box className=" p-4 bg-white mb-4">
          <Typography variant="h6" gutterBottom>
            Character Requirements
          </Typography>
          <List dense>
            {criteria.map((item, idx) => {
              const passed = item.test(newPassword);
              return (
                <ListItem key={idx}>
                  <ListItemIcon>
                    {passed ? (
                      <CheckCircleIcon color="success" fontSize="small" />
                    ) : (
                      <RadioButtonUncheckedIcon
                        color="disabled"
                        fontSize="small"
                      />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{ color: passed ? "green" : "gray" }}
                  />
                </ListItem>
              );
            })}
          </List>
          {strength > 0 && (
            <>
              <Typography variant="subtitle1">Password Strength</Typography>
              <LinearProgress
                variant="determinate"
                value={(strength / 5) * 100}
                color={getStrengthColor(strength)}
                sx={{ height: 10, borderRadius: 5, my: 1 }}
              />
            </>
          )}
        
        </Box>
      </div>
      <div className="w-full p-4 bg-white space-y-3 flex flex-col justify-center  items-center">
        <h3 className="text-lg font-semibold text-gray-700">
          e-mail & Notification
        </h3>
        <p className="text-sm text-gray-600">
          I'd like to receive the following emails:
        </p>

        <div className="space-y-3 pt-1">
          <label className="flex items-center space-x-2 opacity-60 cursor-not-allowed">
            <input
              type="checkbox"
              checked={preferences.accountUpdates}
              disabled
              className="form-checkbox h-4 w-4 text-cyan-400 border-gray-300 rounded bg-white"
            />
            <span className="text-sm text-gray-600">
              Account Related Updates
            </span>
          </label>

          <label className="flex items-center space-x-2 opacity-60 cursor-not-allowed">
            <input
              type="checkbox"
              checked={preferences.companyUpdates}
              disabled
              className="form-checkbox h-4 w-4 text-cyan-400 border-gray-300 rounded bg-white"
            />
            <span className="text-sm text-gray-600">
              Company Related Updates
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordScreen;
