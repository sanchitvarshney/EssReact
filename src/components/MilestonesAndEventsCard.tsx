import React, { memo } from "react";
import {
  // CardContent,
  Typography,
  Avatar,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import EmptyData from "./reuseable/EmptyData";

interface MilestonesAndEventsCardProps {
  title: string;
  data: any;
  expanded: boolean;
  onChange: () => void;
}
const MilestonesAndEventsCard: React.FC<MilestonesAndEventsCardProps> = ({
  title,
  data,
  expanded,
  onChange,
}) => {
  return (
    <div className="w-full shadow-sm  ">
      <Accordion
        expanded={expanded}
        onChange={onChange}
        sx={{
          boxShadow: 2,
          borderRadius: 10,
          backgroundColor: "#ffffff",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
        >
          <Typography variant="subtitle1" fontWeight="bold">
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className="w-full">
            {data?.length === 0 || !data ? (
              <div className="w-full h-[30vh] flex  items-center justify-center">
                <EmptyData width="w-[160px]" />
              
              </div>
            ) : (
              data?.map((milestone: any,index:any) => (
                <div key={milestone.time || index}>
                  <Box display="flex" alignItems="center" mb={3}>
                    <Avatar
                      src={
                        milestone.photo &&
                        !milestone.photo.includes("undefined")
                          ? milestone.photo
                          : null
                      }
                      sx={{
                        width: 45,
                        height: 45,
                        backgroundColor: "#2eacb3",
                        pointerEvents: "none",
                        userSelect: "none",
                      }}
                    >
                      {milestone?.name?.charAt(0)}
                    </Avatar>
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
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default memo(MilestonesAndEventsCard) ;
