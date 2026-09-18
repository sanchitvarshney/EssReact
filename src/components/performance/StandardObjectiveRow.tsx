import { memo } from "react";
import { Typography } from "@mui/material";
import { StyledTableCell, StyledTableRow } from "../../pages/LeaveStatusPage";
import WeightageInputs from "./WeightageInputs";
import ObjectiveIndexBadge from "./ObjectiveIndexBadge";
import type { KeyObjective } from "../../types/performance-types/keyObjectives";

interface StandardObjectiveRowProps {
  index: number;
  objective: KeyObjective;
  onUpdate: (
    objectiveId: string,
    column: "totalWeightage" | "managerWeightage",
    field: "percentage" | "remarks",
    value: string
  ) => void;
}

const StandardObjectiveRow = memo(({ index, objective, onUpdate }: StandardObjectiveRowProps) => {
  return (
    <StyledTableRow>
      <StyledTableCell sx={{ verticalAlign: "top" }}>
        <ObjectiveIndexBadge index={index} />
      </StyledTableCell>
      <StyledTableCell sx={{ verticalAlign: "top", minWidth: 280 }}>
        <Typography sx={{ fontWeight: 700, color: "#1f2937", fontSize: "0.9rem" }}>
          {objective.title}
        </Typography>
        {objective.description && (
          <Typography variant="body2" sx={{ color: "#6b7280", mt: 0.5, lineHeight: 1.5 }}>
            {objective.description}
          </Typography>
        )}
      </StyledTableCell>
      <WeightageInputs
        percentage={objective.totalWeightage?.percentage ?? null}
        remarks={objective.totalWeightage?.remarks ?? ""}
        onPercentageChange={(v) => onUpdate(objective.id, "totalWeightage", "percentage", v)}
        onRemarksChange={(v) => onUpdate(objective.id, "totalWeightage", "remarks", v)}
      />
      <WeightageInputs
        percentage={objective.managerWeightage?.percentage ?? null}
        remarks={objective.managerWeightage?.remarks ?? ""}
        onPercentageChange={(v) => onUpdate(objective.id, "managerWeightage", "percentage", v)}
        onRemarksChange={(v) => onUpdate(objective.id, "managerWeightage", "remarks", v)}
      />
      <StyledTableCell />
    </StyledTableRow>
  );
});

StandardObjectiveRow.displayName = "StandardObjectiveRow";

export default StandardObjectiveRow;
