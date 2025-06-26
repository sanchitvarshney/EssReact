import { Tab, Tabs } from "@mui/material";
import ViewStatusTicketPage from "./ViewStatusTicketPage";
import { useState } from "react";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import PlaylistAddCheckCircleIcon from "@mui/icons-material/PlaylistAddCheckCircle";

import CreateTicketPage from "./CreateTicketPage";
import SupportPage from "./SupportPage";

const HelpPortal = () => {
  const [value, setValue] = useState("support");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    console.log(event);
  };

  const renderElement =
    value === "support" ? (
      <SupportPage />
    ) : value === "new" ? (
      <CreateTicketPage />
    ) : (
      <ViewStatusTicketPage />
    );

  return (
    <div className="w-full">
      <div>
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{
            style: {
              backgroundColor: "#2eacb3",
            },
          }}
          textColor="inherit"
          sx={{
            "& .MuiTab-root": {
              color: "#000",
            },
            "& .Mui-selected": {
              color: "#2eacb3",
            },
          }}
        >
          <Tab
            value="support"
            label="Support"
            //@ts-ignore
            icon={<SupportAgentIcon />}
            // children={}
            sx={{ fontSize: 15, fontWeight: "bold", color: "#000" }}
          />

          <Tab
            icon={<NoteAddIcon />}
            value="new"
            label="New Ticket"
            sx={{ fontSize: 15, fontWeight: "bold", color: "#000" }}
          />
          <Tab
            icon={<PlaylistAddCheckCircleIcon />}
            value="status"
            label="Ticket Status"
            sx={{ fontSize: 15, fontWeight: "bold", color: "#000" }}
          />
        </Tabs>
      </div>
      {renderElement}
    </div>
  );
};

export default HelpPortal;
