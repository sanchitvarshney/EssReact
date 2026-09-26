import { useState } from "react";
import moment from "moment";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CustomToolTip from "../reuseable/CustomToolTip";

const FILE_CFG: Record<string, { color: string; bg: string; label: string; Icon: any }> = {
  pdf: { color: "#e5484d", bg: "#fdecec", label: "PDF", Icon: PictureAsPdfIcon },
  img: { color: "#2f7de1", bg: "#e8f1fd", label: "Image", Icon: ImageIcon },
  other: { color: "#64748b", bg: "#eef1f4", label: "File", Icon: InsertDriveFileIcon },
};

const cfgOf = (type?: string) => FILE_CFG[type ?? ""] ?? FILE_CFG.other;

const DATE_FORMATS = ["DD-MM-YYYY HH:mm:ss", "YYYY-MM-DD HH:mm:ss", "DD-MM-YYYY hh:mm A", "DD MMM YYYY", "DD-MM-YYYY", moment.ISO_8601];

export const docDate = (row: any) => {
  const m = moment(row?.datetime, DATE_FORMATS);
  return m.isValid() ? m : null;
};

export const isNewDoc = (row: any) => {
  const d = docDate(row);
  return !!d && moment().diff(d, "days") <= 30 && !d.isAfter(moment());
};

const isViewable = (row: any) => row?.file_type === "pdf" || row?.file_type === "img";

type Actions = {
  onView: (path: string) => void;
  onDownload: (path: string, name: string) => void;
};

/* File icon tile (shows a real thumbnail for images). */
const FileTile = ({ row, size = 44 }: { row: any; size?: number }) => {
  const cfg = cfgOf(row?.file_type);
  const [failed, setFailed] = useState(false);
  const thumb = row?.file_type === "img" && row?.path && !failed;

  return (
    <span
      className="rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
      style={{ width: size, height: size, backgroundColor: cfg.bg, color: cfg.color }}
    >
      {thumb ? (
        <img
          src={row.path}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <cfg.Icon sx={{ fontSize: size * 0.5 }} />
      )}
    </span>
  );
};

/* ── "Recently added" compact card ── */
export const RecentCard = ({ row, onView, onDownload }: { row: any } & Actions) => {
  const cfg = cfgOf(row?.file_type);
  const viewable = isViewable(row);
  const open = () => (viewable ? onView(row.path) : onDownload(row.path, row.name));

  return (
    <button
      onClick={open}
      className="group text-left flex items-center gap-3 w-full bg-white rounded-2xl border border-gray-100 px-3.5 py-3 hover:border-[#00a0a0] hover:shadow-md transition-all cursor-pointer"
    >
      <FileTile row={row} size={44} />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-gray-800 truncate">{row.name}</span>
        <span className="block text-[11px] text-gray-400 truncate">
          {cfg.label} · {docDate(row)?.fromNow() ?? row.datetime}
        </span>
      </span>
      <span className="w-8 h-8 rounded-full bg-[#e0f6f6] text-[#007f86] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        {viewable ? <VisibilityOutlinedIcon sx={{ fontSize: 17 }} /> : <FileDownloadOutlinedIcon sx={{ fontSize: 17 }} />}
      </span>
    </button>
  );
};

/* ── Table row ── */
export const DocRow = ({ row, onView, onDownload }: { row: any } & Actions) => {
  const cfg = cfgOf(row?.file_type);
  const viewable = isViewable(row);
  const fresh = isNewDoc(row);

  return (
    <div className="group grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,2.4fr)_90px_150px_90px_96px] items-center gap-x-4 px-5 py-3 border-b border-gray-50 last:border-0 hover:bg-[#f6fbfb] transition-colors">
      {/* Name */}
      <div className="flex items-center gap-3 min-w-0">
        <FileTile row={row} />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <CustomToolTip title={row.name} placement="top">
              <p className="text-sm font-semibold text-gray-800 truncate">{row.name}</p>
            </CustomToolTip>
            {fresh && (
              <span className="flex-shrink-0 text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-[#e9cd00] text-[#3d3400]">
                New
              </span>
            )}
          </div>
          <CustomToolTip title={row.description || ""} placement="bottom">
            <p className="text-xs text-gray-400 truncate">{row.description || "No description"}</p>
          </CustomToolTip>
          <p className="md:hidden text-[11px] text-gray-400 mt-0.5">
            {cfg.label} · {row.file_size ?? "N/A"} · {row.datetime}
          </p>
        </div>
      </div>

      {/* Type */}
      <span
        className="hidden md:inline-flex w-fit text-[11px] font-semibold px-2.5 py-1 rounded-full"
        style={{ backgroundColor: cfg.bg, color: cfg.color }}
      >
        {cfg.label}
      </span>

      {/* Added */}
      <span className="hidden md:block text-xs text-gray-500 leading-tight">
        {docDate(row)?.format("DD MMM YYYY") ?? row.datetime}
        <span className="block text-[10px] text-gray-400">{docDate(row)?.fromNow()}</span>
      </span>

      {/* Size */}
      <span className="hidden md:block text-xs text-gray-500">{row.file_size ?? "N/A"}</span>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1.5">
        {viewable && (
          <CustomToolTip title="Preview" placement="top">
            <button
              onClick={() => onView(row.path)}
              aria-label="Preview"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#007f86] hover:bg-[#e0f6f6] transition-colors cursor-pointer"
            >
              <VisibilityOutlinedIcon sx={{ fontSize: 19 }} />
            </button>
          </CustomToolTip>
        )}
        <CustomToolTip title="Download" placement="top">
          <button
            onClick={() => onDownload(row.path, row.name)}
            aria-label="Download"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#007f86] hover:bg-[#e0f6f6] transition-colors cursor-pointer"
          >
            <FileDownloadOutlinedIcon sx={{ fontSize: 19 }} />
          </button>
        </CustomToolTip>
      </div>
    </div>
  );
};
