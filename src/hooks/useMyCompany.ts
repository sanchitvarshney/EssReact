import { useAuth } from "../contextapi/AuthContext";
import { useGetEmployeeDetailsQuery } from "../services/auth";

/** Company + branch of the logged-in employee (one cached request, shared by the header and the sidebar). */
export const useMyCompany = () => {
  const { user } = useAuth();
  const empCode = (user as any)?.id as string | undefined;
  const { data } = useGetEmployeeDetailsQuery({ empcode: empCode }, { skip: !empCode });

  return {
    company: (data?.companyInfo?.name as string | undefined) || undefined,
    branch: (data?.companyInfo?.branch as string | undefined) || undefined,
  };
};
