import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import type { FC } from "react";
import CustomToolTip from "./CustomToolTip";

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
 
    if (value === title) {
      setMethod((prev: boolean) => !prev);
    } else {
      setMethod((prev: boolean) => !prev);
    }
  };
  return (
    <CustomToolTip
    
      title={`${
        state
          ? "Currently ON: Applying for Afternoon Session (1:30 PM – 6:00 PM)"
          : "Currently OFF: Applying for Morning Session (9:00 AM – 1:30 PM)"
      }`}
      placement="right"
    >
      <div className="flex items-center">
        <span onClick={() => toggleDayStatus(value)} className="cursor-pointer">
          {state ? (
            <ToggleOnIcon sx={{ color: "green", fontSize: 36, mr: 1 }} />
          ) : (
            <ToggleOffIcon sx={{ color: "gray", fontSize: 36, mr: 1 }} />
          )}
        </span>
        <span>{title}</span>
      </div>
    </CustomToolTip>
  );
};

export default CustomToggle;
