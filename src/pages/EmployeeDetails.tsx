import { useParams } from "react-router-dom";
import EmployeeDetailsContent from "../components/EmployeeDetailsContent";
import CustomFooter from "../components/reuseable/CustomFooter";

const EmployeeDetails = () => {
  const { empCode } = useParams();

  return (
    <div className="w-full h-full overflow-y-auto custom-scrollbar-for-menu px-0 py-0">
      <EmployeeDetailsContent empCode={empCode} />
      <CustomFooter />
    </div>
  );
};

export default EmployeeDetails;
