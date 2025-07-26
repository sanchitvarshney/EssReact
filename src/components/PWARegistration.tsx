import { useEffect } from "react";
import { usePWA } from "../hooks/usePWA";

export const PWARegistration = () => {
  const { isInstalled, canInstall, installApp } = usePWA();

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("SW registered: ", registration);
          })
          .catch((registrationError) => {
            console.log("SW registration failed: ", registrationError);
          });
      });
    }
  }, []);

  const handleInstallClick = async () => {
    const success = await installApp();
    if (success) {
      console.log('App installed successfully');
    } else {
      console.log('App installation was dismissed');
    }
  };

  // Don't render anything if not needed
  if (!canInstall || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-999">
      <button
        onClick={handleInstallClick}
        className="bg-[#018c85] text-white px-4 py-2 rounded-lg shadow-lg hover:bg-[#016c65] transition-colors flex items-center gap-2"
      >
        <span>📱</span>
        Install App
      </button>
    </div>
  );
};

export default PWARegistration;
