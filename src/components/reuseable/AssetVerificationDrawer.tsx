import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Drawer, CircularProgress } from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AddIcon from "@mui/icons-material/Add";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useToast } from "../../hooks/useToast";
import {
  useGetPeripheralMutation,
  useSubmitAssetVerificationMutation,
} from "../../services/doc";
import { useAuth } from "../../contextapi/AuthContext";
import AssetTable, {
  type AssetRowState,
} from "./assetVerification/AssetTable";
import AssetDetailsDialog from "./assetVerification/AssetDetailsDialog";
import AddAssetDialog from "./assetVerification/AddAssetDialog";
import AssetVerificationSkeleton from "../../skeleton/AssetVerificationSkeleton";
import {
  ACCENT,
  mapAssetItem,
  type AddedAssetEntry,
  type AssetItem,
} from "./assetVerification/types";

interface AssetVerificationDrawerProps {
  open: boolean;
  /** Called once verification has been saved (or there was nothing to verify). */
  onComplete: () => void;
}

const AssetVerificationDrawer: React.FC<AssetVerificationDrawerProps> = ({
  open,
  onComplete,
}) => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const userId = (user as any)?.id as string | undefined;

  const [
    getPeripheral,
    { data: peripheralData, isLoading, isError },
  ] = useGetPeripheralMutation();

  const [submitAssetVerification, { isLoading: isSubmitting }] =
    useSubmitAssetVerificationMutation();

  const assets: AssetItem[] = useMemo(() => {
    const raw = Array.isArray(peripheralData) ? peripheralData : [];
    return raw.map(mapAssetItem);
  }, [peripheralData]);

  const fetchAssets = useCallback(() => {
    if (!userId) return;
    //@ts-expect-error empcode payload not reflected in mutation's void type
    getPeripheral({ empcode: userId }).catch((err: any) => {
      showToast(
        err?.data?.message?.msg || err?.message || "Failed to load assets.",
        "error",
      );
    });
  }, [getPeripheral, showToast, userId]);

  // Guards against duplicate /assets calls: React 18 StrictMode intentionally
  // double-invokes effects in dev, and any unstable dependency (e.g. a context
  // callback recreated on every render) would otherwise re-fire this effect.
  // One fetch per "open" session is all that's ever needed; closing resets it
  // so the next time the drawer opens it fetches fresh data again.
  const hasFetchedRef = useRef(false);
  useEffect(() => {
    if (!open) {
      hasFetchedRef.current = false;
      return;
    }
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchAssets();
  }, [open, fetchAssets]);

  // Verification selection is tri-state: absent from the map means the user
  // hasn't chosen Confirm/Dispute yet (requirement: nothing selected by default).
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [remarksMap, setRemarksMap] = useState<Record<string, string>>({});
  const [touchedMap, setTouchedMap] = useState<Record<string, boolean>>({});
  const [lockedMap, setLockedMap] = useState<Record<string, boolean>>({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const [addedAssets, setAddedAssets] = useState<AddedAssetEntry[]>([]);
  const [showAddAssetDialog, setShowAddAssetDialog] = useState(false);

  // Keep latest copies for stable callbacks below (avoids re-creating a new
  // function identity on every keystroke, which would defeat AssetTable's memo).
  const checkedMapRef = useRef(checkedMap);
  checkedMapRef.current = checkedMap;
  const remarksMapRef = useRef(remarksMap);
  remarksMapRef.current = remarksMap;
  const lockedMapRef = useRef(lockedMap);
  lockedMapRef.current = lockedMap;

  const [viewAsset, setViewAsset] = useState<AssetItem | null>(null);
  const [viewIndex, setViewIndex] = useState(0);
  const [viewDirection, setViewDirection] = useState(0);

  const openAssetView = useCallback((asset: AssetItem) => {
    setViewAsset(asset);
    setViewIndex(0);
    setViewDirection(0);
  }, []);

  const closeAssetView = useCallback(() => setViewAsset(null), []);

  const viewImages = viewAsset?.images ?? [];

  const handleViewPrev = useCallback(() => {
    setViewDirection(-1);
    setViewIndex((i) => {
      const len = viewImages.length;
      return len < 2 ? i : (i - 1 + len) % len;
    });
  }, [viewImages.length]);

  const handleViewNext = useCallback(() => {
    setViewDirection(1);
    setViewIndex((i) => {
      const len = viewImages.length;
      return len < 2 ? i : (i + 1) % len;
    });
  }, [viewImages.length]);

  const handleViewSelect = useCallback(
    (i: number) => {
      setViewDirection(i > viewIndex ? 1 : -1);
      setViewIndex(i);
    },
    [viewIndex],
  );

  const resetState = () => {
    setCheckedMap({});
    setRemarksMap({});
    setTouchedMap({});
    setLockedMap({});
    setAttemptedSubmit(false);
    setAddedAssets([]);
  };

  const handleSetConfirmed = useCallback((id: string, confirmed: boolean) => {
    if (lockedMapRef.current[id]) return;
    setCheckedMap((prev) => ({ ...prev, [id]: confirmed }));
  }, []);

  const handleRemarksChange = useCallback((id: string, value: string) => {
    setRemarksMap((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleRemarksBlur = useCallback((id: string) => {
    setTouchedMap((prev) => ({ ...prev, [id]: true }));
    // Lock the entry once a remark has been entered for a disputed asset,
    // so moving on to the next item doesn't leave it open to accidental edits.
    if (checkedMapRef.current[id] === false && remarksMapRef.current[id]?.trim()) {
      setLockedMap((prev) => ({ ...prev, [id]: true }));
    }
  }, []);

  const handleUnlock = useCallback((id: string) => {
    setLockedMap((prev) => ({ ...prev, [id]: false }));
  }, []);

  const handleAddAssets = useCallback((entries: AddedAssetEntry[]) => {
    setAddedAssets((prev) => [...prev, ...entries]);
  }, []);

  const handleRemoveAddedAsset = useCallback((id: string) => {
    setAddedAssets((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const unselected = useMemo(
    () => assets.filter((asset) => checkedMap[asset.id] === undefined),
    [assets, checkedMap],
  );

  const missingRemarks = useMemo(
    () =>
      assets.filter(
        (asset) =>
          checkedMap[asset.id] === false && !remarksMap[asset.id]?.trim(),
      ),
    [assets, checkedMap, remarksMap],
  );

  const isValid = unselected.length === 0 && missingRemarks.length === 0;

  const rowStates: Record<string, AssetRowState> = useMemo(() => {
    const map: Record<string, AssetRowState> = {};
    assets.forEach((asset) => {
      const confirmed =
        checkedMap[asset.id] === undefined ? undefined : checkedMap[asset.id];
      map[asset.id] = {
        confirmed,
        locked: !!lockedMap[asset.id],
        remarksValue: remarksMap[asset.id] || "",
        showSelectionError: attemptedSubmit && confirmed === undefined,
        showRemarksError:
          confirmed === false &&
          !remarksMap[asset.id]?.trim() &&
          (touchedMap[asset.id] || attemptedSubmit),
      };
    });
    return map;
  }, [assets, checkedMap, remarksMap, touchedMap, lockedMap, attemptedSubmit]);

  const handleSave = async () => {
    if (!isValid) {
      setAttemptedSubmit(true);
      setTouchedMap((prev) => {
        const next = { ...prev };
        missingRemarks.forEach((asset) => {
          next[asset.id] = true;
        });
        return next;
      });
      return;
    }

    const items = assets.map((asset) => {
      const confirmed = checkedMap[asset.id] === true;
      return {
        asset_txn_id: asset.assetTxnId,
        action: confirmed ? "CONFIRM" : "DISPUTE",
        ...(confirmed ? {} : { description: remarksMap[asset.id]?.trim() }),
      };
    });

    if (items.length === 0 && addedAssets.length === 0) {
      resetState();
      onComplete();
      return;
    }

    try {
   
      if (addedAssets.length > 0) {
       const newItems = addedAssets.map((entry) => ({
          asset_txn_id: entry.name,
          action: "MISSING",
          description: entry.remark,
        }));
        items.push(...newItems);
      }
         const payload: any = { items };

      await submitAssetVerification(payload).unwrap();
      showToast("Asset verification submitted successfully.", "success");
      resetState();
      onComplete();
    } catch (err: any) {
      showToast(
        err?.data?.message?.msg ||
          err?.data?.message ||
          err?.message ||
          "Failed to submit asset verification.",
        "error",
      );
    }
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={(_, reason) => {
          // Mandatory: cannot be dismissed without saving
          if (reason === "backdropClick" || reason === "escapeKeyDown") return;
        }}
        PaperProps={{
          sx: {
            width: { xs: "100%", md: "85vw" },
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#e0f7fa" }}
            >
              <Inventory2Icon sx={{ color: ACCENT, fontSize: 20 }} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800 leading-tight">
                Asset Verification
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Please confirm the company assets currently assigned to you
                before continuing.
              </p>
            </div>
          </div>

          {!isLoading && !isError && (
            <button
              onClick={() => setShowAddAssetDialog(true)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-dashed border-gray-300 text-gray-500 hover:border-[#2eacb3] hover:text-[#2eacb3] transition-colors flex-shrink-0"
            >
              <AddIcon sx={{ fontSize: 16 }} />
              Add Asset
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar-for-menu px-5 py-4 flex flex-col gap-5">
          {isLoading ? (
            <AssetVerificationSkeleton />
          ) : isError ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 py-16 text-center">
              <ErrorOutlineIcon sx={{ fontSize: 40, color: "#ef4444" }} />
              <p className="text-sm text-gray-500">
                Failed to load assets. Please try again.
              </p>
              <button
                onClick={fetchAssets}
                className="text-xs font-semibold px-4 py-2 rounded-lg text-white"
                style={{ backgroundColor: ACCENT }}
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {assets.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                  <Inventory2Icon sx={{ fontSize: 40, color: "#cbd5e1" }} />
                  <p className="text-sm text-gray-400 font-medium">
                    No assets currently assigned.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-start gap-2.5 rounded-xl border border-[#2eacb3]/20 bg-[#2eacb3]/5 px-4 py-3">
                    <InfoOutlinedIcon
                      sx={{ fontSize: 18, color: ACCENT, mt: "1px", flexShrink: 0 }}
                    />
                    <p className="text-xs text-gray-600 leading-relaxed">
                      <span className="font-semibold text-gray-700">
                        How to verify:
                      </span>{" "}
                      For each asset below, select <span className="font-semibold">Confirm</span> if
                      it is currently in your possession, or{" "}
                      <span className="font-semibold">Dispute</span> if it is
                      not — a remark is required in that case. Click the{" "}
                      <span className="font-semibold">View</span> action to
                      see full specifications and photos before deciding.
                    </p>
                  </div>
                  <AssetTable
                    assets={assets}
                    rowStates={rowStates}
                    onSetConfirmed={handleSetConfirmed}
                    onRemarksChange={handleRemarksChange}
                    onRemarksBlur={handleRemarksBlur}
                    onUnlock={handleUnlock}
                    onView={openAssetView}
                  />
                </>
              )}

              {/* Manually added assets not in the official list */}
              {addedAssets.length > 0 && (
                <div className="flex flex-col gap-2 ">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Added assets
                  </p>
                  <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                    {addedAssets.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-start justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50/40 px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800">
                            {entry.name}
                          </p>
                          <p className="text-xs text-gray-500 break-words">
                            {entry.remark}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveAddedAsset(entry.id)}
                          className="text-xs font-semibold text-gray-400 hover:text-red-500 flex-shrink-0"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!isLoading && !isError && (
          <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-100 flex-shrink-0">
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="text-sm font-semibold px-5 py-2.5 rounded-xl text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              style={{
                background: "linear-gradient(90deg, #2eacb3, #00d4e4)",
              }}
            >
              {isSubmitting && (
                <CircularProgress size={14} sx={{ color: "#fff" }} />
              )}
              {isSubmitting
                ? "Saving…"
                : assets.length === 0 && addedAssets.length === 0
                  ? "Continue"
                  : "Save"}
            </button>
          </div>
        )}
      </Drawer>

      <AssetDetailsDialog
        asset={viewAsset}
        index={viewIndex}
        direction={viewDirection}
        onClose={closeAssetView}
        onPrev={handleViewPrev}
        onNext={handleViewNext}
        onSelect={handleViewSelect}
      />

      <AddAssetDialog
        open={showAddAssetDialog}
        onClose={() => setShowAddAssetDialog(false)}
        onSave={handleAddAssets}
      />
    </>
  );
};

export default AssetVerificationDrawer;
