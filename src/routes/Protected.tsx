import React, { useEffect, useCallback, type ReactNode, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/img/hrms_mscorpres_logo.png";
import AppLoader from "../pages/AppLoader";
import { storeReturnToPath } from "../helper/returnTo";

interface ProtectedProps {
  children: ReactNode;
  authentication?: boolean;
}
const SPLASH_DELAY = 3200;
const AUTH_DELAY = 500;

const Protected: React.FC<ProtectedProps> = ({
  children,
  authentication = true,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [showApp, setShowApp] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowApp(false);
    }, SPLASH_DELAY);

    return () => clearTimeout(timer);
  }, []);

  const checkAuth = useCallback(() => {
    const run = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, AUTH_DELAY));

        const currentAuth =
          !!sessionStorage.getItem("user") || !!localStorage.getItem("user");

        if (authentication && !currentAuth) {
          const intendedUrl = `${location.pathname}${location.search}${location.hash}`;
          storeReturnToPath(intendedUrl);

          navigate("/sign-in", { replace: true });
          return;
        }

        if (!authentication && currentAuth) {
          navigate("/", { replace: true });
          return;
        }
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, [authentication, location, navigate]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const isBusy = isLoading || showApp;

  if (isBusy) {
    return <AppLoader logo={logo} />;
  }

  return <>{children}</>;
};

export default Protected;
