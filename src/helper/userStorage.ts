export type StoredUser = {
  token?: string;
  userID?: string;
  empCode?: string;
  other?: {
    displayAISurvey?: string;
  };
  [key: string]: unknown;
};

export const getStoredUser = (): StoredUser | null => {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
};

export const shouldDisplayAISurvey = (): boolean => {
  const user = getStoredUser();
  return user?.other?.displayAISurvey === "Y";
};
