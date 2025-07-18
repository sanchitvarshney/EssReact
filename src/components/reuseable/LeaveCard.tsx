import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";
import type { FC } from "react";


type LeaveCardPropsType = {
  title: string;
  currentValue: string | number;
img:any
  credited: string | number;
  annualAllotment: string | number;
};

const LeaveCard: FC<LeaveCardPropsType> = ({
  title,
  currentValue,
img,
  credited,
  annualAllotment,
}) => {
  return (
    <Card
      sx={{
        minWidth: { xs: "100%", sm: 180 },
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <CardContent>
       <div className="flex items-center space-x-2">
        <img src={img} alt="leave" className="w-12" />
         <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 600,
            fontSize: { xs: "1rem", sm: "1.2rem" },
          }}
        >
          {title}
        </Typography>
       </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 px-5 py-2">
          <Typography variant="body2" color="text.secondary">
            Currently Available
          </Typography>
          <Typography
            variant="body2"
            color="text.primary"
            sx={{ textAlign: "right" }}
          >
            {currentValue}
          </Typography>
        </div>

        <Divider sx={{ mt: 2 }} />

        <div className="grid grid-cols-2  mt-2 px-5 py-2">
          {" "}
          <Typography variant="body2" color="text.secondary">
            Credited from last month
          </Typography>
          <Typography
            variant="body2"
            color="text.primary"
            sx={{ textAlign: "right" }}
          >
            {credited}
          </Typography>
        </div>
        <div className="grid grid-cols-2  mt-2 px-5 py-2">
          {" "}
          <Typography variant="body2" color="text.secondary">
            Annual Allotment
          </Typography>
          <Typography
            variant="body2"
            color="text.primary"
            sx={{ textAlign: "right" }}
          >
            {annualAllotment}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveCard;
