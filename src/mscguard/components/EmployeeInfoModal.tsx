import type { ReactNode } from "react";
import Modal from "./Modal";
import { FormSkeleton } from "./Skeleton";

export interface EmployeeInfoField {
  label: string;
  value: ReactNode;
}

interface EmployeeInfoModalProps {
  title: string;
  subtitle?: string | null;
  fields: EmployeeInfoField[];
  onClose: () => void;
  loading?: boolean;
}

/** Shared "click a name/code, see everything we have on them" detail modal —
 *  used the same way across Attendance, Employee Codes, and Emp/Manager
 *  Hierarchy so it looks and behaves identically wherever it appears. Each
 *  caller supplies its own field list since the underlying data differs by
 *  domain (daily staff vs. core employee master). */
export default function EmployeeInfoModal({ title, subtitle, fields, onClose, loading }: EmployeeInfoModalProps) {
  return (
    <Modal title="Employee Info" onClose={onClose} widthClass="max-w-md">
      <div className="mb-4">
        <div className="text-lg font-semibold text-gray-800">{title}</div>
        {subtitle && <div className="text-xs text-gray-500 font-mono mt-0.5">{subtitle}</div>}
      </div>

      {loading ? (
        <FormSkeleton fields={4} />
      ) : (
        <dl className="flex flex-col">
          {fields.map((f) => (
            <div key={f.label} className="flex items-start justify-between gap-4 text-sm border-b border-gray-100 py-2.5 last:border-0">
              <dt className="text-gray-500 shrink-0">{f.label}</dt>
              <dd className="text-gray-800 font-medium text-right break-words">{f.value ?? "—"}</dd>
            </div>
          ))}
        </dl>
      )}
    </Modal>
  );
}
