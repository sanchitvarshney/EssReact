import { useState } from "react";
import { Maximize, Minimize, LogOut } from "lucide-react";
import type { McGuardSession } from "../types/mscguardTypes";
import ConfirmDialog from "./ConfirmDialog";

// Search and notifications are left out for now rather than shown as dead
// UI — they'll be added once Advanced Search / a notifications source
// actually exist to back them.

interface TopbarProps {
  session: McGuardSession;
  onLogout: () => void;
}

export default function Topbar({ session, onLogout }: TopbarProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }

  const initial = session.fullName?.trim()?.[0]?.toUpperCase() || "?";

  return (
    <header className="h-[72px] shrink-0 sticky top-0 z-20 bg-white border-b border-gray-200 flex items-center justify-end gap-4 px-6">
      <button
        type="button"
        onClick={toggleFullscreen}
        className="text-gray-400 hover:text-gray-700 transition-colors"
        title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
      >
        {isFullscreen ? <Minimize size={19} /> : <Maximize size={19} />}
      </button>

      <div className="w-px h-8 bg-gray-200" />

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center text-white text-sm font-semibold">
          {initial}
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-gray-800">{session.fullName}</div>
          <div className="text-xs text-gray-400">{session.userRole}</div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setConfirmSignOut(true)}
        className="ml-3 text-gray-400 hover:text-red-500 transition-colors"
        title="Sign out"
      >
        <LogOut size={19} />
      </button>

      {confirmSignOut && (
        <ConfirmDialog
          title="Sign Out"
          message="Are you sure you want to sign out of MsCGuard?"
          confirmLabel="Sign Out"
          destructive
          onConfirm={onLogout}
          onCancel={() => setConfirmSignOut(false)}
        />
      )}
    </header>
  );
}
