import { Popover, Typography } from "@mui/material";
import SearchBarComponentContent from "./reuseable/SearchBarComponentContent";

interface Props {
  open: boolean;
  close: () => void;
  anchorRef: any;
  searchQuary: string
}

const SearchBarComponent: React.FC<Props> = ({ open, close, anchorRef, searchQuary }) => {
  return (
    <Popover
      open={open}
      anchorEl={anchorRef?.current || null}
      onClose={close}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      disableAutoFocus
      disableEnforceFocus
      PaperProps={{
        sx: {
          mt: 1,

          width: { sm: 300, md: 400, lg: 500 },
          height: 450,
          p: 2,
          transformOrigin: "top",
          position: "relative",

          borderRadius: "8px",
          display: { xs: "none", md: "block" },
          overflow: "visible",
        },
      }}
    >
      {/* Triangle/Cone pointing upward */}
      <div
        style={{
          position: "absolute",
          top: "-10px",
          right: "240px",
          width: 0,
          height: 0,
          borderLeft: "10px solid transparent",
          borderRight: "10px solid transparent",
          borderBottom: "10px solid #ffffff",
          zIndex: 5,
        }}
      />

      <>
        <div className="w-full flex justify-between items-center p-3 border-b-1 border-gray-700/40">
          <Typography sx={{ fontSize: 18, fontWeight: 600 }}>Discover</Typography>
        </div>
        <SearchBarComponentContent  inputText= {searchQuary}/>
      </>
    </Popover>
  );
};

export default SearchBarComponent;
