import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DEFAULT_PAGE_SIZE = 10;

/** Client-side pagination over an already-fetched array — every MsCGuard
 *  list page loads its full result set in one call, so paging it here (vs.
 *  the backend) keeps every page's data-fetching logic unchanged. Resets to
 *  page 1 whenever the source array itself changes (new search/filter). */
export function usePagination<T>(rows: T[], pageSize: number = DEFAULT_PAGE_SIZE) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [rows]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const pageRows = useMemo(
    () => rows.slice((safePage - 1) * pageSize, safePage * pageSize),
    [rows, safePage, pageSize]
  );

  return { pageRows, page: safePage, setPage, totalPages, total: rows.length, pageSize };
}

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, total, pageSize, onPageChange }: PaginationProps) {
  if (total === 0) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  // A small window of page numbers centered on the current page.
  const windowSize = 5;
  let start = Math.max(1, page - Math.floor(windowSize / 2));
  const end = Math.min(totalPages, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);
  const pageNumbers = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const controls = (
    <div className="flex items-center justify-between text-sm h-16 px-6">
      <div className="text-gray-500">
        Showing {from}–{to} of {total}
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          <ChevronLeft size={16} />
        </button>
        {start > 1 && <span className="px-1 text-gray-400">…</span>}
        {pageNumbers.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onPageChange(n)}
            className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${
              n === page ? "bg-blue-700 text-white" : "border border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {n}
          </button>
        ))}
        {end < totalPages && <span className="px-1 text-gray-400">…</span>}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Flow-position spacer holding the gap the fixed bar below would
          otherwise cover, so the last table row is never hidden behind it. */}
      <div className="h-16" aria-hidden="true" />
      {/* Fixed to the viewport (not just the page) so pagination stays
          visible without scrolling all the way down — matches Topbar's
          sticky-to-top behavior, mirrored at the bottom. left-80 matches
          Sidebar's w-80; z-30 keeps it under Modal/Drawer's z-50. */}
      <div className="fixed bottom-0 left-80 right-0 z-30 bg-white border-t border-gray-200">{controls}</div>
    </>
  );
}
