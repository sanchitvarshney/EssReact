// Small shared loading/error/empty state blocks so every page renders these
// consistently instead of each re-inventing its own markup.

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return <div className="flex items-center justify-center py-24 text-gray-500 text-sm">{label}</div>;
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-md bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 flex items-center justify-between gap-4">
      <span>{message}</span>
      <button type="button" onClick={onRetry} className="underline font-medium shrink-0">
        Retry
      </button>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return <div className="text-gray-400 text-sm py-16 text-center">{message}</div>;
}
