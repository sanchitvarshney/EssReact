export type profileOptionType = {
  id: string;
  name: string;
  icon: any;
  path: string;
};
export const profileOption: profileOptionType[] = [
  {
    id: "manage",
    name: "Manage Account",
    icon: "account",
    path: "/manage-account",
  },
  
  {
    id: "logout",
    name: "Logout",
    icon: "logout",
    path: "/logout",
  },
];
