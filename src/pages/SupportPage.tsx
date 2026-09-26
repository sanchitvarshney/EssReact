import { Avatar, Typography } from "@mui/material";
import help from "../assets/help.png";

const SupportPage = () => {
  return (
    <div className="w-full h-full p-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(16,24,40,0.05)] h-full flex flex-col justify-center items-center overflow-y-auto gap-y-5 p-6 will-change-transform">
        <Avatar
          src={help}
          sx={{ width: { xs: 150, md: 250 }, height: { xs: 150, md: 250 },           pointerEvents: "none",
                      userSelect: "none", }}
        />
        <Typography variant="h3">Welcome to the Support Center</Typography>
        <Typography variant="subtitle2" className="text-justify">
          In order to streamline support requests and better serve you, we
          utilize a support ticket system. Every support request is assigned a
          unique ticket number which you can use to track the progress and
          responses online. For your reference we provide complete archives and
          history of all your support requests. A valid email address is
          required to submit a ticket.
        </Typography>
      </div>
    </div>
  );
};

export default SupportPage;
