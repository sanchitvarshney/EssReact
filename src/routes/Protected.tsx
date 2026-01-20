
import React, { useEffect, useCallback, type ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/hrms_mscorpres_logo.png";
import AppLoader from "../pages/AppLoader";

interface ProtectedProps {
  children: ReactNode;
  authentication?: boolean;
}

const Protected: React.FC<ProtectedProps> = ({
  children,
  authentication = true,
}) => {
  const navigate = useNavigate();
 const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = !!sessionStorage.getItem("user");

  const checkAuth = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (authentication && !isAuthenticated) {
      navigate("/sign-in");
      return;
    }

    if (!authentication && isAuthenticated) {
      navigate("/");
      return;
    }
      setIsLoading(false);
  }, [authentication, navigate, isAuthenticated]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

   if (isLoading) {
    return (
    <AppLoader logo={logo} />
    );
  }

  return <>{children}</>;
};

export default Protected;
