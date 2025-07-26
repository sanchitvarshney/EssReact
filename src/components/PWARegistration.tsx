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
    <div className="fixed bottom-2 right-2 z-50">
      <button
        onClick={handleInstallClick}
        className=" text-white  rounded-lg shadow-lg  flex items-center gap-2"
      >
        <span>📱</span>
        Install App
      </button>
    </div>
  );
};

export default PWARegistration;
