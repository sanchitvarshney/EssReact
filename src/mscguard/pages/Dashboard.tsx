import { useEffect, useState } from "react";
import { IdCard, Package, Clock3, ListChecks } from "lucide-react";
import { fetchDashboardSummary, fetchPendingList } from "../services/mscguardDashboard";
import type { DashboardSummaryData, PendingRow } from "../types/mscguardTypes";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import TypeBreakdownCard from "../components/TypeBreakdownCard";
import PendingWidget from "../components/PendingWidget";
import { ErrorState } from "../components/AsyncState";
import { CardSkeleton, SkeletonBar } from "../components/Skeleton";
import { SecondaryButton } from "../components/FormControls";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "loaded"; summary: DashboardSummaryData; pending: PendingRow[] };

export default function Dashboard() {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setState({ status: "loading" });
    try {
      const [summary, pending] = await Promise.all([fetchDashboardSummary(), fetchPendingList()]);
      setState({ status: "loaded", summary, pending });
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Something went wrong. Please try again.",
      });
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        actions={
          state.status === "loaded" && (
            <SecondaryButton onClick={loadDashboard}>Refresh</SecondaryButton>
          )
        }
      />

      {state.status === "loading" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="bg-white border border-gray-200 rounded-md p-5 lg:w-3/4 w-full">
              <SkeletonBar className="h-4 w-40 mb-4" />
              <SkeletonBar className="h-56 w-full" />
            </div>
            <div className="bg-white border border-gray-200 rounded-md p-5 lg:w-1/4 w-full">
              <SkeletonBar className="h-4 w-32 mb-4" />
              <div className="flex flex-col gap-3">
                <SkeletonBar className="h-10 w-full" />
                <SkeletonBar className="h-10 w-full" />
                <SkeletonBar className="h-10 w-full" />
              </div>
            </div>
          </div>
        </>
      )}
      {state.status === "error" && <ErrorState message={state.message} onRetry={loadDashboard} />}

      {state.status === "loaded" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Total Requests"
              value={state.summary.totalRows}
              icon={ListChecks}
              iconBgClass="bg-blue-100 text-blue-700"
            />
            <StatCard
              label="Pending Approvals"
              value={state.pending.length}
              icon={Clock3}
              iconBgClass="bg-amber-100 text-amber-600"
            />
            <StatCard
              label="Employee Gate Passes"
              value={state.summary.summary.employee_gatepass?.total ?? 0}
              icon={IdCard}
              iconBgClass="bg-green-100 text-green-600"
            />
            <StatCard
              label="Material Movements"
              value={
                (state.summary.summary.material_gatepass?.total ?? 0) +
                (state.summary.summary.material_in?.total ?? 0) +
                (state.summary.summary.material_out?.total ?? 0)
              }
              icon={Package}
              iconBgClass="bg-purple-100 text-purple-600"
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <TypeBreakdownCard summary={state.summary.summary} />
            <PendingWidget rows={state.pending} />
          </div>
        </>
      )}
    </div>
  );
}
