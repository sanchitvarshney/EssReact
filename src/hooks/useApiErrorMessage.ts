import { useEffect } from "react";

import { useToast } from "./useToast";

export function useApiErrorMessage({
  error,
  errorMessage,
  isError,
  isSuccess,
}: {
  error?: any;
  errorMessage?: any;
  isError?: boolean;
  isSuccess?: boolean;
}) {
  const { showToast } = useToast();
  useEffect(() => {
    if (!isError) return;

    const errData = error.data as { message?: string };

    showToast(
      errData?.message || error.message || "We're Sorry An unexpected error has occured. Our technical staff has been automatically notified and will be looking into this with utmost urgency.",
      "error"
    );
  }, [error]);

  useEffect(() => {
    if (!isSuccess) return;
    if (errorMessage?.msg || "We're Sorry An unexpected error has occured. Our technical staff has been automatically notified and will be looking into this with utmost urgency.") {
      showToast(errorMessage?.msg || "We're Sorry An unexpected error has occured. Our technical staff has been automatically notified and will be looking into this with utmost urgency.", "error");
    }
  }, [errorMessage?.msg]);
}
