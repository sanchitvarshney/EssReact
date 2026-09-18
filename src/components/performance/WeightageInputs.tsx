import { memo } from "react";
import { TextField, InputAdornment } from "@mui/material";
import { StyledTableCell } from "../../pages/LeaveStatusPage";

interface WeightageInputsProps {
  percentage: number | null;
  remarks: string;
  onPercentageChange: (value: string) => void;
  onRemarksChange: (value: string) => void;
  disabled?: boolean;
}

const percentageSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#f9fafb",
    fontSize: "0.85rem",
    fontWeight: 600,
    transition: "box-shadow 0.15s",
    "& fieldset": { borderColor: "#e5e7eb" },
    "&:hover fieldset": { borderColor: "#2eacb3" },
    "&.Mui-focused": { boxShadow: "0 0 0 3px rgba(46,172,179,0.15)" },
    "&.Mui-focused fieldset": { borderColor: "#2eacb3", borderWidth: "1.5px" },
  },
  "& input": { textAlign: "center", padding: "8.5px 0" },
};

const remarksSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#f9fafb",
    fontSize: "0.8rem",
    transition: "box-shadow 0.15s",
    "& fieldset": { borderColor: "#e5e7eb" },
    "&:hover fieldset": { borderColor: "#9ca3af" },
    "&.Mui-focused": { boxShadow: "0 0 0 3px rgba(46,172,179,0.15)" },
    "&.Mui-focused fieldset": { borderColor: "#2eacb3", borderWidth: "1.5px" },
  },
};

const WeightageInputs = memo(
  ({
    percentage,
    remarks,
    onPercentageChange,
    onRemarksChange,
    disabled,
  }: WeightageInputsProps) => (
    <>
      <StyledTableCell sx={{ width: 110 }}>
        <TextField
          size="small"
          type="number"
          value={percentage ?? ""}
          onChange={(e) => onPercentageChange(e.target.value)}
          disabled={disabled}
          placeholder="0"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{ color: "#9ca3af", fontSize: "0.75rem" }}
                >
                  %
                </InputAdornment>
              ),
              inputProps: { min: 0, max: 100 },
            },
          }}
          sx={{ width: 90, ...percentageSx }}
        />
      </StyledTableCell>
      <StyledTableCell>
        <TextField
          size="small"
          fullWidth
          value={remarks}
          onChange={(e) => onRemarksChange(e.target.value)}
          disabled={disabled}
          placeholder="Enter remarks"
          sx={remarksSx}
        />
      </StyledTableCell>
    </>
  ),
);

WeightageInputs.displayName = "WeightageInputs";

export default WeightageInputs;
