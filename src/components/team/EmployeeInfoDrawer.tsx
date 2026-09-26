import { Drawer } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { HierarchyProvider } from "../../contextapi/hierarchyProvider";
import EmployeeDetailsContent from "../EmployeeDetailsContent";

type Props = { open: boolean; empCode: string; onClose: () => void };

/** Right-side drawer with an employee's profile, so the current page (e.g. their attendance) stays in place. */
const EmployeeInfoDrawer = ({ open, empCode, onClose }: Props) => {
  const navigate = useNavigate();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: "100%", sm: 580 }, bgcolor: "#f1f7f7" } }}
    >
      <div className="flex flex-col h-full">
        <div
          className="flex items-center justify-between gap-3 px-5 py-4 text-white flex-shrink-0"
          style={{ background: "linear-gradient(120deg, #0f2f3a 0%, #0b5563 50%, #00a0a0 100%)" }}
        >
          <div>
            <p className="text-[11px] uppercase tracking-widest text-white/60">Employee profile</p>
            <p className="text-base font-bold leading-tight">{empCode}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                navigate(`/employee/details/${empCode}`);
              }}
              className="flex items-center gap-1.5 px-3 h-9 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-semibold cursor-pointer transition-colors"
            >
              <OpenInNewIcon sx={{ fontSize: 15 }} /> Full page
            </button>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center cursor-pointer transition-colors"
            >
              <CloseIcon sx={{ fontSize: 19 }} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar-for-menu">
          {open && (
            <HierarchyProvider key={empCode}>
              <EmployeeDetailsContent empCode={empCode} drawer />
            </HierarchyProvider>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default EmployeeInfoDrawer;
