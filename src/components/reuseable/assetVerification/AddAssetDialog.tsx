import { useEffect, useState } from "react";
import { Dialog, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import { Textarea } from "../../ui/textarea";
import { ACCENT, type AddedAssetEntry } from "./types";

const REMARK_MAX_LENGTH = 250;

interface DraftRow {
  key: string;
  name: string;
  remark: string;
}

const emptyRow = (): DraftRow => ({
  key: `row_${Date.now()}_${Math.random().toString(36).slice(2)}`,
  name: "",
  remark: "",
});

interface AddAssetDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (entries: AddedAssetEntry[]) => void;
}

const AddAssetDialog: React.FC<AddAssetDialogProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [rows, setRows] = useState<DraftRow[]>([emptyRow()]);
  const [touchedRows, setTouchedRows] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (open) {
      setRows([emptyRow()]);
      setTouchedRows({});
    }
  }, [open]);

  const handleAddRow = () => {
    setRows((prev) => [...prev, emptyRow()]);
  };

  const handleRemoveRow = (key: string) => {
    setRows((prev) => prev.filter((row) => row.key !== key));
  };

  const handleNameChange = (key: string, value: string) => {
    setRows((prev) =>
      prev.map((row) => (row.key === key ? { ...row, name: value } : row)),
    );
  };

  const handleRemarkChange = (key: string, value: string) => {
    setRows((prev) =>
      prev.map((row) =>
        row.key === key
          ? { ...row, remark: value.slice(0, REMARK_MAX_LENGTH) }
          : row,
      ),
    );
  };

  const rowIsIncomplete = (row: DraftRow) => {
    const started = row.name.trim() || row.remark.trim();
    return !!started && (!row.name.trim() || !row.remark.trim());
  };

  const handleSave = () => {
    const incompleteKeys = rows.filter(rowIsIncomplete).map((r) => r.key);
    if (incompleteKeys.length > 0) {
      setTouchedRows((prev) => {
        const next = { ...prev };
        incompleteKeys.forEach((k) => {
          next[k] = true;
        });
        return next;
      });
      return;
    }

    const entries: AddedAssetEntry[] = rows
      .filter((row) => row.name.trim() && row.remark.trim())
      .map((row) => ({
        id: row.key,
        name: row.name.trim(),
        remark: row.remark.trim(),
      }));

    onSave(entries);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
    >
      <div className="flex flex-col bg-white max-h-[85vh]">
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <p className="text-base font-bold text-gray-800">Add Asset</p>
            <p className="text-xs text-gray-400">
              List any assets not shown in your official list.
            </p>
          </div>
          <IconButton onClick={onClose} size="small" aria-label="Close">
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar-for-menu px-5 py-4 flex flex-col gap-4">
          {rows.map((row, i) => {
            const incomplete = touchedRows[row.key] && rowIsIncomplete(row);
            return (
              <div
                key={row.key}
                className="rounded-xl border border-gray-100 bg-gray-50/60 p-3 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500">
                    Asset {i + 1}
                  </span>
                  <button
                    onClick={() => handleRemoveRow(row.key)}
                    aria-label={`Remove asset ${i + 1}`}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                  </button>
                </div>

                <input
                  type="text"
                  value={row.name}
                  onChange={(e) => handleNameChange(row.key, e.target.value)}
                  placeholder="Asset name (e.g. Mouse, Laptop charger)"
                  className={`w-full text-sm rounded-lg border bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2eacb3]/30 transition-all ${
                    incomplete && !row.name.trim()
                      ? "border-red-400"
                      : "border-gray-200 focus:border-[#2eacb3]"
                  }`}
                />

                <div>
                  <Textarea
                    value={row.remark}
                    onChange={(e) =>
                      handleRemarkChange(row.key, e.target.value)
                    }
                    placeholder="Remark (e.g. why you have this / where it came from)"
                    rows={2}
                    className={`w-full text-sm rounded-lg border bg-white resize-none focus:outline-none focus:ring-2 focus:ring-[#2eacb3]/30 transition-all ${
                      incomplete && !row.remark.trim()
                        ? "border-red-400"
                        : "border-gray-200 focus:border-[#2eacb3]"
                    }`}
                  />
                  <div className="flex items-center justify-between mt-1">
                    {incomplete ? (
                      <p className="text-[11px] text-red-500">
                        Both asset name and remark are required.
                      </p>
                    ) : (
                      <span />
                    )}
                    <span className="text-[11px] text-gray-400 tabular-nums">
                      {row.remark.length}/{REMARK_MAX_LENGTH}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          <button
            onClick={handleAddRow}
            className="flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2.5 rounded-lg border border-dashed border-gray-300 text-gray-500 hover:border-[#2eacb3] hover:text-[#2eacb3] transition-colors"
          >
            <AddIcon sx={{ fontSize: 16 }} />
            Add another asset
          </button>
        </div>

        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="text-sm font-semibold px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="text-sm font-semibold px-5 py-2.5 rounded-xl text-white transition-all"
            style={{ background: `linear-gradient(90deg, ${ACCENT}, #00d4e4)` }}
          >
            Add to list
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default AddAssetDialog;
