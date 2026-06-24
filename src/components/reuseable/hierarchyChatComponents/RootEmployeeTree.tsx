import { Avatar, IconButton } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import type { FC } from "react";

type RootEmployeeTreeProps = {
  toggleNode: any;
  expandedNodes: any;
  node: any;
  highlightType?: "self" | "colleague" | "child" | "ancestor";
  onHover?: () => void;
  onUnhover?: () => void;
};

export const RootEmployeeTree: FC<RootEmployeeTreeProps> = ({
  toggleNode,
  expandedNodes,
  node,
  highlightType,
  onHover,
  onUnhover,
}) => {
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
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          position: "relative",
          background: "#fff",
          borderRadius: 20,
          minWidth: 250,
          maxWidth: 250,
          border: `2.5px solid ${isHighlighted ? accentColor : "#e2e8f0"}`,
          boxShadow: isHighlighted
            ? `0 0 0 5px ${accentColor}28, 0 12px 36px rgba(0,0,0,0.15)`
            : "0 8px 32px rgba(0,0,0,0.1)",
          transition: "border 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={onHover}
        onMouseLeave={onUnhover}
      >
        {/* Gradient header area */}
        <div
          style={{
            background: isHighlighted
              ? `linear-gradient(135deg, ${accentColor}30, ${accentColor}10)`
              : "linear-gradient(135deg, #e0f7fa 0%, #f0fdfe 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            padding: "20px 20px 30px",
              borderRadius: 20,
          }}
        >
          {/* Avatar with premium badge */}
          <div style={{ position: "relative" }}>
            <Avatar
              src={node?.imageUrl}
              alt={node?.name}
              sx={{
                width: 72,
                height: 72,
                border: `3px solid ${accentColor}`,
                bgcolor: "#2eacb3",
                fontWeight: 700,
                fontSize: 26,
                pointerEvents: "none",
                userSelect: "none",
                boxShadow: `0 4px 16px ${accentColor}50`,
                transition: "border-color 0.2s",
              }}
            >
              {node?.name?.charAt(0)}
            </Avatar>
            <div
              style={{
                position: "absolute",
                bottom: -2,
                right: -2,
                width: 22,
                height: 22,
                borderRadius: "50%",
                backgroundColor: accentColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #fff",
              }}
            >
              <WorkspacePremiumIcon
                sx={{ fontSize: 12, color: highlightType === "self" ? "#000" : "#fff" }}
              />
            </div>
          </div>

          {/* Name & title */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b", lineHeight: 1.3 }}>
              {node?.name || "Employee"}
            </div>
            {node?.title && (
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                {node.title}
              </div>
            )}
          </div>

          {/* Badge */}
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: "3px 12px",
              borderRadius: 999,
              backgroundColor: isHighlighted ? `${accentColor}25` : "#ccf2f5",
              color: isHighlighted ? accentColor : "#0097a7",
            }}
          >
            Organization Head
          </div>
        </div>

        {/* Expand / collapse button — same absolute position as original */}
        {node?.children && node.children.length > 0 && (
          <IconButton
            size="small"
            onClick={() => toggleNode(node.id)}
            sx={{
              position: "absolute",
              left: "50%",
              bottom: 8,
              transform: "translate(-50%, 50%)",
              bgcolor: "#1e293b",
              color: "#fff",
              width: 30,
              height: 30,
              "&:hover": { bgcolor: "#374151" },
              zIndex: 1,
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
              transition: "background 0.15s",
            }}
          >
            {expandedNodes[node.id] ?? true ? (
              <KeyboardArrowUpIcon sx={{ fontSize: 20 }} />
            ) : (
              <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
            )}
          </IconButton>
        )}
      </div>
    </div>
  );
};
