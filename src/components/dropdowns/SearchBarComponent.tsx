import { Popover } from "@mui/material";
import SearchBarComponentContent from "../SearchBarComponentContent";

interface Props {
  open: boolean;
  close: () => void;
  anchorRef: any;
  searchQuary: string;
  width: string;
  onSelect?: (user: any) => void;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}

const SearchBarComponent: React.FC<Props> = ({
  open,
  close,
  anchorRef,
  searchQuary,
  width,
  onSelect,
  selectedIndex,
  setSelectedIndex,
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
          zIndex: 999,
          p: 2,
          transformOrigin: "top",
          borderRadius: 0,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          display: { xs: "block", md: "block" },
        },
      }}
    >
      <SearchBarComponentContent
        inputText={searchQuary}
        onSelect={onSelect}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
      />
    </Popover>
  );
};

export default SearchBarComponent;
