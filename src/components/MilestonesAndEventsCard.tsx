import React, { useEffect } from "react";
import {
  Card,
  // CardContent,
  Typography,
  Avatar,
  Box,
  IconButton,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { useState } from "react";
import CustomToolTip from "./reuseable/CustomToolTip";

interface MilestonesAndEventsCardProps {
  title: string;
  data: any;
  titleModal: string;
}
const MilestonesAndEventsCard: React.FC<MilestonesAndEventsCardProps> = ({
  title,
  data,
}) => {
  const [isViewAll, setIsViewAll] = useState(false);
  const [displayedData, setDisplayedData] = useState([]);

  useEffect(() => {
    const arrData = data?.slice(0, `${isViewAll ? data?.length : 4}`);
    setDisplayedData(arrData);
  }, [data, isViewAll]);

  return (
    <Card
      elevation={2}
      sx={{
        maxWidth: 350,
        // maxHeight: 410,
        // flex:1,
        p: 2,
        borderRadius: 3,
        backgroundColor: "#ffffff",
      }}
      className="w-full"
    >
      <Typography variant="subtitle1" fontWeight="bold">
        {title}
      </Typography>

      {/* <CardContent sx={{ px: 0 }}> */}
      <div className="w-full ">
        <div className="w-full">
          {/* @ts-ignore */}
          {displayedData?.length === 0 ? (
            <Typography variant="body2">No data found</Typography>
          ) : (
            displayedData?.map((milestone: any) => (
              <div key={milestone.time}>
                <Box display="flex" alignItems="center" mt={3}>
                  <Avatar
                    src={milestone.photo}
                    sx={{ width: 45, height: 45, backgroundColor: "#2eacb3",           pointerEvents: "none",
                      userSelect: "none", }}
                  />
                  <Box ml={1} width={"100%"}>
                    <Typography variant="body2" fontWeight={500}>
                      {milestone.name}
                    </Typography>
                    <div className="w-full flex justify-between items-center">
                        <Typography variant="caption" color="text.secondary">
                      {`${milestone.department}`}
                    </Typography>
                      <Typography variant="caption" color="text.secondary">
                      {`${milestone.date}`}
                    </Typography>
                    </div>
                  </Box>
                </Box>
              </div>
            ))
          )}

        {data?.length > 4 && (
            <div className="flex justify-center items-center mt-3">
            <CustomToolTip
              title={isViewAll ? "View Less" : "View All"}
              placement={"bottom"}
            >
              <IconButton
                onClick={() => setIsViewAll(!isViewAll)}
                sx={{
                  transition: "transform 0.3s",
                  transform: isViewAll ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <KeyboardArrowDownIcon sx={{ color: "#2eacb3" }} />
              </IconButton>
            </CustomToolTip>
          </div>
        )}
        </div>
      </div>
    </Card>
  );
};

export default MilestonesAndEventsCard;
