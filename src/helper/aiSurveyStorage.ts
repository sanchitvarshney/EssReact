import {
  getDisplayAISurveyFlag,
  getStoredUser,
  shouldDisplayAISurvey,
} from "./userStorage";

const PREFIX = "aiSurvey";

const toDateKey = (date: Date) => date.toISOString().slice(0, 10);

const diffCalendarDays = (from: string, to: string) => {
  const start = new Date(`${from}T00:00:00`);
  const end = new Date(`${to}T00:00:00`);
  const ms = end.getTime() - start.getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
};

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

  // API says Y — remove stale "completed" so survey can show again after reset
  if (empCode) {
    localStorage.removeItem(storageKey("completed", empCode));
  }
};

export const getAiSurveyDay = (): number => {
  const empCode = getEmpCode();
  if (!empCode) return 1;

  const today = toDateKey(new Date());
  const firstSeenKey = storageKey("firstSeen", empCode);
  const firstSeen = localStorage.getItem(firstSeenKey);

  if (!firstSeen) {
    localStorage.setItem(firstSeenKey, today);
    return 1;
  }

  return diffCalendarDays(firstSeen, today) + 1;
};

export const isAiSurveyMandatory = (): boolean => getAiSurveyDay() >= 3;

/** API flag is the source of truth for whether the survey applies. */
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
  localStorage.removeItem(storageKey("firstSeen", code));
};
