
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DataUsageIcon from "@mui/icons-material/DataUsage";

import CustomToolTip from "../components/reuseable/CustomToolTip";
import { useGetDocumentsMutation } from "../services/doc";
import { useEffect, useMemo, useState } from "react";
import DocumentsPageSkeleton from "../skeleton/DocumentsPageSkeleton";
import { useToast } from "../hooks/useToast";
import EmptyData from "../components/reuseable/EmptyData";

const fileTypeConfig: Record<
  string,
  { color: string; bg: string; label: string }
> = {
  pdf: { color: "#ef4444", bg: "#fef2f2", label: "PDF" },
  img: { color: "#3b82f6", bg: "#eff6ff", label: "Image" },
  other: { color: "#6b7280", bg: "#f9fafb", label: "File" },
};

const getFileCfg = (type: string) =>
  fileTypeConfig[type] ?? fileTypeConfig.other;

const DocumentsPage = () => {
  const { showToast } = useToast();
  const [getDocuments, { isLoading, data, error }] = useGetDocumentsMutation();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Derived synchronously — no useEffect gap that causes EmptyData to flash
  const filteredData = useMemo(() => {
    const all: any[] = data?.data ?? [];
    if (!search.trim()) return all;
    const q = search.toLowerCase();
    return all.filter(
      (item: any) =>
        item.file_type?.toLowerCase().includes(q) ||
        item.name?.toLowerCase().includes(q),
    );
  }, [data?.data, search]);

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

  const counts = useMemo(() => {
    const all: any[] = data?.data ?? [];
    return {
      all: all.length,
      pdf: all.filter((d) => d.file_type === "pdf").length,
      img: all.filter((d) => d.file_type === "img").length,
      other: all.filter((d) => d.file_type !== "pdf" && d.file_type !== "img").length,
    };
  }, [data?.data]);

  const visibleData = useMemo(() => {
    if (typeFilter === "all") return filteredData;
    if (typeFilter === "other") return filteredData.filter((d: any) => d.file_type !== "pdf" && d.file_type !== "img");
    return filteredData.filter((d: any) => d.file_type === typeFilter);
  }, [filteredData, typeFilter]);

  const chips: { id: string; label: string }[] = [
    { id: "all", label: "All files" },
    { id: "pdf", label: "PDF" },
    { id: "img", label: "Images" },
    { id: "other", label: "Other" },
  ];

  return (
    <div className="h-full overflow-y-auto custom-scrollbar-for-menu px-3 py-4 flex flex-col gap-4 [&>*]:flex-shrink-0">
      {/* Hero / toolbar */}
      <section
        className="relative overflow-hidden rounded-3xl text-white p-5 sm:p-6"
        style={{ background: "linear-gradient(120deg, #0f2f3a 0%, #0b5563 50%, #00a0a0 100%)" }}
      >
        <div className="pointer-events-none absolute -right-14 -top-20 w-60 h-60 rounded-full border-[26px] border-white/5" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <span className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0">
              <FolderOpenOutlinedIcon sx={{ fontSize: 28 }} />
            </span>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-white/60">Company library</p>
              <p className="text-xl sm:text-2xl font-bold leading-tight">HR Documents</p>
              <p className="text-sm text-white/70">
                {isLoading ? "Loading…" : `${counts.all} file${counts.all === 1 ? "" : "s"} available for you`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2.5 w-full lg:w-[340px] shadow-lg">
            <SearchIcon sx={{ color: "#00a0a0", fontSize: 20 }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={isLoading}
              placeholder="Search by name or type…"
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
            />
          </div>
        </div>
      </section>

      {/* Type chips */}
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar-for-menu pb-0.5">
        {chips.map(({ id, label }) => {
          const on = typeFilter === id;
          return (
            <button
              key={id}
              onClick={() => setTypeFilter(id)}
              className={`flex items-center gap-2 flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                on
                  ? "text-white shadow-md bg-gradient-to-r from-[#00a0a0] to-[#007f86]"
                  : "bg-white border border-gray-100 text-gray-600 hover:border-[#00a0a0] hover:text-[#007f86]"
              }`}
            >
              {label}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${on ? "bg-white/25" : "bg-gray-100 text-gray-500"}`}
              >
                {(counts as any)[id]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {isLoading ? (
        <DocumentsPageSkeleton />
      ) : visibleData.length === 0 ? (
        <EmptyData height="h-[40vh]" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 pb-2">
          {visibleData.map((row: any) => {
            const cfg = getFileCfg(row?.file_type);
            const Icon =
              row?.file_type === "pdf"
                ? PictureAsPdfIcon
                : row?.file_type === "img"
                  ? ImageIcon
                  : InsertDriveFileIcon;
            const isOther = row?.file_type === "other" || (row?.file_type !== "pdf" && row?.file_type !== "img");

            return (
              <article
                key={row?.key || row?.id || row.path}
                className="group bg-white rounded-3xl border border-gray-100 shadow-[0_1px_4px_rgba(16,24,40,0.05)] overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Preview tile */}
                <div
                  className="relative h-28 flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${cfg.bg} 0%, #ffffff 130%)` }}
                >
                  <div
                    className="absolute -right-6 -top-8 w-28 h-28 rounded-full opacity-40"
                    style={{ backgroundColor: cfg.color + "22" }}
                  />
                  <span
                    className="relative w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center"
                    style={{ color: cfg.color }}
                  >
                    <Icon sx={{ fontSize: 32 }} />
                  </span>
                  <span
                    className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: "#fff", color: cfg.color, border: `1px solid ${cfg.color}30` }}
                  >
                    {cfg.label}
                  </span>
                </div>

                <div className="p-4 flex flex-col gap-3 flex-1">
                  <div className="min-w-0">
                    <CustomToolTip title={row.name} placement="top">
                      <p className="text-sm font-bold text-gray-800 truncate">{row.name}</p>
                    </CustomToolTip>
                    <CustomToolTip title={row.description || ""} placement="bottom">
                      <p className="text-xs text-gray-400 truncate mt-0.5">{row.description || "No description"}</p>
                    </CustomToolTip>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-gray-500 mt-auto">
                    <span className="flex items-center gap-1">
                      <CalendarTodayIcon sx={{ fontSize: 12, color: "#9ca3af" }} />
                      {row.datetime}
                    </span>
                    <span className="flex items-center gap-1">
                      <DataUsageIcon sx={{ fontSize: 12, color: "#9ca3af" }} />
                      {row.file_size ?? "N/A"}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-gray-50">
                    {!isOther && (
                      <button
                        onClick={() => fnOpenNewWindow(row.path)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#00a0a0] to-[#007f86] hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <VisibilityIcon sx={{ fontSize: 16 }} /> View
                      </button>
                    )}
                    <button
                      onClick={() => downloadFile(row.path, row.name)}
                      className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        isOther
                          ? "flex-1 text-white bg-gradient-to-r from-[#00a0a0] to-[#007f86] hover:shadow-md"
                          : "px-3.5 text-[#007f86] bg-[#e0f6f6] hover:brightness-95"
                      }`}
                    >
                      <CloudDownloadIcon sx={{ fontSize: 16 }} />
                      {isOther && "Download"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
