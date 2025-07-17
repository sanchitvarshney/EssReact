import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CustomSearch from "../components/reuseable/CustomSearch";
import { getStatus, StyledTableCell, StyledTableRow } from "./LeaveStatusPage";

import ConfirmationModal from "../components/reuseable/ConfirmationModal";
import ClearIcon from "@mui/icons-material/Clear";
import {
  useCancelReimbursementMutation,
  useStatusReimbursementMutation,
} from "../services/reimbursement";
import { useToast } from "../hooks/useToast";
import EmptyData from "../components/reuseable/EmptyData";
import DocView from "../components/reuseable/DocView";

import ReimbursementStatusPageSkeleton from "../skeleton/ReimbursementStatusPageSkeleton";
import { customColor } from "../constants/themeConstant";

const ReimbursementStatusPage = () => {
  const { showToast } = useToast();
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [trackId, setTrackId] = useState<string>("");

  const [statusReimbursement, { isLoading, data }] =
    useStatusReimbursementMutation();
  const [cancelReimbursement, { isLoading: cancelLoading, isSuccess }] =
    useCancelReimbursementMutation();

  const [isDocViewOpen, setIsDocViewOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  const [filteredData, setFilteredData] = useState([]);

  const handleCancel = () => {
    setIsConfirm(false);
    if (!trackId) {
      showToast("Please select a reimbursement", "error");
      return;
    }
    console.log(trackId);
    cancelReimbursement({ trxn: trackId })
      .then((res) => {
        console.log(res);
        if (res?.data?.status === "error") {
          showToast(res?.data?.message, "error");
        }
        showToast(res?.data?.message, "success");
      })
      .catch((err) => {
        showToast(err || err?.message || "Something went wrong", "error");
      });
  };

  useEffect(() => {
    statusReimbursement()
      .then((res) => {
        if (res?.data?.status === "error") {
          const len = res?.data?.message.length 
          let msg
       if (len>20) {
        msg = "Data Not Found"
       } else {
        msg = res?.data?.message
       }
          showToast(msg, "error");
        }
      })
      .catch((err) => {
        console.log(err.message);
        showToast(
          err?.data?.message || err?.message || "Something went wrong",
          "error"
        );
      });
  }, [isSuccess]);

  useEffect(() => {
    if (data?.data) {
      setFilteredData(data.data);
    }
  }, [data]);

  const filterData = (searchQuary: string) => {
    if (!searchQuary.trim()) {
      setFilteredData(data?.data || []);
      return;
    }

    const filtered = data?.data?.filter(
      (item: any) =>
        item.purpose.toLowerCase().includes(searchQuary.toLowerCase()) ||
        item.reportto.toLowerCase().includes(searchQuary.toLowerCase())
    );
    setFilteredData(filtered || []);
  };
  if (isLoading) {
    return <ReimbursementStatusPageSkeleton />;
  }
  return (
    <div className="w-full h-[calc(100vh-90px)] bg-gradient-to-br from-[#f0f7fa] to-[#e0f2f1] p-4 will-change-transform overflow-y-auto">
      <div className="  mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex  items-center ">
            <Typography sx={{ fontWeight: 600, fontSize: 18 }}>
              {`Reimbursement Status (${ !(data?.totalrequest) ? 0 : data?.totalrequest})`}
            </Typography>
          </div>

          <CustomSearch
            width={"40ch"}
            placeholder={"Search......"}
            onChange={(e) => filterData(e.target.value)}
            bgColor="#8a8a8a"
            textColor="#000"
          />
        </div>

        {data?.data?.length === 0 ||filteredData?.length === 0 || data?.status === "error" ? (
          <div className="w-full h-full flex items-center justify-center">
            <EmptyData />
          </div>
        ) : (
          <div>
            <TableContainer
              elevation={0}
              component={Paper}
              sx={{
                borderRadius: "0px",
                maxHeight: "74vh",
                height: "74vh",
                overflow: "auto",
                boxShadow: 6,
                // border: "1px solid #000",
              }}
            >
              <Table
                sx={{
                  borderCollapse: "separate",
                  borderSpacing: 0,
                  "& th, & td": {
                    borderRight: "1px solid #e0e0e0",
                  },
                  "& tr:last-child td": {
                    borderRight: "1px solid #e0e0e0",
                  },
                }}
              >
                {" "}
                {/* Add stickyHeader prop */}
                <TableHead className="bg-gray-200 ">
                  <TableRow>
                    <StyledTableCell
                      sx={{
                        position: "sticky",
                        top: 0,
                        backgroundColor: "#e5e7eb",
                        zIndex: 1,
                      }}
                    >
                      <b>PURPOSE</b>
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        position: "sticky",
                        top: 0,
                        backgroundColor: "#e5e7eb",
                        zIndex: 1,
                      }}
                    >
                      <b>CLAIM DATE</b>
                    </StyledTableCell>

                    <StyledTableCell
                      sx={{
                        position: "sticky",
                        top: 0,
                        backgroundColor: "#e5e7eb",
                        zIndex: 1,
                      }}
                    >
                      <b>REPORTING TO</b>
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        position: "sticky",
                        top: 0,
                        backgroundColor: "#e5e7eb",
                        zIndex: 1,
                      }}
                    >
                      <b>STATUS</b>
                    </StyledTableCell>

                    <StyledTableCell
                      sx={{
                        position: "sticky",
                        top: 0,
                        backgroundColor: "#e5e7eb",
                        zIndex: 1,
                      }}
                    >
                      <b>ACTION</b>
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((row: any) => (
                    <StyledTableRow key={row.trackid}>
                      <TableCell sx={{ py: 1 }}>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: "#1f2937",
                          }}
                        >
                          {row?.purpose}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            color: "#1f2937",
                            mb: 0.5,
                          }}
                        >
                          {row?.date}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ py: 1 }}>
                        <Box>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                              color: "#1f2937",
                            }}
                          >
                            {row.reportto}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            color: "#1f2937",
                            mb: 1,
                          }}
                        >
                          {getStatus(row?.status)}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ py: 1 }}>
                        <div className="flex gap-2">
                          {cancelLoading && trackId === row?.trackid ? (
                            <div className="w-full  flex items-center justify-center">
                              <CircularProgress
                                sx={{ color: "green" }}
                                size={"25px"}
                              />
                            </div>
                          ) : (
                            <IconButton
                              sx={{
                                color: "gray",
                                "&:hover": { color: "red" },
                              }}
                              disabled={
                                row?.status === "APR" || row?.status === "RTN"
                              }
                              onClick={() => {
                                setTrackId(row?.trackid);
                                setIsConfirm(true);
                              }}
                            >
                              <ClearIcon
                                sx={{
                                  fontSize: 26,
                                  color:
                                    row?.status === "APR" ||
                                    row?.status === "RTN"
                                      ? "gray"
                                      : "red",
                                }}
                              />
                            </IconButton>
                          )}

                          <IconButton
                            sx={{ color: "gray", "&:hover": { color: "#000" } }}
                            disabled={
                              row?.status === "APR" || row?.status === "RTN"
                            }
                            onClick={() => {
                              setSelectedRow(row);
                              setIsOpen(true);
                            }}
                          >
                            <VisibilityIcon
                              sx={{
                                fontSize: 26,
                                color: "gray",
                              }}
                            />
                          </IconButton>
                        </div>
                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </div>

      <DocView
        open={isOpen}
        close={() => setIsOpen(false)}
        vertical={"top"}
        horizontal={"center"}
        transformOrigin={"bottom"}
      >
        <Paper
          sx={{
            p: 3,
            width: "100%",
            mx: "auto",

            background: "linear-gradient(135deg, #f0f7fa 0%, #e0f2f1 100%)",
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Typography variant="h6" fontWeight={700}>
              Reimbursement Details
            </Typography>
            <IconButton
              aria-label="close"
              onClick={() => setIsOpen(false)}
              sx={{ color: (theme) => theme.palette.grey[800] }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />

          <Box mb={2} textAlign="center">
            <div className="flex items-center justify-between">
              <Typography
                variant="subtitle1"
                fontWeight={600}
                fontSize={16}
                mb={1}
              >
                <span style={{ color: "#388e3c" }}>Total Amount:</span>{" "}
                <b>₹{selectedRow?.finalAmount}</b>
              </Typography>
              <div className="flex items-center gap-2">
                <Typography>View Receipt</Typography>
                <IconButton
                  onClick={() => {
                    setSelectedDoc(selectedRow?.receipt);
                    setIsDocViewOpen(true);
                  }}
                >
                  <VisibilityIcon />
                </IconButton>
              </div>
            </div>
            <Typography variant="body2" color="text.secondary">
              Requested Date/Time: <b>{selectedRow?.regdate}</b>
            </Typography>
          </Box>

          {selectedRow && (
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{ borderRadius: 2, background: "#fff" }}
            >
              <Table size="small" aria-label="expense details">
                <TableHead>
                  <TableRow sx={{ background: customColor.bgColor }}>
                    <TableCell sx={{ color: "#fff" }}>#</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Category</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Description</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {JSON.parse(selectedRow?.expenses)?.map(
                    (item: any, idx: any) => (
                      <TableRow
                        key={idx}
                        sx={{
                          backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "#fff",
                        }}
                      >
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>
                          {/* Optionally add an icon here */}
                          {item?.category}
                        </TableCell>
                        <TableCell>{item?.description}</TableCell>
                        <TableCell>
                          <b>₹{item?.amount}</b>
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </DocView>
      <ConfirmationModal
        open={isConfirm}
        close={() => setIsConfirm(false)}
        aggree={handleCancel}
        title="Cancel Leave Request"
        description="Do you want to cancel your submitted leave application?"
      />

      {/* recepiet view */}

      <DocView
        open={isDocViewOpen}
        close={() => setIsDocViewOpen(false)}
        vertical={"center"}
        horizontal={"right"}
        transformOrigin={"right"}
      >
        <Paper
          sx={{
            p: 3,
            width: "100%",
            mx: "auto",

            background: "linear-gradient(135deg, #f0f7fa 0%, #e0f2f1 100%)",
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Typography variant="h6" fontWeight={700}>
              Recepit
            </Typography>
            <IconButton
              aria-label="close"
              onClick={() => setIsDocViewOpen(false)}
              sx={{ color: (theme) => theme.palette.grey[800] }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {selectedDoc &&
            JSON.parse(selectedDoc)?.map((item: any, idx: number) => (
              <img
                key={idx}
                src={item}
                alt={`Receipt ${idx + 1}`}
                style={{ width: "100%", marginBottom: "1rem" }}
              />
            ))}
        </Paper>
      </DocView>
    </div>
  );
};

export default ReimbursementStatusPage;
