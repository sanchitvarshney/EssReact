export type MenuItem = {
  id: string;
  title: string;
  icon?: string; 
  path?: string;
  children?: MenuItem[];
};
