import { Fragment } from "react";
import { Paper, Table, TableBody, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { StyledTableCell, StyledTableRow } from "../../pages/LeaveStatusPage";
import WeightageInputs from "./WeightageInputs";
import type { KraPoint, RatingEntry, RatingRole } from "../../types/performance-types/kraRating";

const HEADER_ROW1_HEIGHT = 44;
const HEADER_ROW2_HEIGHT = 38;

const stickyHeadSx = {
  position: "sticky" as const,
  borderBottom: "none",
  boxShadow: "inset 0 -2px 0 0 #e2e8f0",
};

const stickyHeadRow1Sx = { ...stickyHeadSx, top: 0, zIndex: 3 };
const stickyHeadRow1SpanSx = { ...stickyHeadSx, top: 0, zIndex: 4 };
const stickyHeadRow2Sx = { ...stickyHeadSx, top: HEADER_ROW1_HEIGHT, zIndex: 2 };

interface CategoryGroup {
  id: number;
  title: string;
  points: KraPoint[];
}

interface KraRatingTableProps {
  categories: CategoryGroup[];
  yourRole: RatingRole;
  editable: boolean;
  entries: Record<number, RatingEntry>;
  onUpdate: (pointId: number, field: keyof RatingEntry, value: string) => void;
  readOnlyValue: (pointId: number) => RatingEntry | null;
}

const emptyEntry: RatingEntry = { percentage: null, remarks: "" };

const KraRatingTable = ({
  categories,
  yourRole,
  editable,
  entries,
  onUpdate,
  readOnlyValue,
}: KraRatingTableProps) => {
  let runningIndex = 0;

  console.log("KraRatingTable rendered", { categories, yourRole, editable, entries });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col flex-1 overflow-hidden">
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ flex: 1, overflow: "auto", borderRadius: 0, boxShadow: "none" }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell
                rowSpan={2}
                sx={{
                  ...stickyHeadRow1SpanSx,
                  width: 48,
                  height: HEADER_ROW1_HEIGHT + HEADER_ROW2_HEIGHT,
                  verticalAlign: "middle",
                }}
              >
                #
              </StyledTableCell>
              <StyledTableCell
                rowSpan={2}
                sx={{
                  ...stickyHeadRow1SpanSx,
                  minWidth: 260,
                  height: HEADER_ROW1_HEIGHT + HEADER_ROW2_HEIGHT,
                  verticalAlign: "middle",
                }}
              >
                KRA Point
              </StyledTableCell>
              <StyledTableCell
                colSpan={2}
                align="center"
                sx={{ ...stickyHeadRow1Sx, borderLeft: "1px solid #e2e8f0", height: HEADER_ROW1_HEIGHT }}
              >
                Employee
              </StyledTableCell>
              <StyledTableCell
                colSpan={2}
                align="center"
                sx={{ ...stickyHeadRow1Sx, borderLeft: "1px solid #e2e8f0", height: HEADER_ROW1_HEIGHT }}
              >
                Reporting Manager
              </StyledTableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell
                sx={{ ...stickyHeadRow2Sx, borderLeft: "1px solid #e2e8f0", height: HEADER_ROW2_HEIGHT }}
              >
                Percentage
              </StyledTableCell>
              <StyledTableCell sx={{ ...stickyHeadRow2Sx, height: HEADER_ROW2_HEIGHT }}>
                Remarks
              </StyledTableCell>
              <StyledTableCell
                sx={{ ...stickyHeadRow2Sx, borderLeft: "1px solid #e2e8f0", height: HEADER_ROW2_HEIGHT }}
              >
                Percentage
              </StyledTableCell>
              <StyledTableCell sx={{ ...stickyHeadRow2Sx, height: HEADER_ROW2_HEIGHT }}>
                Remarks
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <Fragment key={category.id}>
                <TableRow>
                  <StyledTableCell colSpan={6} sx={{ backgroundColor: "#f8fafc" }}>
                    <Typography sx={{ fontWeight: 700, fontSize: "0.8rem", color: "#1e8a8f" }}>
                      {category.title}
                    </Typography>
                  </StyledTableCell>
                </TableRow>
                {category.points.map((point) => {
                  runningIndex += 1;
                  const employeeEditable = yourRole === "employee";
                  const employeeValue = employeeEditable
                    ? entries[point.id] ?? emptyEntry
                    : readOnlyValue(point.id) ?? emptyEntry;
                  const managerEditable = yourRole === "manager";
                  const managerValue = managerEditable
                    ? entries[point.id] ?? emptyEntry
                    : readOnlyValue(point.id) ?? emptyEntry;

                  return (
                    <StyledTableRow key={point.id}>
                      <StyledTableCell sx={{ color: "#6b7280", fontWeight: 600 }}>
                        {runningIndex}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography sx={{ fontSize: "0.85rem", color: "#374151" }}>
                          {point.point_text}
                        </Typography>
                      </StyledTableCell>
                      <WeightageInputs
                        percentage={employeeValue.percentage}
                        remarks={employeeValue.remarks}
                        disabled={!employeeEditable || !editable}
                        onPercentageChange={(v) => onUpdate(point.id, "percentage", v)}
                        onRemarksChange={(v) => onUpdate(point.id, "remarks", v)}
                      />
                      <WeightageInputs
                        percentage={managerValue.percentage}
                        remarks={managerValue.remarks}
                        disabled={!managerEditable || !editable}
                        onPercentageChange={(v) => onUpdate(point.id, "percentage", v)}
                        onRemarksChange={(v) => onUpdate(point.id, "remarks", v)}
                      />
                    </StyledTableRow>
                  );
                })}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default KraRatingTable;
