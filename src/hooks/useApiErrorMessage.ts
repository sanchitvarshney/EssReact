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
      errData?.message || error.message || "Something went wrong",
      "error"
    );
  }, [error]);

  useEffect(() => {
    if (!isSuccess) return;
    if (errorMessage?.msg || "Something went wrong") {
      showToast(errorMessage?.msg || "Something went wrong", "error");
    }
  }, [errorMessage?.msg]);
}
