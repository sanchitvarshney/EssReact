import { useState } from "react";
import { Smartphone, LifeBuoy } from "lucide-react";
import announcementBanner from "../../assets/announcement-banner.jpeg";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.mscorpres.essapp";
const APP_DEEP_LINK = "essapp://open";

// Static on purpose - this is a one-off, fixed-date announcement, not an
// admin-managed message (see note5: no admin config for this feature).
const DEFAULT_MESSAGE =
  "You will not be able to access the ESS Web Interface from 12-10-2026 onwards. Please continue using the ESS Mobile App on your Android device.";

interface WebAccessBlockedScreenProps {
  message?: string;
}

// Full-screen, non-dismissible. From 12-10-2026, an employee who already uses
// the ESS Android app is redirected here (useWebAccessBlockGuard.ts) instead
// of the normal ESS Web interface - rendered on its own dedicated route
// (/app-only, see routes.tsx), outside MainLayout, so none of the real app
// chrome ever mounts for a blocked session.
const WebAccessBlockedScreen: React.FC<WebAccessBlockedScreenProps> = ({ message = DEFAULT_MESSAGE }) => {
  const [fellBackToStore, setFellBackToStore] = useState(false);
  const isAndroid = /android/i.test(navigator.userAgent || "");

  const handleOpenApp = () => {
    if (!isAndroid) {
      window.open(PLAY_STORE_URL, "_blank");
      return;
    }
    // essapp://open only resolves to something when the app is actually
    // installed (AndroidManifest.xml intent-filter on MainActivity) - a tab
    // backgrounding (the OS switching to the app) is the "it worked" signal;
    // otherwise fall back to the Play Store after a short timeout, same
    // pattern as BACKEND/public/get-app.html.
    let fellBack = false;
    const toPlayStore = () => {
      if (fellBack) return;
      fellBack = true;
      setFellBackToStore(true);
      window.location.href = PLAY_STORE_URL;
    };
    const onVisibilityChange = () => {
      if (document.hidden) fellBack = true;
    };
    document.addEventListener("visibilitychange", onVisibilityChange, { once: true });
    window.location.href = APP_DEEP_LINK;
    setTimeout(toPlayStore, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-3xl flex flex-col items-center gap-6">
        <div className="relative w-full" style={{ aspectRatio: "800 / 478" }}>
          <img
            src={announcementBanner}
            alt=""
            className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
            draggable={false}
          />
          <div className="absolute top-[10%] bottom-[10%] left-[60%] right-[4%] flex items-center">
            <p className="text-[#d61f1f] font-bold leading-snug text-[clamp(13px,2.2vw,20px)]">
              {message}
            </p>
          </div>
        </div>

        <div className="w-full max-w-md flex flex-col items-center gap-4 text-center">
          <button
            type="button"
            onClick={handleOpenApp}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#00a0a0] to-[#007f86] hover:from-[#007f86] hover:to-[#00a0a0] transition-all shadow-sm"
          >
            <Smartphone className="h-4 w-4" />
            {isAndroid ? "Open MsC ESS App" : "Get MsC ESS on Google Play"}
          </button>
          {fellBackToStore && (
            <p className="text-xs text-gray-400">App not installed — redirecting to Play Store…</p>
          )}

          <p className="text-xs text-gray-500 leading-relaxed">
            If the app isn't installed on your phone, download it from the Play Store and continue
            there. If your phone is lost, unavailable, or you're otherwise unable to access it,
            please contact HR support for help.
          </p>

          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <LifeBuoy className="h-3.5 w-3.5" />
            <span>Need help? Reach out to HR support.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebAccessBlockedScreen;
