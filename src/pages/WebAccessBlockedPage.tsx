import WebAccessBlockedScreen from "../components/reuseable/WebAccessBlockedScreen";
import { useWebAccessBlockGuard } from "../hooks/useWebAccessBlockGuard";

// Dedicated route (/app-only, see routes.tsx) - runs the same guard hook as
// MainLayout so this page also redirects itself back to "/" the moment the
// employee is no longer blocked (e.g. HRMS admin resets their device under
// "ESS App > Users"), without needing a fresh login.
const WebAccessBlockedPage = () => {
  useWebAccessBlockGuard();
  return <WebAccessBlockedScreen />;
};

export default WebAccessBlockedPage;
