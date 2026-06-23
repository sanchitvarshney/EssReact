import {
  Typography,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Chip,
  InputAdornment,
  TextField,
} from "@mui/material";

import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
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

  return (
    <div className="w-full p-4 h-[calc(100vh-78px)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            style={{ backgroundColor: "#2eacb3" }}
            className="w-1 h-7 rounded-full"
          />
          <Typography sx={{ fontSize: 19, fontWeight: 700, color: "#232324" }}>
            Documents
          </Typography>
          {!isLoading && data?.data && (
            <Chip
              label={`${filteredData.length} files`}
              size="small"
              sx={{
                backgroundColor: "#e0f7f8",
                color: "#2eacb3",
                fontWeight: 600,
                fontSize: 11,
                height: 22,
                ml: 0.5,
              }}
            />
          )}
        </div>

        <TextField
          size="small"
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={isLoading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#2eacb3", fontSize: 17 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
              fontSize: 13,
              "& fieldset": { borderColor: "#e0e0e0" },
              "&:hover fieldset": { borderColor: "#2eacb3" },
              "&.Mui-focused fieldset": { borderColor: "#2eacb3" },
            },
            minWidth: 220,
          }}
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <DocumentsPageSkeleton />
      ) : filteredData.length === 0 ? (
        <EmptyData />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 h-[calc(100vh-150px)] overflow-y-auto py-2 pr-1 custom-scrollbar-for-menu">
          {filteredData.map((row: any) => {
            const cfg = getFileCfg(row?.file_type);
            return (
              <Card
                key={row?.key || row?.id}
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: "1px solid #eeeeee",
                  borderLeft: `4px solid ${cfg.color}`,
                  minHeight: 170,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "box-shadow 0.2s, transform 0.15s",
                  "&:hover": {
                    boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <CardContent sx={{ pb: 1, flex: 1 }}>
                  {/* Name + icon + type chip */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-start gap-2 min-w-0">
                      <div
                        className="p-2 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: cfg.bg }}
                      >
                        {row?.file_type === "pdf" ? (
                          <PictureAsPdfIcon
                            sx={{ fontSize: 20, color: cfg.color }}
                          />
                        ) : row?.file_type === "img" ? (
                          <ImageIcon sx={{ fontSize: 20, color: cfg.color }} />
                        ) : (
                          <InsertDriveFileIcon
                            sx={{ fontSize: 20, color: cfg.color }}
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <CustomToolTip title={row.name} placement="bottom">
                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: 14,
                              color: "#1f2937",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: 180,
                              lineHeight: 1.3,
                            }}
                          >
                            {row.name}
                          </Typography>
                        </CustomToolTip>
                        <CustomToolTip
                          title={row.description}
                          placement="bottom"
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#9ca3af",
                              fontSize: 12,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: 180,
                            }}
                          >
                            {row.description || "No description"}
                          </Typography>
                        </CustomToolTip>
                      </div>
                    </div>

                    <Chip
                      label={cfg.label}
                      size="small"
                      sx={{
                        backgroundColor: cfg.bg,
                        color: cfg.color,
                        fontWeight: 700,
                        fontSize: 10,
                        height: 20,
                        flexShrink: 0,
                        border: `1px solid ${cfg.color}30`,
                        "& .MuiChip-label": { px: 1 },
                      }}
                    />
                  </div>

                  {/* Date + Size meta row */}
                  <div
                    className="flex items-center gap-4 mt-3 pt-2"
                    style={{ borderTop: "1px solid #f3f4f6" }}
                  >
                    <div className="flex items-center gap-1">
                      <CalendarTodayIcon
                        sx={{ fontSize: 12, color: "#9ca3af" }}
                      />
                      <Typography sx={{ fontSize: 12, color: "#6b7280" }}>
                        {row.datetime}
                      </Typography>
                    </div>
                    <div className="flex items-center gap-1">
                      <DataUsageIcon sx={{ fontSize: 12, color: "#9ca3af" }} />
                      <Typography sx={{ fontSize: 12, color: "#6b7280" }}>
                        {row.file_size ?? "N/A"}
                      </Typography>
                    </div>
                  </div>
                </CardContent>

                <CardActions
                  sx={{
                    justifyContent: "flex-end",
                    pt: 1,
                    pb: 1.5,
                    px: 2,
                    borderTop: "1px solid #f3f4f6",
                    backgroundColor: "#fafafa",
                    borderBottomLeftRadius: 12,
                    borderBottomRightRadius: 12,
                  }}
                >
                  {row?.file_type !== "other" && (
                    <CustomToolTip title="View" placement="bottom">
                      <IconButton
                        size="small"
                        onClick={() => fnOpenNewWindow(row.path)}
                        sx={{
                          color: "#2eacb3",
                          "&:hover": { backgroundColor: "#e0f7f8" },
                        }}
                      >
                        <VisibilityIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </CustomToolTip>
                  )}
                  {row?.file_type === "other" && (
                    <CustomToolTip title="Download" placement="bottom">
                      <IconButton
                        size="small"
                        onClick={() => downloadFile(row.path, row.name)}
                        sx={{
                          color: "#2eacb3",
                          "&:hover": { backgroundColor: "#e0f7f8" },
                        }}
                      >
                        <CloudDownloadIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </CustomToolTip>
                  )}
                </CardActions>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
