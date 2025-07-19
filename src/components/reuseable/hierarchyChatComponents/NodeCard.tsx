import { Avatar, Card, CardContent,  IconButton } from "@mui/material";
import { customColor } from "../../../constants/themeConstant";
// import { tagColors } from "../../../pages/HierarchyChart";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

type NodeCardProps = {
  name: string;
  title: string;
  imageUrl: string;
  tags: string[];
  hasChildren: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  highlightType?: "self" | "colleague" | "child" | "ancestor";
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};
export const NodeCard = ({
  name,
  title,
  imageUrl,
  hasChildren,
  isExpanded,
  onToggle,
  highlightType,
  onMouseEnter,
  onMouseLeave,
}: NodeCardProps) => {
  let highlightColor = undefined;
  if (highlightType === "self") highlightColor = "#facc15"; // yellow
  else if (highlightType === "colleague") highlightColor = "#38bdf8"; // blue
  else if (highlightType === "child") highlightColor = "#4ade80"; // green
  else if (highlightType === "ancestor") highlightColor = "#a78bfa"; // purple

  return (
    <Card
      elevation={2}
      sx={{
        background: highlightColor || customColor.bgColor,
        color: highlightType ? "#000" : "#fff",
        borderRadius: 3,
        minWidth: 300,
        maxWidth: 300,
        boxShadow: 8,
        border: highlightColor ? `2.5px solid ${highlightColor}` : "1px solid #333",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        mx: "auto",
        transition: "background 0.2s, border 0.2s, color 0.2s",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          mb: 1,
        }}
      >
        <Avatar
          alt={name}
          src={imageUrl}
          sx={{
            width: 90,
            height: 90,
            border: "2px solid #444",
            backgroundColor: "#2eacb3",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 18 }}>{name}</div>
          <div style={{ fontSize: 14, color: highlightType ? "#000" : "#cbd5e1" }}>{title}</div>
          <div
            style={{
              marginTop: 6,
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {/* tags */}
          </div>
        </div>
      </CardContent>
      {hasChildren && (
        <IconButton
          size="small"
          onClick={onToggle}
          sx={{
            position: "absolute",
            left: "50%",
            bottom: 8,
            transform: "translate(-50%, 50%)",
            background: "#1f2937",
            color: "#fff",
            "&:hover": { background: "#374151" },
            zIndex: 1,
            width: 32,
            height: 32,
            fontSize: 20,
            fontWeight: "bold",
            mt: 1,
          }}
        >
          {isExpanded ? (
            <KeyboardArrowUpIcon sx={{ fontSize: 45 }} />
          ) : (
            <KeyboardArrowDownIcon sx={{ fontSize: 45 }} />
          )}
        </IconButton>
      )}
    </Card>
  );
};
