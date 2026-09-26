export type MenuItem = {
  id: string;
  title: string;
  icon?: any; 
  path?: string;
  children?: MenuItem[];
};
