import { Popover, MenuItem, Typography } from "@mui/material";

interface Props {
  open: boolean;
  close: () => void;
  anchorRef: any;
}

const SearchBarComponent: React.FC<Props> = ({ open, close, anchorRef }) => {
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
          width: 300,
          height: 400,
          p: 2,
        },
      }}
    >
      <Typography variant="subtitle1" sx={{ textAlign: "center", mb: 1 }}>
        SearchBarComponent
      </Typography>
      <MenuItem onClick={close}>Item 1</MenuItem>
      <MenuItem onClick={close}>Item 2</MenuItem>
      <MenuItem onClick={close}>Item 3</MenuItem>
    </Popover>
  );
};

export default SearchBarComponent;
