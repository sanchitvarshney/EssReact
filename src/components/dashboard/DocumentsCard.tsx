import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useGetDocumentsMutation } from "../../services/doc";
import DashCard from "./DashCard";
import { DASH_PRIMARY } from "./DashboardRail";

const FILE_CFG: Record<string, { color: string; bg: string; label: string; Icon: any }> = {
  pdf: { color: "#ef4444", bg: "#fef2f2", label: "PDF", Icon: PictureAsPdfIcon },
  img: { color: "#3b82f6", bg: "#eff6ff", label: "Image", Icon: ImageIcon },
  other: { color: "#6b7280", bg: "#f3f4f6", label: "File", Icon: InsertDriveFileIcon },
};

const openWindow = (link: string) => {
  const w = 1000;
  const h = 600;
  const left = window.screen.width / 2 - w / 2;
  const top = window.screen.height / 2 - h / 2;
  window.open(
    link,
    "MsCorpres",
    `width=${w},height=${h},top=${top},left=${left},status=1,scrollbars=1,location=0,resizable=yes`,
  );
};

const DocumentsCard = () => {
  const navigate = useNavigate();
  const [getDocuments, { data, isLoading }] = useGetDocumentsMutation();

  useEffect(() => {
    getDocuments();
  }, []);

  const docs: any[] = data?.data ?? [];

  return (
    <DashCard
      title="HR Documents"
      className="h-full"
      action={
        <button
          aria-label="View all documents"
          onClick={() => navigate("/hr-documents")}
          className="cursor-pointer"
          style={{ color: DASH_PRIMARY }}
        >
          <ArrowForwardIcon sx={{ fontSize: 18 }} />
        </button>
      }
    >
      <div className="max-h-[230px] overflow-y-auto custom-scrollbar-for-menu space-y-1 px-2 -mx-2">
        {isLoading ? (
          <p className="text-xs text-gray-400 py-8 text-center">Loading documents…</p>
        ) : docs.length === 0 ? (
          <p className="text-xs text-gray-400 py-8 text-center">No documents available.</p>
        ) : (
          docs.map((d, i) => {
            const cfg = FILE_CFG[d.file_type] ?? FILE_CFG.other;
            return (
              <button
                key={d.path || i}
                onClick={() => (d.file_type === "other" ? window.open(d.path, "_blank") : openWindow(d.path))}
                className="w-full flex items-center gap-3 px-2 -mx-2 py-2 rounded-xl row-hover text-left cursor-pointer"
              >
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: cfg.bg, color: cfg.color }}
                >
                  <cfg.Icon sx={{ fontSize: 17 }} />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs text-gray-800 truncate">{d.name}</span>
                  <span className="block text-[10px] text-gray-400">{cfg.label}</span>
                </span>
              </button>
            );
          })
        )}
      </div>
    </DashCard>
  );
};

export default DocumentsCard;
