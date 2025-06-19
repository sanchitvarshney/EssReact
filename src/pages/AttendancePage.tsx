import CustomCalender from "../components/CustomCalender";


import AttendancePageTable from "../components/AttendancePageTable";


const AttendancePage = () => {
  return (
    <div className="w-full px-4 py-2">
      <AttendancePageTable value={""} />

    
      <div className="w-full ">
        <CustomCalender />
      </div>
    
    </div>
  );
};

export default AttendancePage;
