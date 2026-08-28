import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { DatePickerField } from "../components/DatePickerField";
import { ErrorState } from "../components/AsyncState";
import { CardSkeleton, SkeletonBar } from "../components/Skeleton";
import TypeBreakdownCard from "../components/TypeBreakdownCard";
import { StatusPieChart, DepartmentBarChart } from "../components/Charts";
import { fetchDashboardSummary } from "../services/mscguardDashboard";
import type { DashboardSummaryData } from "../types/mscguardTypes";
import { humanizeGpStatus } from "../utils/mscguardLabels";

function aggregate(summary: DashboardSummaryData["summary"], key: "byStatus" | "byDepartment"): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const type of Object.values(summary)) {
    for (const [k, count] of Object.entries(type[key])) {
      totals[k] = (totals[k] || 0) + count;
    }
  }
  return totals;
}

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "loaded"; summary: DashboardSummaryData };

export default function Analytics() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate]);

  async function load() {
    setState({ status: "loading" });
    try {
      const from = fromDate ? new Date(`${fromDate}T00:00:00`).getTime() : undefined;
      const to = toDate ? new Date(`${toDate}T23:59:59`).getTime() : undefined;
      const summary = await fetchDashboardSummary(from, to);
      setState({ status: "loaded", summary });
    } catch (err) {
      setState({ status: "error", message: err instanceof Error ? err.message : "Something went wrong. Please try again." });
    }
  }

  const today = new Date();

  return (
    <div>
      <PageHeader eyebrow="Insights" title="Analytics" />

      <div className="flex flex-nowrap items-center gap-3 mb-6 overflow-x-auto pb-1">
        <DatePickerField value={fromDate} onChange={setFromDate} placeholder="From date" className="w-40 shrink-0" maxDate={today} />
        <span className="text-gray-500 text-sm shrink-0">to</span>
        <DatePickerField value={toDate} onChange={setToDate} placeholder="To date" className="w-40 shrink-0" maxDate={today} />
        {(fromDate || toDate) && (
          <button
            type="button"
            onClick={() => {
              setFromDate("");
              setToDate("");
            }}
            className="shrink-0 text-sm text-blue-700 hover:text-blue-600"
          >
            Clear range
          </button>
        )}
      </div>

      {state.status === "loading" && (
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-gray-200 rounded-md p-5">
            <SkeletonBar className="h-4 w-40 mb-4" />
            <SkeletonBar className="h-64 w-full" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      )}
      {state.status === "error" && <ErrorState message={state.message} onRetry={load} />}
      {state.status === "loaded" && (
        <div className="flex flex-col gap-4">
          <TypeBreakdownCard summary={state.summary.summary} />
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-md p-5">
              <div className="text-gray-800 font-semibold text-sm uppercase tracking-wide mb-2">By Status</div>
              <StatusPieChart
                data={Object.entries(aggregate(state.summary.summary, "byStatus")).map(([k, v]) => ({
                  label: humanizeGpStatus(k),
                  value: v,
                }))}
              />
            </div>
            <div className="bg-white border border-gray-200 rounded-md p-5">
              <div className="text-gray-800 font-semibold text-sm uppercase tracking-wide mb-2">By Department</div>
              <DepartmentBarChart
                data={Object.entries(aggregate(state.summary.summary, "byDepartment")).map(([k, v]) => ({ label: k, value: v }))}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
