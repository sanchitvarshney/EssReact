import { useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Avatar,
  IconButton,
  Card,
} from "@mui/material";

import { StyledTableCell, StyledTableRow } from "./LeaveStatusPage";

import VisibilityIcon from "@mui/icons-material/Visibility";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";

import CloseIcon from "@mui/icons-material/Close";

import CustomToolTip from "../components/reuseable/CustomToolTip";
import { FaCommentAlt } from "react-icons/fa";
import { CustomButton } from "../components/ui/CustomButton";

interface Task {
  id: number;
  empName: string;
  title: string;
  description: string;
  comments: string[];
  status?: "pending" | "in-progress" | "completed";
  priority?: "low" | "medium" | "high";
  dueDate?: string;
}

const initialTasks: Task[] = [
  {
    id: 1,
    empName: "John Doe",
    title: "Complete Onboarding Documentation",
    description:
      "Submit your PAN card, Aadhar card, and bank details to HR department for processing.",
    comments: [
      "Please ensure all documents are properly scanned",
      "Documents received, processing in progress",
    ],
    status: "in-progress",
    priority: "high",
    dueDate: "2024-01-15",
  },
  {
    id: 2,
    empName: "Jane Smith",
    title: "Attend New Employee Orientation",
    description:
      "Join the scheduled Zoom call at 10 AM for company policies and procedures overview.",
    comments: ["Meeting link sent via email", "Session completed successfully"],
    status: "completed",
    priority: "medium",
    dueDate: "2024-01-10",
  },
  {
    id: 3,
    empName: "Mike Johnson",
    title: "Setup Development Environment",
    description:
      "Install required software and configure development tools as per company standards.",
    comments: [],
    status: "pending",
    priority: "high",
    dueDate: "2024-01-20",
  },
  {
    id: 1,
    empName: "John Doe",
    title: "Complete Onboarding Documentation",
    description:
      "Submit your PAN card, Aadhar card, and bank details to HR department for processing.",
    comments: [
      "Please ensure all documents are properly scanned",
      "Documents received, processing in progress",
    ],
    status: "in-progress",
    priority: "high",
    dueDate: "2024-01-15",
  },
  {
    id: 2,
    empName: "Jane Smith",
    title: "Attend New Employee Orientation",
    description:
      "Join the scheduled Zoom call at 10 AM for company policies and procedures overview.",
    comments: ["Meeting link sent via email", "Session completed successfully"],
    status: "completed",
    priority: "medium",
    dueDate: "2024-01-10",
  },
  {
    id: 3,
    empName: "Mike Johnson",
    title: "Setup Development Environment",
    description:
      "Install required software and configure development tools as per company standards.",
    comments: [],
    status: "pending",
    priority: "high",
    dueDate: "2024-01-20",
  },
  {
    id: 1,
    empName: "John Doe",
    title: "Complete Onboarding Documentation",
    description:
      "Submit your PAN card, Aadhar card, and bank details to HR department for processing.",
    comments: [
      "Please ensure all documents are properly scanned",
      "Documents received, processing in progress",
    ],
    status: "in-progress",
    priority: "high",
    dueDate: "2024-01-15",
  },
  {
    id: 2,
    empName: "Jane Smith",
    title: "Attend New Employee Orientation",
    description:
      "Join the scheduled Zoom call at 10 AM for company policies and procedures overview.",
    comments: ["Meeting link sent via email", "Session completed successfully"],
    status: "completed",
    priority: "medium",
    dueDate: "2024-01-10",
  },
  {
    id: 3,
    empName: "Mike Johnson",
    title: "Setup Development Environment",
    description:
      "Install required software and configure development tools as per company standards.",
    comments: [],
    status: "pending",
    priority: "high",
    dueDate: "2024-01-20",
  },
  {
    id: 1,
    empName: "John Doe",
    title: "Complete Onboarding Documentation",
    description:
      "Submit your PAN card, Aadhar card, and bank details to HR department for processing.",
    comments: [
      "Please ensure all documents are properly scanned",
      "Documents received, processing in progress",
    ],
    status: "in-progress",
    priority: "high",
    dueDate: "2024-01-15",
  },
  {
    id: 2,
    empName: "Jane Smith",
    title: "Attend New Employee Orientation",
    description:
      "Join the scheduled Zoom call at 10 AM for company policies and procedures overview.",
    comments: ["Meeting link sent via email", "Session completed successfully"],
    status: "completed",
    priority: "medium",
    dueDate: "2024-01-10",
  },
  {
    id: 3,
    empName: "Mike Johnson",
    title: "Setup Development Environment",
    description:
      "Install required software and configure development tools as per company standards.",
    comments: [],
    status: "pending",
    priority: "high",
    dueDate: "2024-01-20",
  },
  {
    id: 1,
    empName: "John Doe",
    title: "Complete Onboarding Documentation",
    description:
      "Submit your PAN card, Aadhar card, and bank details to HR department for processing.",
    comments: [
      "Please ensure all documents are properly scanned",
      "Documents received, processing in progress",
    ],
    status: "in-progress",
    priority: "high",
    dueDate: "2024-01-15",
  },
  {
    id: 2,
    empName: "Jane Smith",
    title: "Attend New Employee Orientation",
    description:
      "Join the scheduled Zoom call at 10 AM for company policies and procedures overview.",
    comments: ["Meeting link sent via email", "Session completed successfully"],
    status: "completed",
    priority: "medium",
    dueDate: "2024-01-10",
  },
  {
    id: 3,
    empName: "Mike Johnson",
    title: "Setup Development Environment",
    description:
      "Install required software and configure development tools as per company standards.",
    comments: [],
    status: "pending",
    priority: "high",
    dueDate: "2024-01-20",
  },
  {
    id: 1,
    empName: "John Doe",
    title: "Complete Onboarding Documentation",
    description:
      "Submit your PAN card, Aadhar card, and bank details to HR department for processing.",
    comments: [
      "Please ensure all documents are properly scanned",
      "Documents received, processing in progress",
    ],
    status: "in-progress",
    priority: "high",
    dueDate: "2024-01-15",
  },
  {
    id: 2,
    empName: "Jane Smith",
    title: "Attend New Employee Orientation",
    description:
      "Join the scheduled Zoom call at 10 AM for company policies and procedures overview.",
    comments: ["Meeting link sent via email", "Session completed successfully"],
    status: "completed",
    priority: "medium",
    dueDate: "2024-01-10",
  },
  {
    id: 3,
    empName: "Mike Johnson",
    title: "Setup Development Environment",
    description:
      "Install required software and configure development tools as per company standards.",
    comments: [],
    status: "pending",
    priority: "high",
    dueDate: "2024-01-20",
  },
];

