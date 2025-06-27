import React from "react";
import {
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiSearch,
} from "react-icons/fi";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

// Mock data for demonstration
const claims = [
  {
    id: "RC-001",
    date: "2024-06-01",
    purpose: "Client Meeting Travel",
    amount: 120.5,
    status: "Pending",
  },
  {
    id: "RC-002",
    date: "2024-05-28",
    purpose: "Office Supplies",
    amount: 45.0,
    status: "Approved",
  },
  {
    id: "RC-003",
    date: "2024-05-20",
    purpose: "Team Lunch",
    amount: 80.0,
    status: "Rejected",
  },
  {
    id: "RC-001",
    date: "2024-06-01",
    purpose: "Client Meeting Travel",
    amount: 120.5,
    status: "Pending",
  },
  {
    id: "RC-002",
    date: "2024-05-28",
    purpose: "Office Supplies",
    amount: 45.0,
    status: "Approved",
  },
  {
    id: "RC-003",
    date: "2024-05-20",
    purpose: "Team Lunch",
    amount: 80.0,
    status: "Rejected",
  },
  {
    id: "RC-001",
    date: "2024-06-01",
    purpose: "Client Meeting Travel",
    amount: 120.5,
    status: "Pending",
  },
  {
    id: "RC-002",
    date: "2024-05-28",
    purpose: "Office Supplies",
    amount: 45.0,
    status: "Approved",
  },
];

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Approved: "bg-green-100 text-green-800 border-green-300",
  Rejected: "bg-red-100 text-red-800 border-red-300",
};

const statusIcons: Record<string, React.ReactNode> = {
  Pending: <FiClock className="inline mr-1" />,
  Approved: <FiCheckCircle className="inline mr-1" />,
  Rejected: <FiXCircle className="inline mr-1" />,
};

const ReimbursementStatusPage = () => {
  return (
    <div className="w-full h-[calc(100vh-90px)] bg-gradient-to-br from-[#f0f7fa] to-[#e0f2f1] py-4 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#2eacb3] to-[#1e8a8f] rounded-full mb-2 shadow-lg">
            <FiFileText className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-[#2eacb3] to-[#1e8a8f] bg-clip-text text-transparent">
            Reimbursement Status
          </h2>
        </div>

        <div className="flex justify-end mb-6">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search by purpose or ID..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white focus:border-[#2eacb3] focus:ring-[#2eacb3] shadow-sm transition-all duration-200"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <TableContainer
            component={Paper}
            sx={{ border: "none", boxShadow: "none", borderRadius: "16px" }}
          >
            <Table
              sx={{ minWidth: 650, border: "none" }}
              size="medium"
              aria-label="reimbursement status table"
            >
              <TableHead>
                <TableRow className="bg-[#2eacb3]">
                  <TableCell className="text-white font-semibold border-none">
                    Claim ID
                  </TableCell>
                  <TableCell className="text-white font-semibold border-none">
                    Date
                  </TableCell>
                  <TableCell className="text-white font-semibold border-none">
                    Purpose
                  </TableCell>
                  <TableCell className="text-white font-semibold border-none text-center">
                    Amount ($)
                  </TableCell>
                  <TableCell className="text-white font-semibold border-none text-center">
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {claims.map((claim) => (
                  <TableRow
                    key={claim.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": { backgroundColor: "#f8fafc" },
                      transition: "background-color 0.2s ease",
                    }}
                    className="hover:bg-gray-50"
                  >
                    <TableCell>{claim.id}</TableCell>
                    <TableCell>{claim.date}</TableCell>
                    <TableCell>{claim.purpose}</TableCell>
                    <TableCell align="left">
                      {claim.amount.toFixed(2)}
                    </TableCell>
                    <TableCell align="left">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-semibold ${
                          statusColors[claim.status]
                        }`}
                      >
                        {statusIcons[claim.status]} {claim.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default ReimbursementStatusPage;
