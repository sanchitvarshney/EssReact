import { memo } from "react";
import { Chip, Tooltip } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LockIcon from "@mui/icons-material/Lock";
import EditIcon from "@mui/icons-material/Edit";
import { Textarea } from "../../ui/textarea";
import dummyImg from "../../../assets/gallery.png";
import { ACCENT, DISPUTE_RED, type AssetItem } from "./types";

export interface AssetRowState {
  confirmed: boolean | undefined;
  locked: boolean;
  remarksValue: string;
  showSelectionError: boolean;
  showRemarksError: boolean;
}

interface AssetTableRowProps {
  asset: AssetItem;
  state: AssetRowState;
  onSetConfirmed: (id: string, confirmed: boolean) => void;
  onRemarksChange: (id: string, value: string) => void;
  onRemarksBlur: (id: string) => void;
  onUnlock: (id: string) => void;
  onView: (asset: AssetItem) => void;
}


const AssetTableRow = memo(function AssetTableRow({
  asset,
  state,
  onSetConfirmed,
  onRemarksChange,
  onRemarksBlur,
  onUnlock,
  onView,
}: AssetTableRowProps) {
  const { confirmed, locked, remarksValue, showSelectionError, showRemarksError } =
    state;
  const showRemarks = confirmed === false;

  return (
    <tr className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/60 transition-colors align-top">
      <td className="px-4 py-3">
        <button
          onClick={() => onView(asset)}
          className="block w-10 h-10 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0"
          aria-label={`View ${asset.name} image`}
        >
          <img
            src={asset.image}
            alt={asset.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = dummyImg;
            }}
          />
        </button>
      </td>
      <td className="px-4 py-3 text-sm font-semibold text-gray-800 whitespace-nowrap">
        {asset.name}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
        {asset.category || "—"}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
        {asset.model || "—"}
      </td>
      <td className="px-4 py-3 text-xs text-gray-500 font-mono whitespace-nowrap">
        <div className="flex items-center gap-1">
          <span>{asset.code || "—"}</span>
          {asset.category?.trim().toLowerCase() === "laptop" && (
            <Tooltip
              title="You can find the serial number on the label attached to the base of the laptop, or under Settings > System > About (Windows) / About This Mac (macOS)."
              arrow
            >
              <InfoOutlinedIcon
                sx={{ fontSize: 14, color: "#94a3b8", cursor: "help" }}
              />
            </Tooltip>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
        {asset.allotedOn || "—"}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <Tooltip title="View asset details">
          <button
            onClick={() => onView(asset)}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-[#2eacb3] hover:text-[#2eacb3] transition-colors"
          >
            <VisibilityOutlinedIcon sx={{ fontSize: 15 }} />
            View
          </button>
        </Tooltip>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <Chip
            label="Confirm"
            size="small"
            clickable={!locked}
            disabled={locked}
            onClick={() => onSetConfirmed(asset.id, true)}
            sx={{
              fontWeight: 600,
              bgcolor: confirmed === true ? ACCENT : "#f1f5f9",
              color: confirmed === true ? "#fff" : "#64748b",
              "&:hover": {
                bgcolor: confirmed === true ? ACCENT : "#e2e8f0",
              },
              "&.Mui-disabled": {
                opacity: confirmed === true ? 1 : 0.6,
              },
            }}
          />
          <Chip
            label="Dispute"
            size="small"
            clickable={!locked}
            disabled={locked}
            onClick={() => onSetConfirmed(asset.id, false)}
            sx={{
              fontWeight: 600,
              bgcolor: confirmed === false ? DISPUTE_RED : "#f1f5f9",
              color: confirmed === false ? "#fff" : "#64748b",
              "&:hover": {
                bgcolor: confirmed === false ? DISPUTE_RED : "#e2e8f0",
              },
              "&.Mui-disabled": {
                opacity: confirmed === false ? 1 : 0.6,
              },
            }}
          />
          {locked && (
            <button
              onClick={() => onUnlock(asset.id)}
              className="flex items-center gap-0.5 text-[11px] font-semibold text-gray-400 hover:text-[#2eacb3]"
              aria-label={`Edit verification for ${asset.name}`}
            >
              <LockIcon sx={{ fontSize: 13 }} />
              <EditIcon sx={{ fontSize: 12 }} />
            </button>
          )}
        </div>
        {showSelectionError && (
          <p className="text-[11px] text-red-500 mt-1">
            Choose Confirm or Dispute.
          </p>
        )}
      </td>
      <td className="px-4 py-3 min-w-[200px]">
        <Textarea
          className={`w-full border text-sm rounded-lg bg-white focus:ring-2 focus:ring-[#2eacb3]/30 transition-all resize-none disabled:opacity-60 disabled:cursor-not-allowed ${
            showRemarksError
              ? "border-red-400"
              : "border-gray-200 focus:border-[#2eacb3]"
          }`}
          placeholder={
            showRemarks
              ? "Remarks (e.g. Lost, Damaged, Returned)"
              : confirmed === true
                ? "Not required"
                : "Select Confirm or Dispute first"
          }
          value={remarksValue}
          disabled={!showRemarks || locked}
          onChange={(e) => onRemarksChange(asset.id, e.target.value)}
          onBlur={() => onRemarksBlur(asset.id)}
          rows={2}
        />
        {showRemarksError && (
          <p className="text-[11px] text-red-500 mt-1">Remarks required.</p>
        )}
      </td>
    </tr>
  );
});

interface AssetTableProps {
  assets: AssetItem[];
  rowStates: Record<string, AssetRowState>;
  onSetConfirmed: (id: string, confirmed: boolean) => void;
  onRemarksChange: (id: string, value: string) => void;
  onRemarksBlur: (id: string) => void;
  onUnlock: (id: string) => void;
  onView: (asset: AssetItem) => void;
}

const AssetTable: React.FC<AssetTableProps> = ({
  assets,
  rowStates,
  onSetConfirmed,
  onRemarksChange,
  onRemarksBlur,
  onUnlock,
  onView,
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-100 max-h-[400px]">
      <table className="w-full border-collapse min-w-[980px] ">
        <thead className="sticky top-0 z-10 bg-gray-50">
          <tr className="text-left">
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Image
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Asset Name
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Model
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Serial No.
            </th>
            <th className="px-4  py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Allotted Date
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Details
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Verification
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Remark
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {assets.map((asset) => (
            <AssetTableRow
              key={asset.id}
              asset={asset}
              state={
                rowStates[asset.id] ?? {
                  confirmed: undefined,
                  locked: false,
                  remarksValue: "",
                  showSelectionError: false,
                  showRemarksError: false,
                }
              }
              onSetConfirmed={onSetConfirmed}
              onRemarksChange={onRemarksChange}
              onRemarksBlur={onRemarksBlur}
              onUnlock={onUnlock}
              onView={onView}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssetTable;
