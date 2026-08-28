import { Clock } from "lucide-react";
import type { PendingRow } from "../types/mscguardTypes";
import { humanizeReportType } from "../utils/mscguardLabels";
import StatusPill from "./StatusPill";

function timeAgo(ms: number): string {
  const diffSec = Math.max(0, Math.floor((Date.now() - ms) / 1000));
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

interface PendingWidgetProps {
  rows: PendingRow[];
}

export default function PendingWidget({ rows }: PendingWidgetProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-5 lg:w-1/4 w-full">
      <div className="text-gray-800 font-semibold text-sm uppercase tracking-wide mb-1">
        Pending Approvals
      </div>
      <div className="text-gray-500 text-sm mb-4">
        {rows.length} request{rows.length === 1 ? "" : "s"} awaiting action.
      </div>

      {rows.length === 0 ? (
        <div className="text-gray-400 text-sm py-6 text-center">Nothing pending right now.</div>
      ) : (
        <div className="flex flex-col gap-4 max-h-[420px] overflow-y-auto pr-1">
          {rows.slice(0, 8).map((row) => (
            <div key={`${row.type}-${row.ref}`} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Clock size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm text-gray-800 font-medium truncate">{row.personName || row.ref}</div>
                <div className="text-xs text-gray-500 truncate">
                  {humanizeReportType(row.type)} · {timeAgo(row.createdAt)}
                </div>
                <div className="mt-1">
                  <StatusPill status={row.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
