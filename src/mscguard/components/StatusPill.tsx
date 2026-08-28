import { humanizeGpStatus } from "../utils/mscguardLabels";

// Mirrors the EJS dashboard's pill color logic (p-pending/p-approved/p-force/p-rejected).
function pillClasses(status: string): string {
  if (status === "approved" || status === "approved_guard") return "bg-green-100 text-green-700";
  if (status === "force_approved") return "bg-pink-100 text-pink-700";
  if (status === "rejected") return "bg-red-100 text-red-700";
  return "bg-amber-100 text-amber-700";
}

export default function StatusPill({ status }: { status: string }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${pillClasses(status)}`}>
      {humanizeGpStatus(status)}
    </span>
  );
}
