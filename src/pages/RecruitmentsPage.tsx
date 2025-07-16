import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Chip,
} from "@mui/material";
import recruitmentIcon from "../assets/selection.png";
import { CustomButton } from "../components/ui/CustomButton";
import ReferalPage from "./ReferalPage";
import DocView from "../components/reuseable/DocView";
import { useState } from "react";
import JobDetailsPage from "./JobDetailsPage";

const jobOpenings = [
  {
    title: "Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full Time",
  },
  {
    title: "UI/UX Designer",
    department: "Design",
    location: "Bangalore",
    type: "Contract",
  },
  {
    title: "HR Executive",
    department: "Human Resources",
    location: "Mumbai",
    type: "Full Time",
  },
  {
    title: "UI/UX Designer",
    department: "Design",
    location: "Bangalore",
    type: "Contract",
  },
  {
    title: "HR Executive",
    department: "Human Resources",
    location: "Mumbai",
    type: "Full Time",
  },
];

const RecruitmentsPage = () => {
  const [view, setView] = useState(false);
    const [detailsView, setDetailsView] = useState(false);
  return (
    <div className="h-[calc(100vh-100px)] flex flex-col items-center py-8 px-4 overflow-y-auto">
      <div className="flex flex-col items-center mb-8">
        <Avatar src={recruitmentIcon} sx={{ width: 80, height: 80, mb: 2,           pointerEvents: "none",
                      userSelect: "none", }} />
        <Typography variant="h4" className="font-bold text-gray-800 mb-2">
          Recruitments
        </Typography>
        <Typography
          variant="subtitle1"
          className="text-gray-600 text-center max-w-xl"
        >
          Join our team! Explore exciting career opportunities and become a part
          of our growing family.
        </Typography>
      </div>
      <div className="w-full grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        {jobOpenings.map((job, idx) => (
          <Card
            key={idx}
            sx={{ maxHeight: 350 }}
            elevation={2}
            className="hover:shadow-xl transition-shadow"
          >
            <CardContent className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Typography
                  variant="h6"
                  className="font-semibold text-[black]-800"
                >
                  {job.title}
                </Typography>
                <Box className="flex flex-wrap gap-2 mt-1">
                  <Chip label={job.department} color="primary" size="small" />
                  <Chip label={job.location} color="success" size="small" />
                  <Chip label={job.type} color="secondary" size="small" />
                </Box>
              </div>
              <div className="space-y-2 space-x-2">
                <CustomButton onClick={() => setDetailsView(true)} className="bg-[#2eacb3] text-white  cursor-pointer">
                  View
                </CustomButton>
                <CustomButton onClick={()=>setView(true)} className="bg-[#2eacb3] text-white cursor-pointer">
                  Reffer
                </CustomButton>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <DocView
        open={view}
        close={() => setView(false)}
        vertical={"bottom"}
        horizontal={"center"}
        transformOrigin={"bottom"}
        
      >
        <ReferalPage onClose={() => setView(false)} />
      </DocView>
          <DocView
        open={detailsView}
        close={() => setDetailsView(false)}
        vertical={"bottom"}
        horizontal={"center"}
        transformOrigin={"bottom"}
        
      >
        <JobDetailsPage onClose={() => setDetailsView(false)}  />
      </DocView>
    </div>
  );
};

export default RecruitmentsPage;
