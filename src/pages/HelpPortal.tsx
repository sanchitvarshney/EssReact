import { Avatar, Typography } from "@mui/material";
import help from "../assets/help.png";
import { CustomButton } from "../components/ui/CustomButton";
import { useNavigate } from "react-router-dom";

const HelpPortal = () => {
  const navigation = useNavigate();

  return (
    <div className="w-full p-4 flex flex-col justify-center items-center">
      <div className="  flex flex-col justify-center items-center h-[80vh] overflow-y-auto gap-y-5 ">
        <Avatar
          variant="square"
          src={help}
          sx={{ width: { xs: 150, md: 250 }, height: { xs: 150, md: 250 } }}
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
            className=" px-10 cursor-pointer py-4 text-lg font-bold shadow-xl bg-gradient-to-r from-[#2eacb3] to-[#1e8a8f] hover:from-[#1e8a8f] hover:to-[#2eacb3] rounded-2xl transform hover:scale-105 transition-all duration-200 text-white"
            onClick={() => navigation("/support-protal/create-new-ticket")}
          >
            Create New Ticket
          </CustomButton>
          <CustomButton
            className=" px-10 cursor-pointer py-4 text-lg font-bold shadow-xl bg-gradient-to-r from-[#2eacb3] to-[#1e8a8f] hover:from-[#1e8a8f] hover:to-[#2eacb3] rounded-2xl transform hover:scale-105 transition-all duration-200 text-white"
            onClick={() => navigation("/support-protal/ticket-status")}
          >
            Ticket Status
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default HelpPortal;
