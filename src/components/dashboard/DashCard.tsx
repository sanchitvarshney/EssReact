import type { ReactNode } from "react";

type DashCardProps = {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

const DashCard = ({ title, action, children, className = "" }: DashCardProps) => (
  <section
    className={`bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(16,24,40,0.05)] p-4 ${className}`}
  >
    {(title || action) && (
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[13px] font-semibold text-gray-800">{title}</h3>
        {action}
      </div>
    )}
    {children}
  </section>
);

export default DashCard;
