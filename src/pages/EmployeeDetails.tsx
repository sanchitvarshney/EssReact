import { Avatar, Divider, IconButton, Typography } from "@mui/material";

import { useGetEmployeeDetailsQuery } from "../services/auth";

import { useToast } from "../hooks/useToast";
import EmployeeProfilePageSkeleton from "../skeleton/EmployeeProfilePageSkeleton";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import EmployeeHierarchyPage from "../components/EmployeeHierarchyPage";
// import { useNavigate } from "react-router-dom";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CustomFooter from "../components/reuseable/CustomFooter";

const Information = ({
  label,
  value,
}: // changeValue,
// name,
{
  label: any;
  value: any;
}) => {
  const { showToast } = useToast();

  const handleCopy = async (textToCopy: any) => {
    try {
      await navigator.clipboard.writeText(textToCopy);

      showToast("Copied to clipboard!", "success");
    } catch (err) {
      alert("Failed to copy!");
      showToast("Failed to copy!", "error");
      console.error(err);
    }
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col">
        <span className="text-lg font-semibold">{`${label}`}</span>
        <div className="flex  items-center gap-x-3">
          <span className="text-base my-1">
            {value === null || value === "" ? "N/A" : value}
          </span>
          {label === "Email ID" && (
            <IconButton size="small" onClick={() => handleCopy(value)}>
              <ContentCopyIcon sx={{ fontSize: 16, color: "#000" }} />
            </IconButton>
          )}
        </div>
      </div>
    </div>
  );
};

const EmployeeDetails = () => {
  const { showToast } = useToast();

  const { empCode } = useParams();

  const { isLoading, data, error } = useGetEmployeeDetailsQuery({
    empcode: empCode,
  });

  useEffect(() => {
    //@ts-ignore
    if (error?.error) {
      // @ts-ignore
      showToast(error?.message || "Something went wrong", "error");
      return;
    }
  }, [error]);

  useEffect(() => {
    if (data?.status === "error") {
      showToast(data.message, "error");
      return;
    }
  }, [data]);

  return (
    <div className="w-full h-[calc(100vh-90px)]  overflow-y-auto p-0 will-change-transform bg-white ">
      {isLoading ? (
        <EmployeeProfilePageSkeleton />
      ) : (
        <>
          <div
            className="w-[100%] sm:w-[100%] px-4   flex justify-between   "
            style={{
              background:
                "linear-gradient(0deg, rgba(255, 255, 255, 1) 63%, rgba(240, 240, 240, 1) 100%)",
            }}
          >
            <div className="flex items-center gap-x-15 gap-y-8 flex-wrap py-6 px-6 ">
              <div>
                <Avatar
                  src={data?.personalInfo?.empPhoto}
                  alt={data?.personalInfo?.empName}
                  sx={{
                    width: 140,
                    height: 140,
                    backgroundColor: "#2eacb3",
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                />
              </div>

              <div>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {`${data?.personalInfo?.empName} (${data?.personalInfo?.empCode}) `}
                </Typography>

                <Typography variant="subtitle2">
                  {data?.officeInfo?.designation}
                </Typography>

                <Typography variant="subtitle2">
                  {data?.officeInfo?.department}
                </Typography>
              </div>
            </div>
          </div>
          <Divider sx={{ marginTop: 1 }} />
          <div className=" my-4 px-4">
            <div>
              <div className="flex justify-between items-center">
                <Typography
                  sx={{
                    fontSize: 20,
                    fontWeight: 600,
                    py: 2,
                    color: "#2eacb3",
                  }}
                >
                  Basic Information
                </Typography>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-8 px-4 pl-10 ">
                <Information
                  label={"Date of joining"}
                  value={data?.personalInfo?.doj || "--"}
                />
                <Information
                  label={"Date of birth"}
                  value={data?.personalInfo?.dob || "--"}
                />
                <Information
                  label={"Office Mobile No."}
                  value={data?.personalInfo?.phone || "--"}
                />
                <Information
                  label={"Email ID"}
                  value={data?.personalInfo?.email || "--"}
                />
                <Information
                  label={"Blood Group"}
                  value={data?.personalInfo?.bloodGroup || "--"}
                />
                <Information
                  label={"Grade"}
                  value={data?.personalInfo?.grade || "--"}
                />
                <Information
                  label={"Hobbies"}
                  value={data?.personalInfo?.hobbies || "--"}
                />
              </div>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                py={1}
                mt={1}
                sx={{ ml: 2, color: "#2eacb3" }}
              >
                Report To
              </Typography>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3   px-4 pl-10 ">
                <Information
                  label={"Manager"}
                  value={`${data?.officeInfo?.manager?.name || "--"} (${
                    data?.officeInfo?.manager?.empCode || "--"
                  })`}
                />
              </div>
              <Divider sx={{ my: 1 }} />
              <div className="flex justify-between items-center mt-6">
                <Typography
                  sx={{
                    fontSize: 20,
                    fontWeight: 600,
                    py: 2,
                    color: "#2eacb3",
                  }}
                >
                  Company Information
                </Typography>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-8 px-4 pl-10 ">
                <Information
                  label={"Company Name"}
                  value={data?.companyInfo?.name || "--"}
                />
                <Information
                  label={"Office Location"}
                  value={`${data?.officeInfo?.officeLocation || "--"}`}
                />
                <Information
                  label={"Branch Info"}
                  value={data?.companyInfo?.branch}
                />
                <Information
                  label={"GSTIN"}
                  value={data?.companyInfo?.GSTIN || "--"}
                />
                <Information
                  label={"CIN"}
                  value={data?.companyInfo?.CIN || "--"}
                />
              </div>
            </div>
          </div>
          <Divider sx={{ my: 1 }} />
          <div className="flex justify-between items-center px-4">
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 600,
                py: 2,
                color: "#2eacb3",
              }}
            >
              Hierarchy
            </Typography>
          </div>
          <div className="mb-4  w-full overflow-x-auto will-change-transform px-20">
            <EmployeeHierarchyPage userId={empCode} />
          </div>
          <CustomFooter />
        </>
      )}
    </div>
  );
};

export default EmployeeDetails;
