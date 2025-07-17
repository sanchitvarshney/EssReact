import { useState } from "react";
import DocView from "../components/reuseable/DocView";
import { Divider, Typography } from "@mui/material";
import ReimbursementGrantCard from "../components/reuseable/ReimbursementGrantCard";

// Mock data for demonstration
const reimbursements = [
  {
    id: "RB-001",
    name: "John Doe",
    designation: "Sales Manager",
    department: "Sales",
    date: "2024-06-01",
    purpose: "Client Meeting Travel",
    amount: 120.5,
    status: "Pending",
    details: "Taxi fare for client meeting at downtown.",
    receipt: "/src/assets/coin.png",
    comment: "Urgent client visit."
  },
  {
    id: "RB-002",
    name: "Jane Smith",
    designation: "Accountant",
    department: "Finance",
    date: "2024-05-28",
    purpose: "Office Supplies",
    amount: 45.0,
    status: "Pending",
    details: "Purchased printer ink and paper.",
    receipt: "/src/assets/dollar.png",
    comment: "Needed for monthly reports."
  },
];

const ReimbursementGrantPage = () => {
  const [view, setView] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const handleOpen = (item: any) => {
    setSelected(item);
    setView(true);
  };

  return (
    <div className="w-full py-4 flex  flex-col h-[calc(100vh-100px)]">
      <Typography variant="h4" className="font-bold text-center mb-6 bg-gradient-to-r from-[#2eacb3] to-[#1e8a8f] bg-clip-text text-transparent">
        Reimbursement Grant
      </Typography>
      <div className=" grid grid-cols-1 sm:grid-cols-1  lg:grid-cols-2 w-full  h-[76vh] will-change-transform will-change-transform  overflow-y-auto p-2   ">
        {reimbursements.map((item) => (
          <ReimbursementGrantCard
            key={item.id}
            data={item}
            open={() => handleOpen(item)}
            maxWidth={600}
            isView={false}
          />
        ))}
      </div>
      <DocView
        open={view}
        close={() => setView(false)}
        vertical={"bottom"}
        horizontal={"center"}
        transformOrigin={"bottom"}
      >
        {selected && (
          <div className="p-4 max-w-xl">
            <ReimbursementGrantCard data={selected} maxWidth={"100%"} isView={true} />
            <Divider className="my-4" />
            <Typography variant="subtitle2" sx={{ textAlign: "center", fontSize: { xs: "1rem", sm: "1.1rem" }, fontWeight: 600 }}>
              Purpose: <span className="font-[300]">{selected.purpose}</span>
            </Typography>
            <Typography variant="subtitle2" sx={{ textAlign: "center", fontSize: { xs: "1rem", sm: "1.1rem" }, fontWeight: 600 }}>
              Details: <span className="font-[300]">{selected.details}</span>
            </Typography>
            <Typography variant="subtitle2" sx={{ textAlign: "center", fontSize: { xs: "1rem", sm: "1.1rem" }, fontWeight: 600 }}>
              Comment: <span className="font-[300]">{selected.comment}</span>
            </Typography>
            <div className="flex justify-center mt-4">
              <img src={selected.receipt} alt="Receipt" className="h-32 rounded-lg border" />
            </div>
          </div>
        )}
      </DocView>
    </div>
  );
};

export default ReimbursementGrantPage; 