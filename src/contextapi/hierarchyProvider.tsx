import React, { createContext, useContext, useEffect } from "react";
import type { ReactNode } from "react";

import { useGetHierarchyChatQuery } from "../services/hierarchy";
import { useToast } from "../hooks/useToast";

interface HierarchyContextType {
  hierarchyData: any;
  hierarchyError: any;
  hierarchyLoading: any;
}

const HierarchyContext = createContext<HierarchyContextType | undefined>(
  undefined
);

export const useHierarchy = () => {
  const context = useContext(HierarchyContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface HierarchyProviderProps {
  children: ReactNode;
}

export const HierarchyProvider: React.FC<HierarchyProviderProps> = ({
  children,
}) => {
  const {
    data: hierarchyData,
    error: hierarchyError,
    isLoading: hierarchyLoading,
  } = useGetHierarchyChatQuery();
  const { showToast } = useToast();

  useEffect(() => {
    if (!hierarchyError) return;

    if (hierarchyError) {
      //@ts-ignore
      const errData = hierarchyError.data as { message?: string };

      showToast(
        errData?.message ||
          "We're Sorry An unexpected error has occured. Our technical staff has been automatically notified and will be looking into this with utmost urgency.",
        "error"
      );
    } else {
      //@ts-ignore
      showToast(error.message || "An unexpected error occurred", "error");
    }
  }, [hierarchyError]);

  return (
    <HierarchyContext.Provider
      value={{ hierarchyData, hierarchyError, hierarchyLoading }}
    >
      {children}
    </HierarchyContext.Provider>
  );
};
