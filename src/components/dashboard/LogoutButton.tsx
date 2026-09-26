import { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import SignOutModal from "../SignOutModal";
import { useAuth } from "../../contextapi/AuthContext";
import { useOnFeedBackMutation } from "../../services/vibe";

// Header logout: opens the same feedback + confirm modal the old profile menu used.
const LogoutButton = () => {
  const { signOut, user } = useAuth();
  const [onFeedBack] = useOnFeedBackMutation();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleLogout = () => {
    const empcode = (user as any)?.id;
    if (selected && empcode) {
      onFeedBack({ feedback: selected, empcode });
      setSelected(null);
    }
    signOut();
  };

  return (
    <>
      <Tooltip title="Logout" arrow>
        <IconButton
          onClick={() => setOpen(true)}
          aria-label="Logout"
          sx={{
            p: 1,
            borderRadius: 2,
            color: "#fff",
            bgcolor: "rgba(255,255,255,0.14)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
            transition: "all 0.2s",
          }}
        >
          <LogoutIcon sx={{ fontSize: 22 }} />
        </IconButton>
      </Tooltip>
      <SignOutModal
        openSign={open}
        close={() => setOpen(false)}
        aggree={handleLogout}
        setSelected={setSelected}
        selected={selected}
      />
    </>
  );
};

export default LogoutButton;
