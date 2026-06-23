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
  shouldNavigateOnSelect?: boolean;
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
  shouldNavigateOnSelect = true,
}) => {
  return (
    <Popover
      open={open}
      anchorEl={anchorRef?.current || null}
      onClose={close}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      disableAutoFocus
      disableEnforceFocus
      PaperProps={{
        sx: {
          mt: "8px",
          width: width,
          zIndex: 999,
          borderRadius: 3,
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          p: 0,
        },
      }}
    >
      <SearchBarComponentContent
        inputText={searchQuary}
        onSelect={onSelect}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        shouldNavigateOnSelect={shouldNavigateOnSelect}
      />
    </Popover>
  );
};

export default SearchBarComponent;
