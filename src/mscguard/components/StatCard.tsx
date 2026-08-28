import type { ComponentType } from "react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: ComponentType<{ size?: number; className?: string }>;
  iconBgClass: string; // e.g. "bg-blue-100 text-blue-700"
}

export default function StatCard({ label, value, icon: Icon, iconBgClass }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${iconBgClass}`}>
        <Icon size={22} />
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-800 leading-tight">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  );
}
