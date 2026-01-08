import React, { useEffect, useCallback, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedProps {
  children: ReactNode;
  authentication?: boolean;
}

const Protected: React.FC<ProtectedProps> = ({
  children,
  authentication = true,
}) => {
  const navigate = useNavigate();

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
  }, [authentication, navigate, isAuthenticated]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
};

export default Protected;
