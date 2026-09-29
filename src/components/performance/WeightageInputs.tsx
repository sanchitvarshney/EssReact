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

const PERCENTAGE_PATTERN = /^(100|\d{0,2})$/;

const percentageSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#f9fafb",
    fontSize: "0.85rem",
    fontWeight: 600,
    transition: "box-shadow 0.15s",
    "& fieldset": { borderColor: "#e5e7eb" },
    "&:hover fieldset": { borderColor: "#00a0a0" },
    "&.Mui-focused": { boxShadow: "0 0 0 3px rgba(0,160,160,0.15)" },
    "&.Mui-focused fieldset": { borderColor: "#00a0a0", borderWidth: "1.5px" },
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
    "&.Mui-focused": { boxShadow: "0 0 0 3px rgba(0,160,160,0.15)" },
    "&.Mui-focused fieldset": { borderColor: "#00a0a0", borderWidth: "1.5px" },
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
          value={percentage ?? ""}
          onChange={(e) => {
            // Digits only, 0-99, or exactly 100 - no signs, decimals or 3-digit values above 100.
            if (PERCENTAGE_PATTERN.test(e.target.value)) onPercentageChange(e.target.value);
          }}
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
              inputProps: { inputMode: "numeric", maxLength: 3 },
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
