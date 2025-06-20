import ToggleOffOutlinedIcon from "@mui/icons-material/ToggleOffOutlined";
import ToggleOnOutlinedIcon from "@mui/icons-material/ToggleOnOutlined";
import type { FC } from "react";

interface CustomTogglePropsTypes {
  value: string;

  state: boolean;
  title: string;
  setMethod: (state: any) => void;
}
const CustomToggle: FC<CustomTogglePropsTypes> = ({
  title,
  state,
  value,

  setMethod,
}) => {
  const toggleDayStatus = (value: string) => {
    // console.log("click");
    if (value === title) {
      setMethod((prev: boolean) => !prev);
    } else {
      setMethod((prev: boolean) => !prev);
    }
  };
  return (
    <div className="flex items-center">
    <span onClick={() => toggleDayStatus(value)} >
      {state ? (
        <ToggleOnOutlinedIcon sx={{ color: "green", fontSize: 36, mr: 1 }} />
      ) : (
        <ToggleOffOutlinedIcon sx={{ color: "gray", fontSize: 36, mr: 1 }} />
      )}
   
    </span>
    <span>{title}</span>
    </div>
  );
};

export default CustomToggle;
