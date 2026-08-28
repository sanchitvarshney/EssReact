import type { ReportSummary } from "../types/mscguardTypes";
import { humanizeReportType } from "../utils/mscguardLabels";
import { TypeBarChart } from "./Charts";

// Real totals-by-type snapshot, not a trend/line chart — the summary
// endpoint only gives a point-in-time count, not a time series, so a line
// chart would have nothing real to plot.
interface TypeBreakdownCardProps {
  summary: ReportSummary;
}

export default function TypeBreakdownCard({ summary }: TypeBreakdownCardProps) {
  const data = Object.entries(summary).map(([type, v]) => ({ label: humanizeReportType(type), value: v.total }));

  return (
    <div className="bg-white border border-gray-200 rounded-md p-5 lg:w-3/4 w-full">
      <div className="text-gray-800 font-semibold text-sm uppercase tracking-wide mb-1">
        Requests by Type
      </div>
      <div className="text-gray-500 text-sm mb-2">All-time totals across every request type.</div>
      <TypeBarChart data={data} />
    </div>
  );
}
