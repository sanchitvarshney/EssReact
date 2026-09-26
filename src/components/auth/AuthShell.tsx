import type { ReactNode } from "react";
import logoImg from "../../assets/img/hrms_mscorpres_logo.png";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import BeachAccessOutlinedIcon from "@mui/icons-material/BeachAccessOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

type Props = {
  title: string;
  subtitle?: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

const FEATURES = [
  { icon: EventAvailableOutlinedIcon, label: "Attendance & shifts" },
  { icon: PaymentsOutlinedIcon, label: "Payslips & payroll" },
  { icon: BeachAccessOutlinedIcon, label: "Leaves & requests" },
  { icon: TaskAltOutlinedIcon, label: "Tasks & KRA" },
];

// Split-screen layout shared by the sign-in and password-recovery screens.
const AuthShell = ({ title, subtitle, icon, children, footer }: Props) => (
  <div className="min-h-screen w-full flex bg-[#f1f7f7]">
    {/* Brand panel */}
    <aside
      className="hidden lg:flex relative w-[48%] xl:w-[52%] flex-col justify-between overflow-hidden text-white p-12 xl:p-16"
      style={{ background: "linear-gradient(140deg, #0f2f3a 0%, #0b5563 50%, #00a0a0 100%)" }}
    >
      <div className="pointer-events-none absolute -right-24 -top-28 w-[420px] h-[420px] rounded-full border-[44px] border-white/5" />
      <div className="pointer-events-none absolute -left-20 bottom-10 w-[300px] h-[300px] rounded-full bg-white/5" />
      <div className="pointer-events-none absolute right-16 bottom-[-90px] w-[260px] h-[260px] rounded-full border-[30px] border-white/5" />

      <div className="relative">
        <div className="inline-flex bg-white rounded-2xl px-5 py-3 shadow-xl">
          <img src={logoImg} alt="mscorpres" className="h-10 w-auto" />
        </div>
      </div>

      <div className="relative max-w-lg">
        <p className="text-[11px] uppercase tracking-[0.25em] text-teal-200/80 mb-4">Employee Self Service</p>
        <h1 className="text-4xl xl:text-5xl font-bold leading-[1.15]">
          Your work life,
          <br />
          <span className="text-teal-200">all in one place.</span>
        </h1>
        <p className="mt-5 text-white/70 text-base leading-relaxed">
          Attendance, payslips, leaves, tasks and team updates - everything you need at work, just a sign-in away.
        </p>

        <div className="mt-9 grid grid-cols-2 gap-3">
          {FEATURES.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-3"
            >
              <span className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                <Icon sx={{ fontSize: 19 }} />
              </span>
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="relative text-xs text-white/50 flex items-center gap-2">
        <ShieldOutlinedIcon sx={{ fontSize: 15 }} />
        Secured sign-in with reCAPTCHA protection
      </p>
    </aside>

    {/* Form side */}
    <main className="flex-1 flex flex-col min-w-0">
      {/* Mobile brand strip */}
      <div
        className="lg:hidden px-6 py-6 text-white"
        style={{ background: "linear-gradient(120deg, #0f2f3a 0%, #0b5563 50%, #00a0a0 100%)" }}
      >
        <div className="inline-flex bg-white rounded-xl px-3.5 py-2 shadow-lg">
          <img src={logoImg} alt="mscorpres" className="h-8 w-auto" />
        </div>
        <p className="mt-4 text-lg font-bold">Employee Self Service</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-5 sm:p-8">
        <div className="w-full max-w-[440px]">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_20px_60px_-20px_rgba(15,47,58,0.25)] px-7 sm:px-9 py-9">
            <div className="mb-7">
              {icon && (
                <span className="w-12 h-12 rounded-2xl bg-[#e0f6f6] text-[#007f86] flex items-center justify-center mb-4">
                  {icon}
                </span>
              )}
              <h2 className="text-2xl font-bold text-gray-800 tracking-tight">{title}</h2>
              {subtitle && <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{subtitle}</p>}
            </div>
            {children}
          </div>

          {footer && <div className="text-center text-xs text-gray-400 mt-6">{footer}</div>}
        </div>
      </div>
    </main>
  </div>
);

export default AuthShell;
