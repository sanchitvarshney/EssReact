import { useState } from "react";
import DocView from "../components/reuseable/DocView";
import LeaveGrantCard from "../components/reuseable/LeaveGrantCard";
import { Divider, Typography } from "@mui/material";

const LeaveGrantPage = () => {
  const [view, setView] = useState(false);
  return (
    <div>
      <LeaveGrantCard open={() => setView(true)} maxWidth={600} isView={false} />
      <DocView
        open={view}
        close={() => setView(false)}
       
        vertical={"bottom"}
        horizontal={"center"}
        transformOrigin={"bottom"}
      >
        <LeaveGrantCard maxWidth={"100%"}  isView={true} />
        <Divider />
         <Typography
                variant="subtitle2"
                sx={{
                    textAlign:"center",
                  fontSize: { xs: "1rem", sm: "1.1rem" },
            fontWeight:600
                }}
              >
                Reason: <span className="font-[300]">Important Work</span>
              </Typography>
      </DocView>
    </div>
  );
};

export default LeaveGrantPage;
