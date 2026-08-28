import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import SearchInput from "../components/SearchInput";
import DataTable, { type DataTableColumn } from "../components/DataTable";
import StatusPill from "../components/StatusPill";
import { Select } from "../components/FormControls";
import { DatePickerField } from "../components/DatePickerField";
import { ErrorState } from "../components/AsyncState";
import { TableSkeleton } from "../components/Skeleton";
import Pagination, { usePagination } from "../components/Pagination";
import { fetchReportRows } from "../services/mscguardReports";
import type { ReportRow } from "../types/mscguardTypes";
import { humanizeReportType } from "../utils/mscguardLabels";
import { Dates } from "../utils/mscguardDates";

const TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "employee_gatepass", label: "Employee Gate Pass" },
  { value: "material_gatepass", label: "Material Gate Pass" },
  { value: "material_in", label: "Material In" },
  { value: "material_out", label: "Material Out" },
  { value: "return_inward", label: "Return Inward" },
  { value: "returnable_out", label: "Returnable Out" },
];

export default function AdvancedSearch() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "loaded" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!query.trim() && !type && !fromDate && !toDate) {
      setLoadState("idle");
      return;
    }
    const handle = setTimeout(runSearch, 400);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, type, fromDate, toDate]);

  async function runSearch() {
    setLoadState("loading");
    try {
      const from = fromDate ? new Date(`${fromDate}T00:00:00`).getTime() : undefined;
      const to = toDate ? new Date(`${toDate}T23:59:59`).getTime() : undefined;
      const data = await fetchReportRows({ q: query.trim() || undefined, type: type || undefined, from, to });
      setRows(data.rows);
      setTotalRows(data.totalRows);
      setLoadState("loaded");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoadState("error");
    }
  }

  const columns: DataTableColumn<ReportRow>[] = [
    { key: "type", header: "Type", render: (r) => humanizeReportType(r.type) },
    { key: "ref", header: "Ref", render: (r) => <span className="text-blue-700 font-mono text-xs">{r.ref}</span> },
    { key: "person", header: "Person", render: (r) => r.personName || "—" },
    { key: "department", header: "Department", render: (r) => r.department || "—" },
    { key: "status", header: "Status", render: (r) => <StatusPill status={r.status} /> },
    { key: "date", header: "Date", render: (r) => Dates.dateTime(r.createdAt) },
  ];

  const { pageRows, page, setPage, totalPages, total, pageSize } = usePagination(rows);

  return (
    <div>
      <PageHeader eyebrow="Search" title="Advanced Search" />

      <div className="flex flex-nowrap gap-3 mb-2 overflow-x-auto pb-1">
        <SearchInput value={query} onChange={setQuery} placeholder="Search by ref, name, or department" className="w-72 shrink-0" />
        <Select value={type} onChange={(e) => setType(e.target.value)} className="w-52 shrink-0">
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
        <DatePickerField value={fromDate} onChange={setFromDate} placeholder="From date" className="w-40 shrink-0" maxDate={new Date()} />
        <DatePickerField value={toDate} onChange={setToDate} placeholder="To date" className="w-40 shrink-0" maxDate={new Date()} />
      </div>

      {loadState === "loaded" && (
        <div className="text-xs text-gray-500 mb-3">
          {totalRows} result{totalRows === 1 ? "" : "s"}
          {totalRows > rows.length ? ` (showing first ${rows.length})` : ""}
        </div>
      )}

      {loadState === "idle" && (
        <div className="text-gray-500 text-sm py-16 text-center">
          Enter a search term, or pick a type/date range, to search across every request type.
        </div>
      )}
      {loadState === "loading" && <TableSkeleton columns={6} />}
      {loadState === "error" && <ErrorState message={errorMessage} onRetry={runSearch} />}
      {loadState === "loaded" && (
        <>
          <DataTable columns={columns} rows={pageRows} rowKey={(r) => `${r.type}-${r.ref}`} emptyMessage="No results found." />
          <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
