import { useMemo, useState } from "react";
import { Box, Chip, Tab, Tabs, Typography } from "@mui/material";
import { CustomButton } from "../components/ui/CustomButton";
import { useAuth } from "../contextapi/AuthContext";
import { useGetMyTeamQuery, useGetRatingWindowQuery } from "../services/kraRating";
import { useRatingForm } from "../hooks/useRatingForm";
import { getFinancialYearCode } from "../helper/financialYear";
import { extractMessage } from "../types/performance-types/kraRating";
import KraRatingTable from "../components/performance/KraRatingTable";
import MyTeamList from "../components/performance/MyTeamList";
import RatingWindowBanner from "../components/performance/RatingWindowBanner";
import EmptyData from "../components/reuseable/EmptyData";

type TabKey = "self" | "team";

const RatingPanel = ({ empId, fy, onSaved }: { empId: string; fy: string; onSaved?: () => void }) => {
  const {
    isFetching,
    isNetworkError,
    isAuthorized,
    envelope,
    data,
    categories,
    entries,
    updateEntry,
    readOnlyValue,
    save,
    saving,
    resetEntries,
  } = useRatingForm(empId, fy);

  if (isFetching && !data) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm">
        <Typography sx={{ color: "#6b7280", fontSize: 14 }}>Loading KRA points…</Typography>
      </div>
    );
  }

if (isNetworkError || !isAuthorized) {
  const message = envelope
    ? extractMessage(envelope.message, "You're not authorized to view this rating.")
    : "Could not reach the server. Please try again.";

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
    
    <EmptyData title={message} />
     
    </div>
  );
}

  if (!data) return null;

  const handleSave = async () => {
    const ok = await save();
    if (ok) onSaved?.();
  };

  return (
    <>
      <div className="flex items-center justify-between px-1">
        <Typography sx={{ fontSize: 13, color: "#6b7280" }}>
          Rating for <strong>{data.window.targetMonth}</strong> — you're rating as{" "}
          <strong>{data.yourRole === "employee" ? "Employee" : "Reporting Manager"}</strong>
        </Typography>
      </div>
      <KraRatingTable
        categories={categories}
        yourRole={data.yourRole}
        editable={data.window.open}
        entries={entries}
        onUpdate={updateEntry}
        readOnlyValue={readOnlyValue}
      />
      <div className="flex items-center justify-end gap-3">
        <CustomButton onClick={resetEntries} variant="outline" className="cursor-pointer">
          Cancel
        </CustomButton>
        <CustomButton
          onClick={handleSave}
          disabled={saving || !data.window.open}
          className="cursor-pointer bg-gradient-to-r from-[#2eacb3] to-[#1e8a8f] hover:from-[#1e8a8f] hover:to-[#2eacb3] text-white"
        >
          {saving ? "Saving..." : "Save"}
        </CustomButton>
      </div>
    </>
  );
};

const PerformancePage = () => {
  const { user } = useAuth();
  const empId = (user as { id?: string } | null)?.id ?? "";
  const fy = useMemo(() => getFinancialYearCode(new Date()), []);

  const { data: windowEnvelope, isFetching: windowLoading, isError: windowError } =
    useGetRatingWindowQuery();
  const window_ = windowEnvelope?.status === "success" ? windowEnvelope.data : undefined;

  const { data: teamEnvelope, refetch: refetchTeam } = useGetMyTeamQuery(
    { fy },
    { skip: !window_?.open }
  );
  const team = teamEnvelope?.status === "success" ? teamEnvelope.data : [];

  const [tab, setTab] = useState<TabKey>("self");
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);

  if (windowLoading) {
    return (
      <Box className="h-[calc(100vh-80px)] flex items-center justify-center">
        <Typography sx={{ color: "#6b7280", fontSize: 14 }}>Checking rating window…</Typography>
      </Box>
    );
  }

  if (windowError || !window_) {
    return (
      <Box className="h-[calc(100vh-80px)] flex items-center justify-center">
        <Typography sx={{ color: "#ef4444", fontSize: 14, fontWeight: 600 }}>
          Could not reach the server. Please try again.
        </Typography>
      </Box>
    );
  }

  if (!window_.open) {
    return (
      <Box className="h-[calc(100vh-80px)] overflow-hidden p-4 flex flex-col">
        <RatingWindowBanner targetMonth={window_.targetMonth} />
      </Box>
    );
  }

  return (
    <Box className="h-[calc(100vh-80px)] overflow-hidden p-4 flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#1f2937" }}>
          KRA Monthly Rating
        </Typography>
        <Chip
          label={`Target month: ${window_.targetMonth}`}
          size="small"
          sx={{ bgcolor: "#fff", border: "1px solid #e2e8f0", color: "#374151", fontWeight: 600, px: 1 }}
        />
      </div>

      {team.length > 0 && (
        <Tabs
          value={tab}
          onChange={(_, value) => {
            setTab(value);
            setSelectedEmpId(null);
          }}
          sx={{ minHeight: 36, "& .MuiTab-root": { minHeight: 36, textTransform: "none", fontWeight: 600 } }}
        >
          <Tab value="self" label="My Rating" />
          <Tab value="team" label="My Team" />
        </Tabs>
      )}

      {tab === "self" || team.length === 0 ? (
        <RatingPanel empId={empId} fy={fy} />
      ) : selectedEmpId ? (
        <>
          <div>
            <CustomButton
              onClick={() => setSelectedEmpId(null)}
              variant="outline"
              className="cursor-pointer"
            >
              ← Back to team
            </CustomButton>
          </div>
          <RatingPanel
            empId={selectedEmpId}
            fy={fy}
            onSaved={() => {
              refetchTeam();
              setSelectedEmpId(null);
            }}
          />
        </>
      ) : (
        <MyTeamList members={team} onSelect={setSelectedEmpId} />
      )}
    </Box>
  );
};

export default PerformancePage;
