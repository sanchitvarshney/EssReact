import { Avatar } from "@mui/material";

interface CardForAttendancePropsType {
  title: string;
  icon: any;
  value: number | string;
}
const CardForAttendance: React.FC<CardForAttendancePropsType> = ({
  title,
  icon,
  value,
}) => {
  return (
    <div className="w-25  h-15  flex flex-col justify-center items-center">
      <div className="flex items-center gap-2">
        <p className="text-sm  select-none ">{title} </p> <Avatar src={icon} alt="icon" sx={{width:18, height:18,backgroundColor:"#2eacb3"}}/>
      </div>

      <span>{value}</span>
    </div>
  );
};

export default CardForAttendance;
