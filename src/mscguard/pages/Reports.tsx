import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import PageHeader from "../components/PageHeader";
import DataTable, { type DataTableColumn } from "../components/DataTable";
import StatusPill from "../components/StatusPill";
import { Select, SecondaryButton } from "../components/FormControls";
import { DatePickerField } from "../components/DatePickerField";
import { ErrorState } from "../components/AsyncState";
import { TableSkeleton } from "../components/Skeleton";
import Pagination, { usePagination } from "../components/Pagination";
import { useToast } from "../components/ToastProvider";
import { downloadReportCsv, downloadReportPdf, fetchReportRows } from "../services/mscguardReports";
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

export default function Reports() {
  const toast = useToast();
  const [type, setType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [downloading, setDownloading] = useState<"csv" | "pdf" | null>(null);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, fromDate, toDate]);

  function currentFilters() {
    const from = fromDate ? new Date(`${fromDate}T00:00:00`).getTime() : undefined;
    const to = toDate ? new Date(`${toDate}T23:59:59`).getTime() : undefined;
    return { type: type || undefined, from, to };
  }

  async function load() {
    setLoadState("loading");
    try {
      const data = await fetchReportRows(currentFilters());
      setRows(data.rows);
      setTotalRows(data.totalRows);
      setLoadState("loaded");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoadState("error");
    }
  }

  async function handleDownload(format: "csv" | "pdf") {
    setDownloading(format);
    try {
      if (format === "csv") await downloadReportCsv(currentFilters());
      else await downloadReportPdf(currentFilters());
      toast.success(`${format.toUpperCase()} download started.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Download failed. Please try again.");
    } finally {
      setDownloading(null);
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
      <PageHeader
        eyebrow="Reports"
        title="Reports"
        actions={
          <>
            <SecondaryButton onClick={() => handleDownload("csv")} disabled={downloading !== null}>
              <span className="flex items-center gap-2">
                <Download size={14} /> {downloading === "csv" ? "Preparing…" : "CSV"}
              </span>
            </SecondaryButton>
            <SecondaryButton onClick={() => handleDownload("pdf")} disabled={downloading !== null}>
              <span className="flex items-center gap-2">
                <Download size={14} /> {downloading === "pdf" ? "Preparing…" : "PDF"}
              </span>
            </SecondaryButton>
          </>
        }
      />

      <div className="flex flex-nowrap gap-3 mb-4 overflow-x-auto pb-1">
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
          {totalRows} row{totalRows === 1 ? "" : "s"}
          {totalRows > rows.length ? ` (showing first ${rows.length}; download for the full set)` : ""}
        </div>
      )}

      {loadState === "loading" && <TableSkeleton columns={6} />}
      {loadState === "error" && <ErrorState message={errorMessage} onRetry={load} />}
      {loadState === "loaded" && (
        <>
          <DataTable columns={columns} rows={pageRows} rowKey={(r) => `${r.type}-${r.ref}`} emptyMessage="No rows in this range." />
          <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
