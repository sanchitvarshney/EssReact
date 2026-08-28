import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  actions?: ReactNode;
}

export default function PageHeader({ eyebrow, title, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{eyebrow}</div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
