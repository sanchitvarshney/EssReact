import { Card, Typography } from "@mui/material";
import type { FC } from "react";

type HolidayCardProps = {
  title: string;
  image: string;
  value: number | string;
};

const HolidayCard: FC<HolidayCardProps> = ({ title, image, value }) => {
  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: 0,
        // boxShadow: "",
        display: "flex",

        justifyContent: "space-between",
        // alignItems: "center",
        backgroundColor: "transparent",
        padding: 1,
        paddingRight: 2,
        paddingLeft: 2,
      }}
    >
      <div className="flex">
        {/* <CardContent sx={{ p: 0}}> */}
        <div className="flex rounded-md mr-2">
          <img
            src={image}
            alt={title}
            className="h-[30px] w-full object-contain"
          />
        </div>

        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 400,

            textAlign: "center",
            fontSize: { xs: "0.9rem", sm: "1rem" },
          }}
        >
          {title}
        </Typography>
      </div>
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 600,

          textAlign: "right",
          fontSize: { xs: "0.9rem", sm: "1rem" },
        }}
      >
        {value}
      </Typography>
      {/* </CardContent> */}
    </Card>
  );
};

export default HolidayCard;
