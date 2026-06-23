import { Avatar, IconButton } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

type NodeCardProps = {
  name: string;
  role: string;
  dept: string;
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
  role,
  dept,
  imageUrl,
  hasChildren,
  isExpanded,
  onToggle,
  highlightType,
  onMouseEnter,
  onMouseLeave,
}: NodeCardProps) => {
  const accentColor =
    highlightType === "self"
      ? "#facc15"
      : highlightType === "colleague"
      ? "#38bdf8"
      : highlightType === "child"
      ? "#4ade80"
      : highlightType === "ancestor"
      ? "#a78bfa"
      : "#2eacb3";

  const isHighlighted = Boolean(highlightType);

  return (
    <div
      style={{
        position: "relative",
        background: "#fff",
        borderRadius: 16,
        minWidth: 220,
        maxWidth: 220,
        border: `2px solid ${isHighlighted ? accentColor : "#e2e8f0"}`,
        boxShadow: isHighlighted
          ? `0 0 0 4px ${accentColor}28, 0 8px 24px rgba(0,0,0,0.12)`
          : "0 4px 16px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        margin: "auto",
        transition: "border 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Top accent bar */}
      <div
        style={{
          height: 4,
          borderRadius: "14px 14px 0 0",
          background: isHighlighted
            ? accentColor
            : "linear-gradient(90deg, #2eacb3, #00d4e4)",
        }}
      />

      {/* Card body */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 14px 24px 14px",
        }}
      >
        <Avatar
          alt={name}
          src={imageUrl}
          sx={{
            width: 54,
            height: 54,
            border: `3px solid ${accentColor}`,
            bgcolor: "#2eacb3",
            fontWeight: 700,
            fontSize: 20,
            flexShrink: 0,
            pointerEvents: "none",
            userSelect: "none",
            transition: "border-color 0.2s",
          }}
        >
          {name?.charAt(0)}
        </Avatar>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 13,
              color: "#1e293b",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {name}
          </div>
          {role && (
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                marginTop: 2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {role}
            </div>
          )}
          {dept && (
            <div
              style={{
                display: "inline-block",
                marginTop: 5,
                fontSize: 10,
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: 999,
                backgroundColor: isHighlighted ? `${accentColor}20` : "#e0f7fa",
                color: isHighlighted ? accentColor : "#0097a7",
                maxWidth: "100%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {dept}
            </div>
          )}
        </div>
      </div>

      {/* Expand / collapse button — same position as original so tree edges don't break */}
      {hasChildren && (
        <IconButton
          size="small"
          onClick={onToggle}
          sx={{
            position: "absolute",
            left: "50%",
            bottom: 8,
            transform: "translate(-50%, 50%)",
            bgcolor: "#1e293b",
            color: "#fff",
            width: 26,
            height: 26,
            "&:hover": { bgcolor: "#374151" },
            zIndex: 1,
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            transition: "background 0.15s",
          }}
        >
          {isExpanded ? (
            <KeyboardArrowUpIcon sx={{ fontSize: 18 }} />
          ) : (
            <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />
          )}
        </IconButton>
      )}
    </div>
  );
};
