import { Avatar } from "@mui/material";

// interface OfficeAbsenceProps {
//   employeeName: string;
//   avatarUrl?: string;
//   startDate: string;
//   endDate: string;
//   returnDate?: string;
//   duration: {
//     hours: number;
//     minutes: number;
//     days: number;
//   };
// }

const OfficeAbsenceComponent = ({}) => {
  return (
    <div className="px-4 py-3 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      
        <div className="flex items-center gap-3 min-w-[150px]">
          <Avatar src="" alt="name" className="w-10 h-10" sx={{backgroundColor:"#2eacb3",           pointerEvents: "none",
                      userSelect: "none",}} />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">Name</span>
            <span className="text-xs text-gray-500">Employee</span>
          </div>
        </div>

        
        <div className="flex flex-col gap-1 sm:items-start">
          <span className="text-sm font-medium text-gray-700">
            OD: 12-05-2023 to 12-05-2023
          </span>
          <span className="text-xs text-gray-500">
            Will return on 13-04-2023
          </span>
        </div>

       
        <div className="sm:text-right text-sm text-gray-600 min-w-[100px]">
          9:00 h
        </div>
      </div>
    </div>
  );
};

export default OfficeAbsenceComponent;
