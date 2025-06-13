import { Avatar } from "@mui/material";


const OfficeAbsenceComponent = () => {
  return (
    <div className="px-2 py-1 border-b-1 flex justify-between items-center ">
      <div className="flex items-center gap-4">
        <Avatar />
        <div className="flex flex-col">
          <span className="text-[16px]">test</span>
          <span className="text-[13px]">OD: 13-06-2025 to 13-06-2025</span>
          <span className="text-[12px]">will come on tomorrow</span>
        </div>
      </div>
      <div>
        <span className="text-[12px]">for 9 h & 0 m Days</span>
      </div>
    </div>
  );
};

export default OfficeAbsenceComponent;
