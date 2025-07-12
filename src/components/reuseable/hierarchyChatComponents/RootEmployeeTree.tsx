import { Avatar, Card, CardContent, IconButton } from "@mui/material";
import { customColor } from "../../../constants/themeConstant";
// import { tagColors } from "../../../pages/HierarchyChart";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import type { FC } from "react";

type RootEmployeeTreeProps = {
  toggleNode: any;
  expandedNodes: any;
  node: any;
  
};
export const RootEmployeeTree: FC<RootEmployeeTreeProps> = ({
  toggleNode,
  expandedNodes,
  node,
}) => {
  return (
    <div className="flex justify-center">
      <Card
        elevation={2}
        sx={{
          background: customColor.bgColor,
          color: "#fff",
          borderRadius: 3,
          minWidth: 300,
          maxWidth: 300,
          boxShadow: 8,
          border: "1px solid #333",
          position: "relative",
        }}
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
            alt={node?.imageAlt}
            src={node?.imageUrl}
            sx={{
              width: 90,
              height: 90,
              border: "2px solid #444",
              backgroundColor: "#2eacb3",
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 18 }}>
              {node?.name || "Employee"}
            </div>
            <div style={{ fontSize: 14, color: "#cbd5e1" }}>
              {node?.title || "Position"}
            </div>
            <div
              style={{
                marginTop: 6,
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
              }}
            ></div>
            <div className="mt-4">
              {node?.children && node.children.length > 0 && (
                <IconButton
                  size="small"
                  onClick={() => toggleNode(node.id)}
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
                  }}
                >
                  {expandedNodes[node.id] ?? true ? (
                    <KeyboardArrowUpIcon sx={{ fontSize: 45 }} />
                  ) : (
                    <KeyboardArrowDownIcon sx={{ fontSize: 45 }} />
                  )}
                </IconButton>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
