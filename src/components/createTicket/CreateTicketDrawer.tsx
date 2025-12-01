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
  Stack,
  FormControl,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Create, ErrorOutline } from "@mui/icons-material";
import axios from "axios";

interface CreateTicketDrawerProps {
  open: boolean;
  close: () => void;
}
const CreateTicketDrawer: React.FC<CreateTicketDrawerProps> = ({
  open,
  close,
}) => {
  const [formData, setFormData] = useState<any>({
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
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({ general: null });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name as keyof FormData]) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: undefined,
        general: prev.general,
      }));
    }
  };

  const fetchSelecetdFieldData = async () => {
    setIsFetching(true);
    try {
      const res: any = await axios.get(
        "/api/support/custom/masters?filter=ess"
      );

      setSelectedOption({
        topic: res.data.data.topics,
        priority: res.data.data.priorities,
        language: res.data.data.languages,
      });
      setIsFetching(false);
    } catch (error: any) {
      setIsFetching(false);
      setErrors({ general: "Failed to fetch selected field data" });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    if (!formData.topic) {
      newErrors.topic = "Please select a topic";
    }
    if (!formData.priority) {
      newErrors.priority = "Please select a priority";
    }
    if (!formData.language) {
      newErrors.language = "Please select a language";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors({ ...newErrors, general: null });
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (open) {
      fetchSelecetdFieldData();
      setFormData({
        subject: "",
        topic: "",
        priority: "",
        language: "",
        message: "",
      });
      setErrors({ general: null });
    }
  }, [open]);

  const handleCloseErrorDialog = () => {
    setErrors((prev: any) => ({
      ...prev,
      general: null,
    }));
  };

  const handleCreateTicket = async () => {
    setIsLoading(true);
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }
    try {
      const userData = JSON.parse(localStorage.getItem("user") as any);
      console.log(userData);

      if (!userData.userName || !userData.officeMail || !userData.officePhone) {
        setErrors({
          general:
            "Just so you know, you are not authorized for action for now. Please contact HR and request for update an email and mobile number first.",
        });
        setIsLoading(false);
        return;
      }
      const payload = {
        name: userData.userName,
        email: userData.officeMail,
        phone: userData.officePhone ,
        subject: formData.subject,
        message: formData.message,
        topic: parseInt(formData.topic),
        priority: parseInt(formData.priority),
        language: formData.language,
      };
      console.log(payload, "payload");
      
      const response = await axios.post("https://support.mscorpres.com/api/custom/create", {
        method: "POST",

        payload,
        headers: {
          "X-API-Key": "79EAE3054AA3967A44537E2B8E6C7D69",
          "content-type": "application/json",
        },
      });
      console.log(response, "res");
      setIsLoading(false);
      if (response?.data) {
      }

      // Success - could add success message here if needed
      setErrors({ general: null });
    } catch (error: any) {
     console.error(error.message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
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
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",

          backgroundColor: "#04b0a8",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          sx={{
            flex: 1,
            fontSize: 22,
            fontWeight: 600,
            color: "#fff",
            letterSpacing: 0.5,
          }}
          variant="subtitle1"
          component="div"
        >
          Create Ticket
        </Typography>

        <IconButton
          onClick={close}
          sx={{
            color: "#fff",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <CloseIcon />
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
            <Stack spacing={2} alignItems="center">
              <CircularProgress sx={{ color: "#04b0a8" }} size={40} />
              <Typography variant="body2" color="text.secondary">
                Please wait while we fetch form options...
              </Typography>
            </Stack>
          </div>
        ) : (
          <Box sx={{ p: 3 }}>
            <Stack spacing={3}>
              <FormControl fullWidth error={!!errors.subject}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1,
                    fontWeight: 500,
                    color: "text.primary",
                  }}
                >
                  Subject <span style={{ color: "#d32f2f" }}>*</span>
                </Typography>
                <TextField
                  value={formData.subject}
                  name="subject"
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  placeholder="Enter ticket subject"
                  error={!!errors.subject}
                  helperText={errors.subject}
                />
              </FormControl>

              <FormControl fullWidth error={!!errors.topic}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1,
                    fontWeight: 500,
                    color: "text.primary",
                  }}
                >
                  Topic <span style={{ color: "#d32f2f" }}>*</span>
                </Typography>
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
                {errors.topic && (
                  <FormHelperText>{errors.topic}</FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth error={!!errors.language}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1,
                    fontWeight: 500,
                    color: "text.primary",
                  }}
                >
                  Language <span style={{ color: "#d32f2f" }}>*</span>
                </Typography>
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
                {errors.language && (
                  <FormHelperText>{errors.language}</FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth error={!!errors.priority}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1,
                    fontWeight: 500,
                    color: "text.primary",
                  }}
                >
                  Priority <span style={{ color: "#d32f2f" }}>*</span>
                </Typography>
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
                {errors.priority && (
                  <FormHelperText>{errors.priority}</FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth error={!!errors.message}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 500,
                    color: "text.primary",
                  }}
                >
                  Message <span style={{ color: "#d32f2f" }}>*</span>
                </Typography>
                <TextField
                  value={formData.message}
                  name="message"
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={5}
                  variant="outlined"
                  placeholder="Describe your issue or question in detail..."
                  error={!!errors.message}
                  helperText={errors.message}
                />
              </FormControl>
            </Stack>
          </Box>
        )}
      </div>
      <Divider />
      <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button
          onClick={handleCreateTicket}
          sx={{ backgroundColor: "#04b0a8", color: "#fff", px: 4, py: 1 }}
          startIcon={
            isLoading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <Create sx={{ mr: 1 }} fontSize="small" />
            )
          }
        >
          Create
        </Button>
      </Box>

      {/* Error Dialog */}
      <Dialog
        open={!!errors?.general}
        onClose={handleCloseErrorDialog}
        maxWidth="sm"
        fullWidth
        sx={{
          zIndex: 10001,
          "& .MuiBackdrop-root": {
            zIndex: 10000,
          },
        }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
            zIndex: 10001,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            backgroundColor: "#fee",
            color: "#d32f2f",
            fontWeight: 600,
            fontSize: "1.25rem",
            pb: 2,
          }}
        >
          <ErrorOutline sx={{ fontSize: 28, color: "#d32f2f" }} />
          Error
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Typography
            variant="body1"
            sx={{
              color: "text.primary",
              lineHeight: 1.6,
              fontSize: "0.95rem",
            }}
          >
            {errors?.general}
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            px: 3,
            pb: 2.5,
            pt: 1,
          }}
        >
          <Button
            onClick={handleCloseErrorDialog}
            variant="contained"
            sx={{
              backgroundColor: "#d32f2f",
              color: "#fff",
              px: 3,
              py: 0.75,
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                backgroundColor: "#b71c1c",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
};

export default CreateTicketDrawer;
