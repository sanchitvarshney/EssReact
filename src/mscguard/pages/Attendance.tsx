import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import SearchInput from "../components/SearchInput";
import DataTable, { type DataTableColumn } from "../components/DataTable";
import { Select } from "../components/FormControls";
import { DatePickerField } from "../components/DatePickerField";
import EmployeeInfoModal from "../components/EmployeeInfoModal";
import { ErrorState } from "../components/AsyncState";
import { TableSkeleton } from "../components/Skeleton";
import Pagination, { usePagination } from "../components/Pagination";
import { fetchAttendance, fetchDepartments } from "../services/mscguardDailyStaff";
import type { AttendanceRecord } from "../types/mscguardTypes";
import { Dates } from "../utils/mscguardDates";

export default function Attendance() {
  const [departments, setDepartments] = useState<string[]>([]);
  const [department, setDepartment] = useState("");
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [infoRecord, setInfoRecord] = useState<AttendanceRecord | null>(null);

  useEffect(() => {
    fetchDepartments()
      .then(setDepartments)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handle = setTimeout(load, search ? 400 : 0);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [department, date, search]);

  async function load() {
    setLoadState("loading");
    try {
      setRecords(await fetchAttendance({ department, date, search }));
      setLoadState("loaded");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoadState("error");
    }
  }

  function formatDuration(sec: number | null): string {
    if (!sec) return "—";
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  const columns: DataTableColumn<AttendanceRecord>[] = [
    {
      key: "name",
      header: "Staff",
      render: (r) => (
        <button
          type="button"
          onClick={() => setInfoRecord(r)}
          className="text-gray-800 font-medium hover:text-blue-700 hover:underline text-left"
        >
          {r.name || r.staff_ref}
        </button>
      ),
    },
    { key: "department", header: "Department", render: (r) => r.department || "—" },
    { key: "mobile", header: "Mobile", render: (r) => r.mobile || "—" },
    { key: "in", header: "In", render: (r) => Dates.dateTime(r.in_time) },
    { key: "out", header: "Out", render: (r) => Dates.dateTime(r.out_time) },
    { key: "duration", header: "Duration", render: (r) => formatDuration(r.duration_sec) },
  ];

  const { pageRows, page, setPage, totalPages, total, pageSize } = usePagination(records);

  return (
    <div>
      <PageHeader eyebrow="Daily Staff" title="Attendance" />

      <div className="flex flex-nowrap gap-3 mb-5 overflow-x-auto pb-1">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name or mobile" className="w-64 shrink-0" />
        <Select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-48 shrink-0">
          <option value="">All departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </Select>
        <DatePickerField value={date} onChange={setDate} placeholder="Any date" className="w-44 shrink-0" maxDate={new Date()} />
      </div>

      {loadState === "loading" && <TableSkeleton columns={6} />}
      {loadState === "error" && <ErrorState message={errorMessage} onRetry={load} />}
      {loadState === "loaded" && (
        <>
          <DataTable columns={columns} rows={pageRows} rowKey={(r) => r.ref} emptyMessage="No attendance records found." />
          <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onPageChange={setPage} />
        </>
      )}

      {infoRecord && (
        <EmployeeInfoModal
          title={infoRecord.name || infoRecord.staff_ref}
          subtitle={infoRecord.staff_ref}
          onClose={() => setInfoRecord(null)}
          fields={[
            { label: "Department", value: infoRecord.department || "—" },
            { label: "Mobile", value: infoRecord.mobile || "—" },
            { label: "Entry Date", value: Dates.dateOnly(infoRecord.entry_date) },
            { label: "In", value: Dates.dateTime(infoRecord.in_time) },
            { label: "Out", value: Dates.dateTime(infoRecord.out_time) },
            { label: "Duration", value: formatDuration(infoRecord.duration_sec) },
          ]}
        />
      )}
    </div>
  );
}
