import { Paper, Table, TableBody, TableContainer, TableHead, TableRow, Chip, Tooltip } from "@mui/material";
import { ChevronRight } from "lucide-react";
import { StyledTableCell, StyledTableRow } from "../../pages/LeaveStatusPage";
import { CustomButton } from "../ui/CustomButton";
import type { TeamMember, TeamMemberStatus } from "../../types/performance-types/kraRating";

const STATUS_LABELS: Record<TeamMemberStatus, string> = {
  no_kra: "No KRA Setup",
  no_points: "No Points",
  pending: "Pending",
  partial: "Partial",
  complete: "Complete",
};

const STATUS_COLORS: Record<TeamMemberStatus, { bg: string; color: string }> = {
  no_kra: { bg: "#f3f4f6", color: "#6b7280" },
  no_points: { bg: "#f3f4f6", color: "#6b7280" },
  pending: { bg: "#fef9c3", color: "#854d0e" },
  partial: { bg: "#dbeafe", color: "#1d4ed8" },
  complete: { bg: "#dcfce7", color: "#15803d" },
};

interface MyTeamListProps {
  members: TeamMember[];
  onSelect: (empId: string) => void;
}

const MyTeamList = ({ members, onSelect }: MyTeamListProps) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col flex-1 overflow-hidden">
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ flex: 1, overflow: "auto", borderRadius: 0, boxShadow: "none" }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell>Employee</StyledTableCell>
              <StyledTableCell align="center">Points</StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
              <StyledTableCell align="center">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => {
              const disabled = !member.hasKraSetup;
              const colors = STATUS_COLORS[member.status];
              return (
                <StyledTableRow key={member.empId}>
                  <StyledTableCell sx={{ fontWeight: 600 }}>{member.empName}</StyledTableCell>
                  <StyledTableCell align="center">
                    {member.hasKraSetup ? `${member.mgrFilled}/${member.totalPoints}` : "—"}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Chip
                      label={STATUS_LABELS[member.status]}
                      size="small"
                      sx={{ bgcolor: colors.bg, color: colors.color, fontWeight: 700, fontSize: 11 }}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Tooltip title={disabled ? "KRA not set up yet" : ""} placement="left">
                      <span>
                        <CustomButton
                          size="sm"
                          disabled={disabled}
                          onClick={() => onSelect(member.empId)}
                          className="cursor-pointer bg-gradient-to-r from-[#2eacb3] to-[#1e8a8f] hover:from-[#1e8a8f] hover:to-[#2eacb3] text-white"
                        >
                          Rate
                          <ChevronRight size={14} className="ml-0.5" />
                        </CustomButton>
                      </span>
                    </Tooltip>
                  </StyledTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MyTeamList;
