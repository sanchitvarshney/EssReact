import { Avatar, IconButton } from "@mui/material";
import { useGetEmployeeDetailsQuery } from "../services/auth";
import { useToast } from "../hooks/useToast";
import EmployeeProfilePageSkeleton from "../skeleton/EmployeeProfilePageSkeleton";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import EmployeeHierarchyPage from "../components/EmployeeHierarchyPage";
import badge from "../assets/img/badge.png";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CustomFooter from "../components/reuseable/CustomFooter";
import BadgeIcon from "@mui/icons-material/Badge";
import BusinessIcon from "@mui/icons-material/Business";
import AccountTreeIcon from "@mui/icons-material/AccountTree";

/* ── Info field — matches EmployeeInformationPage style ── */
const InfoField = ({
  label,
  value,
  copyable,
}: {
  label: string;
  value: any;
  copyable?: boolean;
}) => {
  const { showToast } = useToast();
  const isEmpty = !value || value === "--";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      showToast("Copied to clipboard!", "success");
    } catch {
      showToast("Failed to copy!", "error");
    }
  };

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
        {label}
      </span>
      <div className="flex items-center gap-1">
        <span className={`text-sm font-medium ${isEmpty ? "text-gray-300" : "text-gray-800"}`}>
          {isEmpty ? "—" : value}
        </span>
        {copyable && !isEmpty && (
          <IconButton size="small" onClick={handleCopy} sx={{ p: 0.25 }}>
            <ContentCopyIcon sx={{ fontSize: 12, color: "#94a3b8" }} />
          </IconButton>
        )}
      </div>
    </div>
  );
};

/* ── Section header ── */
const SectionHead = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-50">
    <div className="w-1 h-5 rounded-full bg-[#2eacb3]" />
    {icon}
    <span className="text-sm font-bold text-gray-800">{title}</span>
  </div>
);

const EmployeeDetails = () => {
  const { showToast } = useToast();
  const { empCode } = useParams();

  const { isLoading, data, error } = useGetEmployeeDetailsQuery(
    { empcode: empCode },
    { refetchOnMountOrArgChange: true },
  );

  useEffect(() => {
    //@ts-ignore
    if (error?.error) showToast(error?.message || "Something went wrong", "error");
  }, [error]);

  useEffect(() => {
    if (data?.status === "error") showToast(data.message, "error");
  }, [data]);

  return (
    <div className="w-full h-[calc(100vh-78px)] overflow-y-auto custom-scrollbar-for-menu px-0 py-0">
      {isLoading ? (
        <EmployeeProfilePageSkeleton />
      ) : (
        <div className="max-w-4xl mx-auto flex flex-col gap-4 py-5 px-4">

          {/* ── Profile banner card ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Cover strip */}
            <div className="relative h-24 sm:h-28 bg-gradient-to-r from-[#2eacb3] to-[#0097a7] overflow-hidden">
              <div className="absolute -right-4 -top-6 w-28 h-28 rounded-full bg-white/10" />
              <div className="absolute right-20 top-4 w-14 h-14 rounded-full bg-white/10" />
              {/* Badge logo */}
              <img
                src={badge}
                alt="logo"
                className="absolute right-6 bottom-2 w-20 sm:w-24 opacity-80 hidden sm:block"
              />
            </div>

            {/* Avatar + info */}
            <div className="px-5 sm:px-8 pb-5">
              <div className="-mt-10 mb-2">
                <Avatar
                  src={data?.personalInfo?.empPhoto}
                  alt={data?.personalInfo?.empName}
                  sx={{
                    width: 80,
                    height: 80,
                    border: "4px solid #fff",
                    boxShadow: "0 4px 20px rgba(46,172,179,0.3)",
                    backgroundColor: "#2eacb3",
                    pointerEvents: "none",
                    userSelect: "none",
                    fontSize: 28,
                    fontWeight: 700,
                  }}
                >
                  {data?.personalInfo?.empName?.charAt(0)}
                </Avatar>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xl font-bold text-gray-800">
                    {data?.personalInfo?.empName}
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-[#0097a7] bg-[#e0f7fa] px-2.5 py-0.5 rounded-full border border-[#2eacb3]/20">
                    {data?.personalInfo?.empCode}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {data?.officeInfo?.designation && (
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                      {data.officeInfo.designation}
                    </span>
                  )}
                  {data?.officeInfo?.department && (
                    <span className="text-xs font-semibold text-[#0097a7] bg-[#e0f7fa] px-2.5 py-0.5 rounded-full">
                      {data.officeInfo.department}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Basic Information ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <SectionHead
              icon={<BadgeIcon sx={{ fontSize: 16, color: "#2eacb3" }} />}
              title="Basic Information"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-5 p-5">
              {[
                { label: "Date of Joining",    value: data?.personalInfo?.doj },
                { label: "Date of Birth",      value: data?.personalInfo?.dob },
                { label: "Office Mobile No.",  value: data?.personalInfo?.phone },
                { label: "Blood Group",        value: data?.personalInfo?.bloodGroup },
                { label: "Grade",              value: data?.personalInfo?.grade },
                { label: "Hobbies",            value: data?.personalInfo?.hobbies },
              ].map(({ label, value }) => (
                <InfoField key={label} label={label} value={value || "--"} />
              ))}
              <InfoField
                label="Email ID"
                value={data?.personalInfo?.email || "--"}
                copyable
              />
            </div>

            {/* Report To */}
            <div className="flex items-center gap-2 mx-5 mt-1 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#2eacb3]/50" />
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                Report To
              </span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <div className="px-5 pb-5">
              <InfoField
                label="Manager"
                value={
                  data?.officeInfo?.manager?.name
                    ? `${data.officeInfo.manager.name} (${data.officeInfo.manager.empCode || "--"})`
                    : "--"
                }
              />
            </div>
          </div>

          {/* ── Company Information ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <SectionHead
              icon={<BusinessIcon sx={{ fontSize: 16, color: "#2eacb3" }} />}
              title="Company Information"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-5 p-5">
              {[
                { label: "Company Name",      value: data?.companyInfo?.name },
                { label: "Office Location",   value: data?.officeInfo?.officeLocation },
                { label: "Branch",            value: data?.companyInfo?.branch },
                { label: "GSTIN",             value: data?.companyInfo?.GSTIN },
                { label: "CIN",               value: data?.companyInfo?.CIN },
              ].map(({ label, value }) => (
                <InfoField key={label} label={label} value={value || "--"} />
              ))}
            </div>
          </div>

          {/* ── Hierarchy ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <SectionHead
              icon={<AccountTreeIcon sx={{ fontSize: 16, color: "#2eacb3" }} />}
              title="Hierarchy"
            />
            <div className="w-full overflow-x-auto custom-scrollbar-for-menu p-4">
              <EmployeeHierarchyPage userId={empCode} />
            </div>
          </div>

        
        </div>
        
      )}
        <CustomFooter />
    </div>
  );
};

export default EmployeeDetails;
