import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getMscGuardSession } from "../services/mscguardAuth";

export default function McGuardProtected({ children }: { children: ReactNode }) {
  const session = getMscGuardSession();
  if (!session) return <Navigate to="/gp/sp/login" replace />;
  return <>{children}</>;
}
