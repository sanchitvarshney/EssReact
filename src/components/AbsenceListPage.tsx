import React from "react";
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

interface AbsenceListPageProps {
  title: string;
  data: any;
  expanded: boolean;
  onChange: () => void;
}
const AbsenceListPage: React.FC<AbsenceListPageProps> = ({
  title,
  data,
  expanded,
  onChange,
}) => {
  console.log(data);

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
              data?.map((employee: any, index: number) => (
                <div key={index}>
                  <Box display="flex" mb={3}>
                    <Avatar
                      src={
                        employee.emp_photo &&
                        !employee.emp_photo.includes("undefined")
                          ? employee.emp_photo
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
                      {" "}
                      {employee?.emp_name?.charAt(0)}
                    </Avatar>
                    <Box ml={1} width={"100%"}>
                      <Typography variant="body2" fontWeight={500}>
                        {employee.emp_name}
                      </Typography>

                      <div className="w-full flex justify-between items-center">
                        <Typography variant="caption" color="text.secondary">
                          {employee.leave_type}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {employee.date_from}
                        </Typography>
                      </div>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block" }}
                      >
                        {employee.will_return}
                      </Typography>
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

export default AbsenceListPage;
