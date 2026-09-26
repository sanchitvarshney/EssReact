import { useEffect, useMemo, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import CloseIcon from "@mui/icons-material/Close";
import AllInboxOutlinedIcon from "@mui/icons-material/AllInboxOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import NewReleasesOutlinedIcon from "@mui/icons-material/NewReleasesOutlined";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useGetDocumentsMutation } from "../services/doc";
import DocumentsPageSkeleton from "../skeleton/DocumentsPageSkeleton";
import { useToast } from "../hooks/useToast";
import EmptyData from "../components/reuseable/EmptyData";
import { DocRow, RecentCard, docDate, isNewDoc } from "../components/documents/DocumentCards";

const isOther = (d: any) => d.file_type !== "pdf" && d.file_type !== "img";

type SortKey = "date" | "name" | "size";

// "1.2 MB" / "340 KB" -> bytes, so sizes sort numerically.
const sizeBytes = (v: any) => {
  const m = String(v ?? "").match(/([\d.]+)\s*(B|KB|MB|GB)/i);
  if (!m) return 0;
  const mult: Record<string, number> = { B: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3 };
  return parseFloat(m[1]) * (mult[m[2].toUpperCase()] ?? 1);
};

const DocumentsPage = () => {
  const { showToast } = useToast();
  const [getDocuments, { isLoading, data, error }] = useGetDocumentsMutation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [desc, setDesc] = useState(true);

  const all: any[] = data?.data ?? [];

  const categories = useMemo(
    () => [
      { id: "all", label: "All documents", icon: AllInboxOutlinedIcon, count: all.length },
      { id: "new", label: "Recently added", icon: NewReleasesOutlinedIcon, count: all.filter(isNewDoc).length },
      { id: "pdf", label: "PDF files", icon: PictureAsPdfOutlinedIcon, count: all.filter((d) => d.file_type === "pdf").length },
      { id: "img", label: "Images", icon: ImageOutlinedIcon, count: all.filter((d) => d.file_type === "img").length },
      { id: "other", label: "Other files", icon: InsertDriveFileOutlinedIcon, count: all.filter(isOther).length },
    ],
    [all],
  );

  const recent = useMemo(
    () =>
      all
        .filter(isNewDoc)
        .sort((a, b) => (docDate(b)?.valueOf() ?? 0) - (docDate(a)?.valueOf() ?? 0))
        .slice(0, 3),
    [all],
  );

  // Derived synchronously - no effect gap that would flash the empty state.
  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const matches = all.filter((d) => {
      if (category === "new" ? !isNewDoc(d) : category === "other" ? !isOther(d) : category !== "all" && d.file_type !== category) {
        return false;
      }
      if (!q) return true;
      return (
        d.name?.toLowerCase().includes(q) ||
        d.file_type?.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q)
      );
    });
    const dir = desc ? -1 : 1;
    return [...matches].sort((a, b) => {
      if (sortKey === "name") return dir * String(a.name).localeCompare(String(b.name));
      if (sortKey === "size") return dir * (sizeBytes(a.file_size) - sizeBytes(b.file_size));
      return dir * ((docDate(a)?.valueOf() ?? 0) - (docDate(b)?.valueOf() ?? 0));
    });
  }, [all, search, category, sortKey, desc]);

  const fnOpenNewWindow = (link: string) => {
    const w = 1000,
      h = 600;
    const left = window.screen.width / 2 - w / 2;
    const top = window.screen.height / 2 - h / 2;
    window.open(
      link,
      "MsCorpres",
      `width=${w},height=${h},top=${top},left=${left},status=1,scrollbars=1,location=0,resizable=yes`,
    );
  };

  const downloadFile = (url: string, name: string = "document") => {
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.target = "_blank";
    a.click();
  };

  useEffect(() => {
    getDocuments().unwrap();
  }, []);

  useEffect(() => {
    if (!error) return;
    //@ts-ignore
    const errData = error.data as { message?: string };
    showToast(errData?.message || "An unexpected error has occurred.", "error");
  }, [error]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setDesc((d) => !d);
    else {
      setSortKey(key);
      setDesc(key === "date");
    }
  };

  const SortHead = ({ label, k, className = "" }: { label: string; k: SortKey; className?: string }) => (
    <button
      onClick={() => toggleSort(k)}
      className={`flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider cursor-pointer hover:text-[#007f86] ${
        sortKey === k ? "text-[#007f86]" : "text-gray-400"
      } ${className}`}
    >
      {label}
      {sortKey === k && (desc ? <ArrowDownwardIcon sx={{ fontSize: 12 }} /> : <ArrowUpwardIcon sx={{ fontSize: 12 }} />)}
    </button>
  );

  const activeCat = categories.find((c) => c.id === category);

  return (
    <div className="h-full overflow-y-auto custom-scrollbar-for-menu px-3 py-4 flex flex-col gap-4 [&>*]:flex-shrink-0">
      {/* Header + search */}
      <section
        className="relative overflow-hidden rounded-3xl text-white px-5 sm:px-6 py-5"
        style={{ background: "linear-gradient(120deg, #0f2f3a 0%, #0b5563 50%, #00a0a0 100%)" }}
      >
        <div className="pointer-events-none absolute -right-14 -top-20 w-56 h-56 rounded-full border-[24px] border-white/5" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0">
              <FolderOpenOutlinedIcon sx={{ fontSize: 26 }} />
            </span>
            <div>
              <p className="text-xl font-bold leading-tight">HR Documents</p>
              <p className="text-sm text-white/70">
                {isLoading ? "Loading…" : `${all.length} file${all.length === 1 ? "" : "s"} shared by HR`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white rounded-full pl-4 pr-2 py-2 w-full lg:w-[380px] shadow-lg">
            <SearchIcon sx={{ color: "#00a0a0", fontSize: 20 }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={isLoading}
              placeholder="Search documents…"
              className="flex-1 min-w-0 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 cursor-pointer"
              >
                <CloseIcon sx={{ fontSize: 16 }} />
              </button>
            )}
          </div>
        </div>
      </section>

      {isLoading ? (
        <DocumentsPageSkeleton />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[230px_minmax(0,1fr)] gap-4 items-start">
          {/* Categories */}
          <aside className="bg-white rounded-3xl border border-gray-100 shadow-[0_1px_4px_rgba(16,24,40,0.05)] p-3 lg:sticky lg:top-0">
            <p className="px-3 pt-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">Browse</p>
            <div className="flex lg:flex-col gap-1 overflow-x-auto">
              {categories.map(({ id, label, icon: Icon, count }) => {
                const on = category === id;
                return (
                  <button
                    key={id}
                    onClick={() => setCategory(id)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                      on
                        ? "text-white shadow-md bg-gradient-to-r from-[#00a0a0] to-[#007f86]"
                        : "text-gray-600 hover:bg-[#f0fbfb] hover:text-[#007f86]"
                    }`}
                  >
                    <Icon sx={{ fontSize: 19 }} />
                    <span className="text-[13px] font-medium flex-1">{label}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        on ? "bg-white/25" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Content */}
          <div className="flex flex-col gap-4 min-w-0">
            {recent.length > 0 && category === "all" && !search && (
              <section>
                <p className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                  Recently added
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {recent.map((row) => (
                    <RecentCard key={`r-${row?.key || row?.id || row.path}`} row={row} onView={fnOpenNewWindow} onDownload={downloadFile} />
                  ))}
                </div>
              </section>
            )}

            <section className="bg-white rounded-3xl border border-gray-100 shadow-[0_1px_4px_rgba(16,24,40,0.05)] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
                <p className="text-sm font-bold text-gray-800">
                  {activeCat?.label}
                  <span className="ml-2 text-xs font-medium text-gray-400">{rows.length} shown</span>
                </p>
              </div>

              {rows.length > 0 && (
                <div className="hidden md:grid grid-cols-[minmax(0,2.4fr)_90px_150px_90px_96px] gap-x-4 px-5 py-2.5 bg-[#f7fafa] border-b border-gray-100">
                  <SortHead label="Name" k="name" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Type</span>
                  <SortHead label="Added" k="date" />
                  <SortHead label="Size" k="size" />
                  <span />
                </div>
              )}

              {rows.length === 0 ? (
                <EmptyData
                  height="h-[38vh]"
                  title={search || category !== "all" ? "No matching documents" : "No documents yet"}
                  subtitle={
                    search || category !== "all"
                      ? "Try a different search or category."
                      : "Documents shared by HR will appear here."
                  }
                />
              ) : (
                rows.map((row) => (
                  <DocRow key={row?.key || row?.id || row.path} row={row} onView={fnOpenNewWindow} onDownload={downloadFile} />
                ))
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
