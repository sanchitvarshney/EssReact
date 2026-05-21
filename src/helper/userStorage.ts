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

export const getDisplayAISurveyFlag = (
  user?: StoredUser | null
): string | undefined => {
  const stored = user ?? getStoredUser();
  return stored?.other?.displayAISurvey;
};

export const shouldDisplayAISurvey = (): boolean =>
  getDisplayAISurveyFlag() === "Y";

/** Login API may return `other` on the response root, not inside `data`. */
export const buildStoredUserFromLoginResponse = (
  response: Record<string, unknown>
): StoredUser => {
  const userData = (response?.data ?? response) as Record<string, unknown>;
  const other = (response?.other ?? userData?.other) as
    | StoredUser["other"]
    | undefined;

  return {
    ...userData,
    other,
  } as StoredUser;
};

export const persistLoginUser = (
  response: Record<string, unknown>
): StoredUser => {
  const user = buildStoredUserFromLoginResponse(response);
  const serialized = JSON.stringify(user);
  localStorage.setItem("user", serialized);
  sessionStorage.setItem("user", serialized);
  return user;
};

export const updateStoredUserDisplayAISurvey = (value: string): void => {
  const user = getStoredUser();
  if (!user) return;

  const updated: StoredUser = {
    ...user,
    other: {
      ...user.other,
      displayAISurvey: value,
    },
  };

  const serialized = JSON.stringify(updated);
  localStorage.setItem("user", serialized);
  sessionStorage.setItem("user", serialized);
};
