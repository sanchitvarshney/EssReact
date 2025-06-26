import {
  Avatar,
  Card,
  CardContent,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Paper,
} from "@mui/material";
import type { ReactNode } from "react";

interface PerformanceCardProps {
  title: string;
  svg: any;
  des?: string;
  width: string;
  hight: string;
  children?:ReactNode
}

const PerformanceCard = ({
  title,
  width,
  svg,
  des,
  hight,
  children,
}: PerformanceCardProps) => {
  return (
    <Card
      elevation={2}
      sx={{
        maxWidth: { width },
        borderRadius: 0,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        background: "#ffffff",
        border: "1px solid #f0f0f0",
      }}
    >
      <CardContent>
        <ListItem className="hover:bg-gray-50 flex  justify-start items-start  transition-colors rounded-lg relative">
          <ListItemAvatar>
            <Avatar
              variant="square"
              className="text-white font-semibold"
              sx={{
                backgroundColor: "rgba(62, 155, 186, 0.2)",
                width: 60,
                height: 60,
                padding: 1,
                borderRadius: 1,
              }}
            >
              <img
                src={svg}
                alt="avatar"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography
                sx={{ ml: 1, fontSize: 18, fontWeight: "bold" }}
                variant="subtitle1"
              >
                {title}
              </Typography>
            }
            secondary={
              <Typography sx={{ ml: 1, fontSize: 15 }} variant="subtitle2">
                {des}
              </Typography>
            }
          />
        </ListItem>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 1,
            overflow: "hidden",
            // backgroundImage:
            //   "linear-gradient(to right,rgb(66, 138, 153),rgb(92, 178, 199))",
          }}
        >
          <div
            className="flex justify-start my-4  "
            style={{
              width: "100%",
              height: hight,
            }}
          >{children}</div>
        </Paper>
      </CardContent>
    </Card>
  );
};

export default PerformanceCard;
