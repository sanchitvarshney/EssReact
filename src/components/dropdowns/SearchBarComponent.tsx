import { Popover, Typography } from "@mui/material";
import SearchBarComponentContent from "../SearchBarComponentContent";

interface Props {
  open: boolean;
  close: () => void;
  anchorRef: any;
  searchQuary: string;
  width: string;
  onSelect?: (user: any) => void;
}

const SearchBarComponent: React.FC<Props> = ({
  open,
  close,
  anchorRef,
  searchQuary,
  width,
  onSelect,
}) => {
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
          mt: "2px",
          width: width,
          // maxHeight: 600,
          zIndex:999,
          
          p: 2,
          transformOrigin: "top",
          borderRadius: 0,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          display: { xs: "block", md: "block" },
        },
      }}
    >
      <>
        <Typography sx={{ fontSize: 14 }}>Discover</Typography>

        <SearchBarComponentContent inputText={searchQuary} onSelect={onSelect} />
      </>
    </Popover>
  );
};

export default SearchBarComponent;
