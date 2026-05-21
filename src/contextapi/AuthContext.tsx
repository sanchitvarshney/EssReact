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
import {
  clearAiSurveyPendingForLogin,
  clearAiSurveyStorageForUser,
  syncAiSurveyStateWithUser,
} from "../helper/aiSurveyStorage";


interface AuthContextType {
  user: string | null;
  signIn: any;
  signOut: any;
 
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

 
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<any | null>({
    name: "",
    imgUrl: "",
    id: "",
  });
  const [searchValueLength, setSearchValueLength] = useState<any | null>(0);
   

   

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
      syncAiSurveyStateWithUser();
    }
  }, [dispatch]);

  useEffect(() => {
    signIn();
  }, [signIn]);

  const signOut = useCallback(() => {
    const storedUserStr = localStorage.getItem("user");
    let empCode: string | undefined;
    if (storedUserStr) {
      try {
        const storedUser = JSON.parse(storedUserStr);
        empCode = storedUser?.userID ?? storedUser?.empCode;
      } catch {
        empCode = undefined;
      }
    }

    clearAiSurveyPendingForLogin();
    if (empCode) clearAiSurveyStorageForUser(empCode);

    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    localStorage.removeItem("tabvalue");

    window.location.href = "/sign-in";
    setUser(null);
    localStorage.removeItem("cyberAlertAcknowledged");
  }, []);

  return (
    <AuthContext.Provider value={{ user,searchValueLength,signIn, signOut,setSearchValueLength }}>
      {children}
    </AuthContext.Provider>
  );
};
