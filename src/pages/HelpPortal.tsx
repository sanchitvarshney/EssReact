import { Avatar, Typography } from "@mui/material";
import help from "../assets/help.png";
import { CustomButton } from "../components/ui/CustomButton";
import { useNavigate } from "react-router-dom";

const HelpPortal = () => {
  const navigation = useNavigate();

  return (
    <div className="w-full h-full p-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(16,24,40,0.05)] h-full flex flex-col justify-center items-center overflow-y-auto gap-y-5 p-6 will-change-transform">
        <Avatar
          variant="square"
          src={help}
          sx={{ width: { xs: 150, md: 250 }, height: { xs: 150, md: 250 },           pointerEvents: "none",
                      userSelect: "none", }}
        />
        <Typography variant="subtitle1" fontSize={24}>Welcome to the Support Center</Typography>
        <Typography variant="subtitle2" className="text-justify">
          In order to streamline support requests and better serve you, we
          utilize a support ticket system. Every support request is assigned a
          unique ticket number which you can use to track the progress and
          responses online. For your reference we provide complete archives and
          history of all your support requests. A valid email address is
          required to submit a ticket.
        </Typography>
        <div className=" w-full space-x-4 space-y-4 flex flex-col justify-center items-center">
          <CustomButton
            className=" px-10 cursor-pointer py-4 text-lg font-bold shadow-xl bg-gradient-to-r from-[#00a0a0] to-[#007f86] hover:from-[#007f86] hover:to-[#00a0a0] rounded-2xl transform hover:scale-105 transition-all duration-200 text-white"
            onClick={() => navigation("/support-portal/create-new-ticket")}
          >
            Create New Ticket
          </CustomButton>
          <CustomButton
            className=" px-10 cursor-pointer py-4 text-lg font-bold shadow-xl bg-gradient-to-r from-[#00a0a0] to-[#007f86] hover:from-[#007f86] hover:to-[#00a0a0] rounded-2xl transform hover:scale-105 transition-all duration-200 text-white"
            onClick={() => navigation("/support-portal/ticket-status")}
          >
            Ticket Status
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default HelpPortal;