const TaskPage = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [commentText, setCommentText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedTask(null);
    setCommentText("");
  };

  const handleAddComment = () => {
    if (!selectedTask || commentText.trim() === "") return;

    const updatedTasks = tasks.map((task) =>
      task.id === selectedTask.id
        ? { ...task, comments: [...task.comments, commentText] }
        : task
    );

    setTasks(updatedTasks);
    setSelectedTask({
      ...selectedTask,
      comments: [...selectedTask.comments, commentText],
    });
    setCommentText("");
  };

  return (
    <Box
      sx={{
        width: "100%",
        p: 2,
        backgroundColor: "#fff",
        minHeight: "87vh",
      }}
    >
      <Box sx={{ mb: 1 }}>
        <div
        className="flex justify-between items-center"
        >
          <div className="flex items-center gap-2 mb-2">
            <AssignmentIcon sx={{ fontSize: 32, color: "#2eacb3" }} />
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, fontSize: 22, color: "#1f2937" }}
            >
              Task
            </Typography>
          </div>
     
            {/* <CustomButton className="bg-[#000] hover:bg-gray-800 text-md text-white font-bold cursor-pointer">+ Add</CustomButton> */}
     
        </div>
      </Box>

      <Card
        sx={{ borderRadius: 3, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
      >
        <TableContainer sx={{ maxHeight: "75vh", overflow: "auto" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f9fafb" }}>
                <StyledTableCell sx={{ fontWeight: 600, color: "#374151" }}>
                  Employee
                </StyledTableCell>
                <StyledTableCell sx={{ fontWeight: 600, color: "#374151" }}>
                  Task Details
                </StyledTableCell>
                <StyledTableCell sx={{ fontWeight: 600, color: "#374151" }}>
                  Due Date
                </StyledTableCell>
                <StyledTableCell sx={{ fontWeight: 600, color: "#374151" }}>
                  Actions
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Box sx={{ textAlign: "center" }}>
                      <AssignmentIcon
                        sx={{ fontSize: 48, color: "#9ca3af", mb: 2 }}
                      />
                      <Typography variant="h6" sx={{ color: "#6b7280", mb: 1 }}>
                        No tasks available
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                        Tasks will appear here once assigned
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((row: Task) => (
                  <StyledTableRow
                    key={row.id}
                    sx={{ "&:hover": { backgroundColor: "#f9fafb" } }}
                  >
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          sx={{ bgcolor: "#2eacb3", width: 40, height: 40 }}
                        >
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography
                            sx={{ fontWeight: 600, color: "#1f2937" }}
                          >
                            {row.empName}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#6b7280" }}>
                            Employee
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography
                          sx={{ fontWeight: 600, color: "#1f2937", mb: 1 }}
                        >
                          {row.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#6b7280", lineHeight: 1.4 }}
                        >
                          {row.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: "#6b7280" }}>
                        {row.dueDate
                          ? new Date(row.dueDate).toLocaleDateString()
                          : "Not set"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <CustomToolTip title="View Details" placement="bottom">
                        <IconButton
                          onClick={() => handleViewTask(row)}
                          sx={{
                            backgroundColor: "#f3f4f6",
                            color: "#6b7280",
                            "&:hover": {
                              backgroundColor: "#2eacb3",
                              color: "white",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </CustomToolTip>
                    </TableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Task Details Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <AssignmentIcon sx={{ color: "#2eacb3" }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Task Details
            </Typography>
          </Box>
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <div className="py-3">
            {selectedTask && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="col-span-12 flex items-center gap-4">
                  <Avatar sx={{ bgcolor: "#2eacb3", width: 40, height: 40 }}>
                    <PersonIcon />
                  </Avatar>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {selectedTask.empName}
                    </h2>
                    <p className="text-sm text-gray-500">Assigned Employee</p>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {selectedTask.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedTask.description}
                  </p>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h4 className="text-sm font-semibold mb-3 text-gray-700">
                      Task Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500">Due Date</p>
                        <p className="text-sm font-medium text-gray-700">
                          {selectedTask.dueDate
                            ? new Date(
                                selectedTask.dueDate
                              ).toLocaleDateString()
                            : "Not set"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-12 border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FaCommentAlt className="text-gray-500" />
                    <h4 className="text-lg font-semibold text-gray-800">
                      Comments ({selectedTask.comments.length})
                    </h4>
                  </div>

                  {selectedTask.comments.length > 0 ? (
                    <ul className="space-y-2 bg-gray-50 p-4 rounded-lg">
                      {selectedTask.comments.map((comment, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-700 font-medium"
                        >
                          {comment}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-2">
                      <FaCommentAlt className="mx-auto text-4xl text-[#2eacb3] mb-2 " />
                      <p className="text-sm text-gray-500">
                        No comments yet. Be the first to add one!
                      </p>
                    </div>
                  )}
                </div>

                {/* Comment Input */}
                <div className="col-span-12">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Add a comment
                  </label>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Type your comment here..."
                  />
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <CustomButton
                onClick={handleCloseDialog}
                className="bg-gray-400 hover:bg-gray-400/80  text-white cursor-pointer"
              >
                {" "}
                Close
              </CustomButton>
              <CustomButton
                onClick={handleAddComment}
                className="bg-[#2eacb3] text-white hover:bg-[#2eacb3]/80 cursor-pointer"
              >
                {" "}
                Comment
              </CustomButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TaskPage;
