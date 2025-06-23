
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
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

        <ToggleOnIcon sx={{ color: "green", fontSize: 36, mr: 1 }} />
      ) : (
        <ToggleOffIcon sx={{ color: "gray", fontSize: 36, mr: 1 }} />
      )}
   
    </span>
    <span>{title}</span>
    </div>
  );
};

export default CustomToggle;
