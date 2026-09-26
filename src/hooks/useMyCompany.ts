import { useAuth } from "../contextapi/AuthContext";
import { useGetMyCompanyInfoQuery } from "../services/auth";
import { getStoredUser } from "../helper/userStorage";

export type CompanyBlock = { name: string; address: string; address_lines: string[] };

export type MyCompanyInfo = {
  company: CompanyBlock;
  branch: CompanyBlock | null;
  headquarter: CompanyBlock;
};

/**
 * Company, branch and head-office details of the signed-in employee. POST /login/login returns them as
 * `companyInfo`, kept with the stored login; a session that logged in before that (or a stored value that
 * is missing) asks GET /dashboard/emp/company-info once - one cached request shared by the header and the sidebar.
 */
export const useMyCompany = () => {
  const { user } = useAuth();
  const empCode = (user as any)?.id as string | undefined;
  const fromLogin = (getStoredUser()?.companyInfo as MyCompanyInfo | undefined) || undefined;
  const { data } = useGetMyCompanyInfoQuery(undefined, { skip: !!fromLogin || !empCode });
  const info: MyCompanyInfo | undefined = fromLogin ?? data?.data;

  return {
    company: info?.company?.name || undefined,
    branch: info?.branch?.name || undefined,
    companyInfo: info,
  };
};
