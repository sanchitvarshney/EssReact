import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { PrimaryButton } from "../components/FormControls";
import { ErrorState } from "../components/AsyncState";
import { CardSkeleton } from "../components/Skeleton";
import { useToast } from "../components/ToastProvider";
import { fetchFaceRecognitionSettings, updateFaceRecognitionSettings } from "../services/mscguardSettings";
import { McGuardApiError } from "../services/mscguardApi";

export default function Settings() {
  const toast = useToast();
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [thresholdPct, setThresholdPct] = useState(56);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoadState("loading");
    try {
      const data = await fetchFaceRecognitionSettings();
      setEnabled(data.enabled);
      setThresholdPct(Math.round(data.threshold * 100));
      setLoadState("loaded");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoadState("error");
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const data = await updateFaceRecognitionSettings({ enabled, threshold: thresholdPct / 100 });
      setEnabled(data.enabled);
      setThresholdPct(Math.round(data.threshold * 100));
      toast.success("Settings saved.");
    } catch (err) {
      toast.error(err instanceof McGuardApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Admin" title="App Settings" />

      {loadState === "loading" && <CardSkeleton />}
      {loadState === "error" && <ErrorState message={errorMessage} onRetry={load} />}
      {loadState === "loaded" && (
        <div className="bg-white border border-gray-200 rounded-md p-6 max-w-xl">
          <div className="text-sm font-semibold text-gray-800 mb-1">Face Match Threshold</div>
          <p className="text-xs text-gray-500 mb-5">
            Controls how strictly the guard app matches a scanned face against enrolled visitors. Applies to every
            guard's app — a higher percentage requires a closer match (fewer false positives, more retries); a lower
            percentage is more lenient (fewer retries, more risk of a wrong match).
          </p>

          <label className="flex items-center gap-2 text-sm text-gray-600 mb-6 cursor-pointer">
            <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="accent-blue-700" />
            Face recognition enabled
          </label>

          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Match Threshold</span>
            <span className="text-lg font-bold text-blue-700">{thresholdPct}%</span>
          </div>
          <input
            type="range"
            min={40}
            max={95}
            value={thresholdPct}
            onChange={(e) => setThresholdPct(Number(e.target.value))}
            disabled={!enabled}
            className="w-full accent-blue-700 disabled:opacity-50"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1 mb-6">
            <span>40% (lenient)</span>
            <span>95% (strict)</span>
          </div>

          <PrimaryButton onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save Settings"}
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}
