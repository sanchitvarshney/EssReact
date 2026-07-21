import {
  getAssetConfirmationFlag,
  getStoredUser,
  shouldDisplayAssetConfirmation,
} from "./userStorage";

const PREFIX = "assetConfirmation";

const getEmpCode = (): string | null => {
  const user = getStoredUser();
  const code = user?.userID ?? user?.empCode;
  return typeof code === "string" && code.length > 0 ? code : null;
};

const storageKey = (suffix: string, empCode: string) =>
  `${PREFIX}_${suffix}_${empCode}`;

export const getAssetConfirmationEmpCode = (): string | null => getEmpCode();

/** Keep local flags aligned with API `assetConfirmation` on the stored user. */
export const syncAssetConfirmationStateWithUser = (): void => {
  const empCode = getEmpCode();
  const flag = getAssetConfirmationFlag();

  if (flag !== "Y") {
    clearAssetConfirmationPendingForLogin();
    if (empCode) {
      localStorage.removeItem(storageKey("completed", empCode));
    }
    return;
  }

  if (empCode) {
    localStorage.removeItem(storageKey("completed", empCode));
  }
};

export const shouldShowAssetConfirmation = (): boolean =>
  shouldDisplayAssetConfirmation();

const LOGIN_PENDING_KEY = `${PREFIX}_showAfterLogin`;

export const markAssetConfirmationPendingForLogin = (): void => {
  syncAssetConfirmationStateWithUser();
  if (!shouldDisplayAssetConfirmation()) return;
  // localStorage (not sessionStorage): this flag must survive the user
  // closing the browser tab, otherwise the mandatory drawer silently
  // stops reappearing even though verification was never completed.
  localStorage.setItem(LOGIN_PENDING_KEY, "true");
};

export const isAssetConfirmationPendingForLogin = (): boolean =>
  localStorage.getItem(LOGIN_PENDING_KEY) === "true";

export const clearAssetConfirmationPendingForLogin = (): void => {
  localStorage.removeItem(LOGIN_PENDING_KEY);
};

export const shouldOpenAssetConfirmation = (): boolean => {
  syncAssetConfirmationStateWithUser();
  return shouldShowAssetConfirmation() && isAssetConfirmationPendingForLogin();
};

export const clearAssetConfirmationStorageForUser = (
  empCode?: string
): void => {
  const code = empCode ?? getEmpCode();
  if (!code) return;
  localStorage.removeItem(storageKey("completed", code));
};
