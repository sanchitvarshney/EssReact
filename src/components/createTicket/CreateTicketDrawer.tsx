import {
  Box,
  Drawer,
  IconButton,
  Typography,
  TextField,
  Select,
  MenuItem,

  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Create } from "@mui/icons-material";
import axios from "axios";

interface CreateTicketDrawerProps {
  open: boolean;
  close: () => void;
}
const CreateTicketDrawer: React.FC<CreateTicketDrawerProps> = ({
  open,
  close,
}) => {
  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    priority: "",
    language: "",
    message: "",
  });
  const [selectedOption, setSelectedOption] = useState({
    topic: [],
    priority: [],
    language: [],
  });
  const [isFetching, setIsFetching] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const fetchSelecetdFieldData = async () => {
    setIsFetching(true);
    try {
      const res: any = await axios.get(
        "https://support.mscorpres.com/api/custom/masters?filter=Oakter", 
        
      );

      setSelectedOption({
        topic: res.data.data.topics,
        priority: res.data.data.priorities,
        language: res.data.data.languages,
      });
      setIsFetching(false);
    } catch (error) {
      setIsFetching(false);
      console.error("Failed to fetch selected field data:", error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchSelecetdFieldData();
    }
  }, [open]);

  const handleCreateTicket = async () => {
    // setError(null);
    // setSuccess(null);
    // // Validation
    // if (!formData.name || !formData.email || !formData.subject || !formData.message) {
    //   setError("Please fill in all required fields (Name, Email, Subject, Message)");
    //   return;
    // }
    // if (!formData.topicId || !formData.priority || !formData.language) {
    //   setError("Please select Topic, Priority, and Language");
    //   return;
    // }
    // setIsLoading(true);
    // try {
    //   const payload = {
    //     name: formData.name,
    //     email: formData.email,
    //     phone: formData.phone || "1234567890",
    //     subject: formData.subject,
    //     message: formData.message,
    //     topicId: parseInt(formData.topicId),
    //     priority: parseInt(formData.priority),
    //     language: formData.language,
    //   };
    //   const response = await fetch("https://support.mscorpres.com/api/custom/create", {
    //     method: "POST",
    //     headers: {
    //       "X-API-Key": "79EAE3054AA3967A44537E2B8E6C7D69",
    //       "content-type": "application/json",
    //     },
    //     body: JSON.stringify(payload),
    //   });
    //   const data = await response.json();
    //   if (!response.ok) {
    //     throw new Error(data.message || "Failed to create ticket");
    //   }
    //   setSuccess("Ticket created successfully!");
    //   console.log(formData, "data");
    //   console.log("API Response:", data);
    //   // Reset form after successful submission
    //   setTimeout(() => {
    //     handleReset();
    //   }, 2000);
    // } catch (error: any) {
    //   console.error("Error creating ticket:", error);
    //   setError(error.message || "An error occurred while creating the ticket");
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <Drawer
      anchor={"right"}
      open={open}
      onClose={(event, reason) => {
        console.log(event);
        if (reason === "escapeKeyDown") {
          close();
          return;
        }
        if (reason === "backdropClick") {
          return;
        }
      }}
      ModalProps={{
        disableEscapeKeyDown: false,
        keepMounted: true,
        BackdropProps: {
          style: {
            backgroundColor: "rgb(255 255 255 / 50%)",
            cursor: "default",
            pointerEvents: "none",
          },
        },
      }}
      // hideBackdrop
      sx={{
        zIndex: 9999,
        "& .MuiDrawer-paper": {
          width: { xs: 250, sm: 500 },
          position: "absolute",
          top: 0,
          backgroundColor: "#f9fafb",
          zIndex: 9999,
          pointerEvents: "auto",
          overflow: "hidden",
        },
        "& .MuiBackdrop-root": {
          zIndex: 9998,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 2,
          py: 3,
          borderBottom: "1px solid #ccc",
          pointerEvents: "auto",
          backgroundColor: "#04b0a8",
        }}
      >
        <Typography
          sx={{ flex: 1, fontSize: 20, fontWeight: "bold", color: "#fff" }}
          variant="subtitle1"
          component="div"
        >
          Create Ticket
        </Typography>

        <IconButton onClick={close}>
          <CloseIcon sx={{ color: "#fff" }} />
        </IconButton>
      </Box>

      <div
        className="w-full  h-[calc(100vh-0px)] overflow-y-auto custom-scrollbar"
        style={{
          pointerEvents: "auto",
        }}
      >
        {isFetching ? (
          <div className="flex justify-center items-center h-[calc(100vh-180px)] overflow-hidden">
            <CircularProgress sx={{ color: "#04b0a8" }} />
          </div>
        ) : (
          <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <div className="flex flex-col gap-1">
              <Typography variant="subtitle2">Subject</Typography>
              <TextField
                value={formData.subject}
                name="subject"
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Typography variant="subtitle2">Topic</Typography>
              <Select
                value={formData.topic}
                onChange={(e: any) => handleInputChange(e)}
                name="topic"
                MenuProps={{
                  PaperProps: {
                    sx: {
                      zIndex: 10000,
                    },
                  },
                  style: {
                    zIndex: 10000,
                  },
                }}
              >
                {selectedOption?.topic.length > 0 ? (
                  selectedOption?.topic?.map((item: any) => (
                    <MenuItem value={item?.value}>{item?.text}</MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No Topics Found</MenuItem>
                )}
              </Select>
            </div>


    <div className="flex flex-col gap-1">
              <Typography variant="subtitle2">Priority</Typography>
                 <Select
                value={formData.priority}
                onChange={(e: any) => handleInputChange(e)}
     
                name="priority"
                MenuProps={{
                  PaperProps: {
                    sx: {
                      zIndex: 10000,
                    },
                  },
                  style: {
                    zIndex: 10000,
                  },
                }}
              >
                {selectedOption?.priority.length > 0 ? (
                  selectedOption?.priority?.map((item: any) => (
                    <MenuItem value={item?.value}>{item?.text}</MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No Priority Found</MenuItem>
                )}
              </Select>
            </div>
  
      <div className="flex flex-col gap-1">
              <Typography variant="subtitle2">Language</Typography>
              <Select
                value={formData.language}
                onChange={(e: any) => handleInputChange(e)}
                name="language"
          
                MenuProps={{
                  PaperProps: {
                    sx: {
                      zIndex: 10000,
                    },
                  },
                  style: {
                    zIndex: 10000,
                  },
                }}
              >
                {selectedOption?.language.length > 0 ? (
                  selectedOption?.language?.map((item: any) => (
                    <MenuItem value={item?.value}>{item?.text}</MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No Language Found</MenuItem>
                )}
              </Select>
            </div>

    
    <div className="flex flex-col gap-1">
              <Typography variant="subtitle2">Message</Typography>
                <TextField
            
              value={formData.message}
              name="message"
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
            />
            </div>
         
          </Box>
        )}
      </div>
      <Divider />
      <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button
          onClick={handleCreateTicket}
          sx={{ backgroundColor: "#04b0a8", color: "#fff", px: 4, py: 1 }}
        >
          <Create sx={{ mr: 1 }} fontSize="small" /> Create
        </Button>
      </Box>
    </Drawer>
  );
};

export default CreateTicketDrawer;
