import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckCircle2, AlertTriangle, XCircle, X } from "lucide-react";

type ToastKind = "success" | "warning" | "error";

interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastContextValue {
  success: (message: string) => void;
  warning: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const KIND_STYLES: Record<ToastKind, { icon: typeof CheckCircle2; bg: string; border: string; text: string; iconColor: string }> = {
  success: { icon: CheckCircle2, bg: "bg-green-50", border: "border-green-200", text: "text-green-800", iconColor: "text-green-500" },
  warning: { icon: AlertTriangle, bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", iconColor: "text-amber-500" },
  error: { icon: XCircle, bg: "bg-red-50", border: "border-red-200", text: "text-red-800", iconColor: "text-red-500" },
};

const AUTO_DISMISS_MS = 4500;
let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (kind: ToastKind, message: string) => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, kind, message }]);
      setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    },
    [dismiss]
  );

  const value: ToastContextValue = {
    success: (message) => push("success", message),
    warning: (message) => push("warning", message),
    error: (message) => push("error", message),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm">
        {toasts.map((toast) => {
          const style = KIND_STYLES[toast.kind];
          const Icon = style.icon;
          return (
            <div
              key={toast.id}
              className={`flex items-start gap-2.5 rounded-md border px-4 py-3 shadow-lg ${style.bg} ${style.border}`}
            >
              <Icon size={18} className={`shrink-0 mt-0.5 ${style.iconColor}`} />
              <div className={`flex-1 text-sm ${style.text}`}>{toast.message}</div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className={`shrink-0 ${style.text} opacity-60 hover:opacity-100`}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
