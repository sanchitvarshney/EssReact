import type { ReactNode } from "react";
import { EmptyState } from "./AsyncState";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyMessage: string;
  onRowClick?: (row: T) => void;
}

export default function DataTable<T>({ columns, rows, rowKey, emptyMessage, onRowClick }: DataTableProps<T>) {
  if (rows.length === 0) return <EmptyState message={emptyMessage} />;

  return (
    <div className="overflow-x-auto rounded-md border border-gray-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left font-semibold text-gray-500 uppercase text-xs tracking-wide px-4 py-3 whitespace-nowrap"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`border-t border-gray-200 ${onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}`}
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3 text-gray-700 ${col.className || ""}`}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
