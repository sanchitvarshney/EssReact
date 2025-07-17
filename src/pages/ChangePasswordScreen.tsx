import { useEffect, useState } from "react";

import { Eye, EyeOff } from "lucide-react";
import PasswordIcon from "@mui/icons-material/Password";
import LockResetIcon from "@mui/icons-material/LockReset";
import LockIcon from "@mui/icons-material/Lock";
import {
  Box,
  CircularProgress,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  useChangePasswordInfoMutation,
  useChangePasswordMutation,
} from "../services/auth";

import { useToast } from "../hooks/useToast";
import DotLoading from "../components/reuseable/DotLoading";

const getIcons = (status: string) => {
  const key = status?.toLowerCase();
  switch (key) {
    case "warning":
      return <LockResetIcon />;
    case "critical":
      return <LockIcon />;

    default:
      return <LockResetIcon />;
  }
};

const ChangePasswordScreen = () => {
  const { showToast } = useToast();
  const [
    changePasswordInfo,
    { isLoading: isChangePasswordInfoLoading, data: changePasswordInfoData },
  ] = useChangePasswordInfoMutation();
  const [changePassword, { isLoading: isChangePasswordLoading, isSuccess }] =
    useChangePasswordMutation();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [emptyError, setEmptyError] = useState<string>("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (currentPassword || newPassword || confirmPassword) {
      setEmptyError("");
      return;
    }
  }, [currentPassword, newPassword, confirmPassword]);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setEmptyError("Fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    changePassword({
      oldpassword: currentPassword,
      newpassword: newPassword,
    })
      .then((res) => {
        const responseData = res?.data;

        // Check if there's an error in the response
        if (responseData?.status === "error") {
          // Handle message from different possible formats
          const errorMessage =
            responseData?.message?.msg ||
            responseData?.message ||
            "Something went wrong";

          showToast(errorMessage, "error");
          return;
        }

        // Success
        showToast(
          responseData?.message || "Password changed successfully",
          "success"
        );
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((err) => {
        // Handle unexpected errors
        const fallbackError =
          err?.data?.message?.msg ||
          err?.data?.message ||
          err?.message ||
          "Something went wrong";

        showToast(fallbackError, "error");
      });
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

  useEffect(() => {
    changePasswordInfo()
      .then((res) => {
        if (res?.data?.status === "error") {
          showToast(res?.data?.message, "error");
        }
      })
      .catch((err) => {
        showToast(err || err?.message || "Something went wrong", "error");
      });
  }, [isSuccess]);

  return (
    <div className=" w-full  flex-col  items-center justify-center  ">
      <div className="w-full flex justify-center  items-center space-x-2">
        {isChangePasswordInfoLoading ? (
          <Box sx={{ width: "100%", backgroundColor: "transparent" }}>
            <DotLoading />
          </Box>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-gray-700">
              {getIcons(changePasswordInfoData?.data?.status)}
            </h3>
            <p className="text-sm text-red-800">
              {changePasswordInfoData?.data?.message}
            </p>
          </>
        )}
      </div>

      <div className="w-full  space-x-30 flex flex-row justify-center px-4 mt-2  items-center">
        <form
          onSubmit={handleChangePassword}
          className="w-full flex flex-col justify-center  space-y-2"
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
                disabled={!currentPassword}
              >
                {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <span className="text-[12px] text-[red] ">{emptyError}</span>
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
                disabled={!newPassword}
              >
                {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <span className="text-[12px] text-[red] ">{emptyError}</span>
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
                disabled={!confirmPassword}
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <span className="text-[12px] text-[red] ">{emptyError}</span>
          </div>

          <button
            disabled={!currentPassword || !newPassword || !confirmPassword}
            type="submit"
            className=" cursor-pointer py-2 text-lg font-bold shadow-xl bg-gradient-to-r from-[#2eacb3] to-[#1e8a8f] hover:from-[#1e8a8f] hover:to-[#2eacb3] rounded-md transform hover:scale-101 transition-all duration-200 text-white"
          >
            {isChangePasswordLoading ? (
              <div className="flex items-center justify-center">
                <CircularProgress color="success" size={"25px"} />
              </div>
            ) : (
              "Change Password"
            )}
          </button>
        </form>

        <div className="w-full">
          <Box className=" p-4  mb-4">
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
      </div>
    </div>
  );
};

export default ChangePasswordScreen;
