import {
  getDisplayAISurveyFlag,
  getStoredUser,
  shouldDisplayAISurvey,
} from "./userStorage";

const PREFIX = "aiSurvey";

const getEmpCode = (): string | null => {
  const user = getStoredUser();
  const code = user?.userID ?? user?.empCode;
  return typeof code === "string" && code.length > 0 ? code : null;
};

const storageKey = (suffix: string, empCode: string) =>
  `${PREFIX}_${suffix}_${empCode}`;

export const getAiSurveyEmpCode = (): string | null => getEmpCode();

/** Keep local flags aligned with API `displayAISurvey` on the stored user. */
export const syncAiSurveyStateWithUser = (): void => {
  const empCode = getEmpCode();
  const flag = getDisplayAISurveyFlag();

  if (flag !== "Y") {
    clearAiSurveyPendingForLogin();
    if (empCode) {
      localStorage.removeItem(storageKey("completed", empCode));
    }
    return;
  }

  if (empCode) {
    localStorage.removeItem(storageKey("completed", empCode));
  }
};

export const shouldShowAiSurvey = (): boolean => shouldDisplayAISurvey();

const LOGIN_PENDING_KEY = `${PREFIX}_showAfterLogin`;

export const markAiSurveyPendingForLogin = (): void => {
  syncAiSurveyStateWithUser();
  if (!shouldDisplayAISurvey()) return;
  sessionStorage.setItem(LOGIN_PENDING_KEY, "true");
};

export const isAiSurveyPendingForLogin = (): boolean =>
  sessionStorage.getItem(LOGIN_PENDING_KEY) === "true";

export const clearAiSurveyPendingForLogin = (): void => {
  sessionStorage.removeItem(LOGIN_PENDING_KEY);
};

export const shouldOpenAiSurveyOnHome = (): boolean => {
  syncAiSurveyStateWithUser();
  return shouldShowAiSurvey() && isAiSurveyPendingForLogin();
};

export const clearAiSurveyStorageForUser = (empCode?: string): void => {
  const code = empCode ?? getEmpCode();
  if (!code) return;
  localStorage.removeItem(storageKey("completed", code));
};
