
import React, { useEffect, useCallback, type ReactNode, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/img/hrms_mscorpres_logo.png";
import AppLoader from "../pages/AppLoader";
import { storeReturnToPath } from "../helper/returnTo";

interface ProtectedProps {
  children: ReactNode;
  authentication?: boolean;
}

const Protected: React.FC<ProtectedProps> = ({
  children,
  authentication = true,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = !!sessionStorage.getItem("user") || !!localStorage.getItem("user");

  const checkAuth = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (authentication && !isAuthenticated) {
      const intendedUrl = `${location.pathname}${location.search}${location.hash}`;
      storeReturnToPath(intendedUrl);
      navigate("/sign-in", { replace: true });
      return;
    }

    if (!authentication && isAuthenticated) {
      navigate("/", { replace: true });
      return;
    }
    setIsLoading(false);
  }, [authentication, isAuthenticated, location.hash, location.pathname, location.search, navigate]);

  useEffect(() => {
    checkAuth();
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <AppLoader logo={logo} />
    );
  }

  return <>{children}</>;
};

export default Protected;
