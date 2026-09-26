import { useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import { useAuth } from "../../contextapi/AuthContext";

const ProfileCard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const u: any = user ?? {};

  const rows = [
    { label: "Designation", value: u.role, Icon: BadgeOutlinedIcon },
    { label: "Employee ID", value: u.id, Icon: ConfirmationNumberOutlinedIcon },
    { label: "Department", value: u.dept, Icon: ApartmentOutlinedIcon },
  ];

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(16,24,40,0.05)] overflow-hidden">
      <div
        className="h-[92px]"
        style={{ background: "linear-gradient(135deg, #0f2f3a 0%, #0b5563 100%)" }}
      />
      <div className="px-4 pb-4 -mt-[62px]">
        <div className="flex items-end gap-3">
          <Avatar
            src={u.imgUrl}
            alt={u.name}
            variant="rounded"
            sx={{
              width: 84,
              height: 96,
              borderRadius: "10px",
              bgcolor: "#00a0a0",
              fontSize: 32,
              border: "3px solid #fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            {u.name?.charAt(0)}
          </Avatar>
          <button
            onClick={() => navigate("/manage-account")}
            className="text-left mb-1 cursor-pointer min-w-0"
          >
            <p className="text-sm font-bold text-gray-800 truncate">{u.name}</p>
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {rows.map(({ label, value, Icon }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon sx={{ fontSize: 18, color: "#6b7280" }} />
              <div className="min-w-0">
                <p className="text-[10px] text-gray-400 leading-tight">{label}</p>
                <p className="text-xs font-medium text-gray-700 truncate">{value || "--"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfileCard;
