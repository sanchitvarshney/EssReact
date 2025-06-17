import { Popover, Typography } from "@mui/material";
import SearchBarComponentContent from "./reuseable/SearchBarComponentContent";

interface Props {
  open: boolean;
  close: () => void;
  anchorRef: any;
  searchQuary: string;
}

const SearchBarComponent: React.FC<Props> = ({
  open,
  close,
  anchorRef,
  searchQuary,
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
          width: 533,
          maxHeight: 600,
          p: 2,
          transformOrigin: "top",
          borderRadius: 0,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          display: { xs: "none", md: "block" },
        },
      }}
    >
      <>
       
          <Typography sx={{ fontSize: 14 }}>
            Discover
          </Typography>
    
        <SearchBarComponentContent inputText={searchQuary} />
      </>
    </Popover>
  );
};

export default SearchBarComponent;
