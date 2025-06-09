export type MenuItem = {
  id: string;
  title: string;
  icon?: any; 
  path?: string;
  children?: MenuItem[];
};
export type EmployeeProfileType = {
  name: string;
  role: string;
  employeeId: string;
  email: string;
};
