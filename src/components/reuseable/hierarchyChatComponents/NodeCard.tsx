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
};
export const NodeCard = ({
  name,
  title,
  imageUrl,

  hasChildren,
  isExpanded,
  onToggle,
}: NodeCardProps) => (
  <Card
  elevation={2}
    sx={{
      background: customColor.bgColor,
      color: "#fff",
      borderRadius: 3,
      minWidth: 300,
      maxWidth: 300,
      boxShadow: 8,
      // px: 2,
      // py: 1.5,
      border: "1px solid #333",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      mx: "auto",
      // alignItems: "flex-end"
    }}
  >
    <CardContent
      sx={{
        display: "flex",
        alignItems: "center",
        // gap: 2,
        // pb: 1,
        // pt: 1,
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
        <div style={{ fontSize: 14, color: "#cbd5e1" }}>{title}</div>
        <div
          style={{
            marginTop: 6,
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {/* {tags?.map((tag: string) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{
                background: tagColors[tag] || "#64748b",
                color: "#23272f",
                fontWeight: 600,
                fontSize: 12,
                px: 1,
                height: 22,
              }}
            />
          ))} */}
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
