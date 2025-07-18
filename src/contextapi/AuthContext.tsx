import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { setCredentials } from "../slices/authSlices";
import { useAppDispatch } from "../hooks/useReduxHook";
import { useGetHierarchyChatQuery } from "../services/hierarchy";
import { useToast } from "../hooks/useToast";

interface AuthContextType {
  user: string | null;
  signIn: any;
  signOut: any;
  hierarchyData: any;
  hierarchyError: any;
  hierarchyLoading: any;
  searchValueLength: any;
  setSearchValueLength: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { data: hierarchyData, error: hierarchyError, isLoading: hierarchyLoading } = useGetHierarchyChatQuery();
   const { showToast } = useToast();
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<any | null>({
    name: "",
    imgUrl: "",
    id: "",
  });
  const [searchValueLength, setSearchValueLength] = useState<any | null>(0);
   

   useEffect(() => {
      if (!hierarchyError) return;
  
      if (hierarchyError) {
        //@ts-ignore
        const errData = hierarchyError.data as { message?: string };
  
        showToast(errData?.message || "We're Sorry An unexpected error has occured. Our technical staff has been automatically notified and will be looking into this with utmost urgency.", "error");
      } else {
        //@ts-ignore
        showToast(error.message || "An unexpected error occurred", "error");
      }
    }, [hierarchyError]);

  const signIn = useCallback(() => {
    const storedUserStr = localStorage.getItem("user");
    
    if (storedUserStr) {
      const storedUser = JSON.parse(storedUserStr);
      dispatch(setCredentials({ token: storedUser?.token }));
      const userData = {
        name: storedUser.userName,
        imgUrl: storedUser.photo,
        id: storedUser.userID,
        role: storedUser.designation,
        dept: storedUser.department,
      };

      setUser(userData);
    }
  }, [dispatch]);

  useEffect(() => {
    signIn();
  }, [signIn]);

  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");

    window.location.href = "/sign-in";
  }, []);

  return (
    <AuthContext.Provider value={{ user,searchValueLength, hierarchyData,hierarchyError,hierarchyLoading,signIn, signOut,setSearchValueLength }}>
      {children}
    </AuthContext.Provider>
  );
};
