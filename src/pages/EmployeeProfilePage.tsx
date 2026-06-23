import { Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import EmployeeHierarchyPage from "../components/EmployeeHierarchyPage";
import EmployeeInformationPage from "../components/EmployeeInformationPage";
import ChangePasswordScreen from "./ChangePasswordScreen";
import { useGetuserdataMutation } from "../services/auth";
import { useAuth } from "../contextapi/AuthContext";
import { useToast } from "../hooks/useToast";
import EmployeeProfilePageSkeleton from "../skeleton/EmployeeProfilePageSkeleton";
import BadgeIcon from "@mui/icons-material/Badge";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import LockIcon from "@mui/icons-material/Lock";

const TABS = [
  { id: "info",     label: "Information",     icon: BadgeIcon },
  { id: "chart",    label: "Hierarchy",        icon: AccountTreeIcon },
  { id: "password", label: "Change Password",  icon: LockIcon },
];

const EmployeeProfilePage = () => {
  const { showToast } = useToast();
  const [value, setValue] = useState("password");
  const { user } = useAuth();
  const [getuserdata, { isLoading, data, error }] = useGetuserdataMutation();

  useEffect(() => {
    if (user) {
      //@ts-ignore
      getuserdata({ logedINUser: user?.id }).unwrap();
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      //@ts-ignore
      showToast(error?.data?.message || "An unexpected error has occurred.", "error");
    }
  }, [error]);

  return (
    <div className="w-full h-[calc(100vh-78px)] overflow-y-auto custom-scrollbar-for-menu px-4 py-5">
      {isLoading ? (
        <EmployeeProfilePageSkeleton />
      ) : (
        <div className="max-w-4xl mx-auto flex flex-col gap-4">

          {/* ── Profile banner card ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Cover strip with decorative circles */}
            <div className="relative h-24 sm:h-28 bg-gradient-to-r from-[#2eacb3] to-[#0097a7] overflow-hidden">
              <div className="absolute -right-4 -top-6 w-28 h-28 rounded-full bg-white/10" />
              <div className="absolute right-20 top-4 w-14 h-14 rounded-full bg-white/10" />
              <div className="absolute left-1/2 -bottom-6 w-20 h-20 rounded-full bg-white/5" />
            </div>

            {/* Avatar + info */}
            <div className="px-5 sm:px-8 pb-5">
              {/* Avatar (overlaps the cover) */}
              <div className="-mt-10 mb-2">
                <Avatar
                  //@ts-ignore
                  src={user?.imgUrl}
                  //@ts-ignore
                  alt={user?.name}
                  sx={{
                    width: 80,
                    height: 80,
                    border: "4px solid #fff",
                    boxShadow: "0 4px 20px rgba(46,172,179,0.3)",
                    backgroundColor: "#2eacb3",
                    pointerEvents: "none",
                    userSelect: "none",
                    fontSize: 28,
                    fontWeight: 700,
                  }}
                >
                  {/* @ts-ignore */}
                  {user?.name?.charAt(0)}
                </Avatar>
              </div>

              {/* Name + ID + role + dept */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* @ts-ignore */}
                  <span className="text-xl font-bold text-gray-800">{user?.name}</span>
                  <span className="text-[11px] font-mono font-semibold text-[#0097a7] bg-[#e0f7fa] px-2.5 py-0.5 rounded-full border border-[#2eacb3]/20">
                    {/* @ts-ignore */}
                    {user?.id}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {/* @ts-ignore */}
                  {user?.role && (
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                      {/* @ts-ignore */}
                      {user.role}
                    </span>
                  )}
                  {/* @ts-ignore */}
                  {user?.dept && (
                    <span className="text-xs font-semibold text-[#0097a7] bg-[#e0f7fa] px-2.5 py-0.5 rounded-full">
                      {/* @ts-ignore */}
                      {user.dept}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Tab switcher ── */}
          <div className="flex justify-center">
            <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-2xl p-1">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setValue(id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 whitespace-nowrap ${
                    value === id
                      ? "bg-[#2eacb3] text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-white"
                  }`}
                >
                  <Icon sx={{ fontSize: 15 }} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Tab content ── */}
          <div className="w-full">
            {value === "info" ? (
              <EmployeeInformationPage data={data} />
            ) : value === "password" ? (
              <ChangePasswordScreen />
            ) : (
              //@ts-ignore
              <EmployeeHierarchyPage userId={user?.id} />
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default EmployeeProfilePage;
