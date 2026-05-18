const RETURN_TO_KEY = "returnTo";
const DEFAULT_REDIRECT_PATH = "/";

const hasExternalPattern = (value: string) =>
  value.includes("://") || value.startsWith("//");

export const isSafeReturnToPath = (
  value: string | null | undefined
): value is string => {
  if (!value) return false;
  if (!value.startsWith("/")) return false;
  if (hasExternalPattern(value)) return false;
  return true;
};

export const storeReturnToPath = (value: string) => {
  if (!isSafeReturnToPath(value)) return;
  sessionStorage.setItem(RETURN_TO_KEY, value);
};

export const consumeReturnToPath = (): string => {
  const stored = sessionStorage.getItem(RETURN_TO_KEY);
  sessionStorage.removeItem(RETURN_TO_KEY);
  if (!isSafeReturnToPath(stored)) {
    return DEFAULT_REDIRECT_PATH;
  }
  return stored;
};

export const getDefaultRedirectPath = () => DEFAULT_REDIRECT_PATH;
