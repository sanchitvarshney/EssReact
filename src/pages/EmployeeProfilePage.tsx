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
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";

const TABS = [
  { id: "info", label: "Information", hint: "Personal & contact details", icon: BadgeIcon },
  { id: "chart", label: "Hierarchy", hint: "Your reporting line", icon: AccountTreeIcon },
  { id: "password", label: "Security", hint: "Change your password", icon: LockIcon },
];

const EmployeeProfilePage = () => {
  const { showToast } = useToast();
  const [value, setValue] = useState("info");
  const { user } = useAuth();
  const u: any = user ?? {};
  const [getuserdata, { isLoading, data, error }] = useGetuserdataMutation();

  useEffect(() => {
    if (user) {
      getuserdata({ logedINUser: u.id }).unwrap();
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      //@ts-ignore
      showToast(error?.data?.message || "An unexpected error has occurred.", "error");
    }
  }, [error]);

  const basic = data?.result?.basic?.[0] ?? {};
  const facts = [
    { label: "Joined", value: basic.doj, icon: EventAvailableOutlinedIcon },
    { label: "Email", value: basic.email, icon: MailOutlineIcon },
    { label: "Mobile", value: basic.mobile, icon: PhoneIphoneIcon },
  ].filter((f) => f.value);

  return (
    <div className="w-full h-full overflow-y-auto custom-scrollbar-for-menu px-3 py-4">
      {isLoading ? (
        <EmployeeProfilePageSkeleton />
      ) : (
        <div className="max-w-6xl mx-auto flex flex-col gap-4">
          {/* ── Cover hero ── */}
          <section
            className="relative overflow-hidden rounded-3xl text-white px-5 sm:px-8 py-6 sm:py-8"
            style={{ background: "linear-gradient(120deg, #0f2f3a 0%, #0b5563 50%, #00a0a0 100%)" }}
          >
            <div className="pointer-events-none absolute -right-14 -top-24 w-72 h-72 rounded-full border-[30px] border-white/5" />
            <div className="pointer-events-none absolute right-28 -bottom-20 w-52 h-52 rounded-full bg-white/5" />

            <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
              <Avatar
                src={u.imgUrl}
                alt={u.name}
                variant="rounded"
                sx={{
                  width: 112,
                  height: 112,
                  borderRadius: "24px",
                  border: "4px solid rgba(255,255,255,0.9)",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.3)",
                  backgroundColor: "#00a0a0",
                  pointerEvents: "none",
                  userSelect: "none",
                  fontSize: 40,
                  fontWeight: 700,
                }}
              >
                {u.name?.charAt(0)}
              </Avatar>

              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-widest text-white/60">My profile</p>
                <h1 className="text-2xl sm:text-3xl font-bold leading-tight truncate">{u.name}</h1>
                <div className="flex flex-wrap gap-2 mt-3">
                  {u.id && (
                    <span className="text-[11px] font-mono font-semibold bg-white/15 px-3 py-1 rounded-full">{u.id}</span>
                  )}
                  {u.role && (
                    <span className="text-[11px] font-semibold bg-white/15 px-3 py-1 rounded-full">{u.role}</span>
                  )}
                  {u.dept && (
                    <span className="text-[11px] font-semibold bg-teal-300/25 text-teal-100 px-3 py-1 rounded-full">
                      {u.dept}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ── Nav + content ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-4 items-start">
            <aside className="flex flex-col gap-4 lg:sticky lg:top-0">
              <nav className="bg-white rounded-3xl border border-gray-100 shadow-[0_1px_4px_rgba(16,24,40,0.05)] p-2 flex lg:flex-col gap-1 overflow-x-auto">
                {TABS.map(({ id, label, hint, icon: Icon }) => {
                  const on = value === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setValue(id)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left transition-all cursor-pointer flex-shrink-0 lg:flex-shrink ${
                        on ? "text-white shadow-md bg-gradient-to-r from-[#00a0a0] to-[#007f86]" : "text-gray-600 hover:bg-[#f0fbfb]"
                      }`}
                    >
                      <span
                        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          on ? "bg-white/20" : "bg-[#e0f6f6] text-[#007f86]"
                        }`}
                      >
                        <Icon sx={{ fontSize: 18 }} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold whitespace-nowrap">{label}</span>
                        <span className={`hidden lg:block text-[11px] truncate ${on ? "text-white/70" : "text-gray-400"}`}>
                          {hint}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </nav>

              {facts.length > 0 && (
                <div className="hidden lg:block bg-white rounded-3xl border border-gray-100 shadow-[0_1px_4px_rgba(16,24,40,0.05)] p-4">
                  <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-3">At a glance</p>
                  <div className="space-y-3">
                    {facts.map(({ label, value: v, icon: Icon }) => (
                      <div key={label} className="flex items-center gap-3">
                        <Icon sx={{ fontSize: 18, color: "#00a0a0" }} />
                        <div className="min-w-0">
                          <p className="text-[10px] text-gray-400 leading-tight">{label}</p>
                          <p className="text-xs font-medium text-gray-700 truncate">{v}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>

            <div className="min-w-0">
              {value === "info" ? (
                <EmployeeInformationPage data={data} />
              ) : value === "password" ? (
                <ChangePasswordScreen />
              ) : (
                <EmployeeHierarchyPage userId={u.id} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeProfilePage;
