import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getMscGuardSession, logoutMscGuard } from "../services/mscguardAuth";
import { ToastProvider } from "../components/ToastProvider";
import "../mscguard.css";

export default function McGuardLayout() {
  const navigate = useNavigate();
  const session = getMscGuardSession();

  // McGuardProtected already guarantees a session exists before this layout
  // mounts, but guard here too in case it's ever reused without that wrapper.
  if (!session) return null;

  function handleLogout() {
    logoutMscGuard();
    navigate("/gp/sp/login", { replace: true });
  }

  return (
    <ToastProvider>
      <div className="mscguard-font flex min-h-screen bg-gray-50">
        <Sidebar userRole={session.userRole} />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar session={session} onLogout={handleLogout} />
          <main className="flex-1 p-6 overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
