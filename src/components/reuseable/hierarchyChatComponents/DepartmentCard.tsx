import { Avatar, Card, CardContent, Chip, IconButton } from "@mui/material";
import { customColor } from "../../../constants/themeConstant";
import { tagColors } from "../../../pages/HierarchyChart";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
type DepartmentCardProps = {
  name: string;
  title: string;
  imageUrl: string;
  tags: string[];
  employeeCount: number;
  hasChildren: boolean;
  isExpanded: boolean;
  onToggle: () => void;
};

export const DepartmentCard = ({
  name,
  title,
  imageUrl,
  tags,
  employeeCount,
  hasChildren,
  isExpanded,
  onToggle,
}: DepartmentCardProps) => (
  <Card
    sx={{
      background: customColor.bgColor,
      color: "#fff",
      borderRadius: 3,
      minWidth: 280,
      maxWidth: 320,
      boxShadow: 6,
      px: 2,
      py: 1.5,
      border: "1px solid #333",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      mx: "auto",
    }}
  >
    <CardContent
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        pb: 1,
        pt: 1,
        width: "100%",
      }}
    >
      <Avatar
        alt={name}
        src={imageUrl}
        sx={{
          width: 48,
          height: 48,
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
          {tags?.map((tag: string) => (
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
          ))}
          <Chip
            label={`${employeeCount} employees`}
            size="small"
            sx={{
              background: "#10b981",
              color: "#fff",
              fontWeight: 600,
              fontSize: 11,
              px: 1,
              height: 20,
            }}
          />
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
          bottom: 4,
          transform: "translate(-50%, 50%)",
          background: "#334155",
          color: "#fff",
          "&:hover": { background: "#475569" },
          zIndex: 1,
          width: 32,
          height: 32,
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </IconButton>
    )}
  </Card>
);
