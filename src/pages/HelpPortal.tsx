import { Avatar, Typography } from "@mui/material";
import help from "../assets/help.png";
import { CustomButton } from "../components/ui/CustomButton";

const HelpPortal = () => {
  // const [value, setValue] = useState("support");

  // const handleChange = (event: React.SyntheticEvent, newValue: string) => {
  //   setValue(newValue);
  //   console.log(event);
  // };

  // const renderElement =
  //   value === "support" ? (
  //     <SupportPage />
  //   ) : value === "new" ? (
  //     <CreateTicketPage />
  //   ) : (
  //     <ViewStatusTicketPage />
  //   );

  return (
     <div className="w-full p-4 flex flex-col justify-center items-center">
      <div className=" sm:w-200 flex flex-col justify-center items-center h-[70vh] overflow-y-auto gap-y-5 ">
        <Avatar
        variant="square"
          src={help}
          sx={{ width: { xs: 150, md: 250 }, height: { xs: 150, md: 250 } }}
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
        <div>
          <CustomButton className="">Create New Ticket</CustomButton>
          <CustomButton>Ticket Status</CustomButton>
        </div>
      </div>
    </div>
  );
};

export default HelpPortal;
