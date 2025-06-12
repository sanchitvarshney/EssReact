import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";
import type { FC } from "react";

type AttendancePageTablePropsType = {
  value: string | number;
};

const AttendancePageTable: FC<AttendancePageTablePropsType> = ({ value }) => {
  console.log(value);
  return (
    <Card
      sx={{
        minWidth: { xs: "100%", sm: 180 },
        borderRadius: 2,
        boxShadow: 3,
        // m: 1,
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 600,
            fontSize: { xs: "0.9rem", sm: "1.1rem" },
          }}
        >
          Present Shift{" "}
        </Typography>

        <Divider sx={{ mt: 2 }} />

        <div className="grid grid-cols-2  mt-2 px-5 py-2">
          {" "}
          <Typography variant="body2" color="text.secondary">
            Shift Code (Division)
          </Typography>
          <Typography
            variant="body2"
            color="text.primary"
            sx={{ textAlign: "right" }}
          >
            D1 (MS01)
          </Typography>
        </div>
        <div className="grid grid-cols-2  mt-2 px-5 py-2">
          {" "}
          <Typography variant="body2" color="text.secondary">
            Start Time
          </Typography>
          <Typography
            variant="body2"
            color="text.primary"
            sx={{ textAlign: "right" }}
          >
            09:00 AM
          </Typography>
        </div>
        <div className="grid grid-cols-2  mt-2 px-5 py-2">
          {" "}
          <Typography variant="body2" color="text.secondary">
            End Time
          </Typography>
          <Typography
            variant="body2"
            color="text.primary"
            sx={{ textAlign: "right" }}
          >
            18:00 PM
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendancePageTable;
