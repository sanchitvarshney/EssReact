import { Tree, TreeNode } from "react-organizational-chart";
import { Avatar, CircularProgress } from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useState, type JSX } from "react";
import { useHierarchy } from "../contextapi/hierarchyProvider";

const findPathToId = (root: any, id: string, path: any): any => {
  if (!root?.empcode) {
    root = { ...root?.[0], empcode: "bod" };
  }
  if (root?.empcode === id) return [...path, root];
  for (const child of root?.children ?? []) {
    const result = findPathToId(child, id, [...path, root]);
    if (result) return result;
  }
  return null;
};

/* ── Node card — light teal theme ── */
type NodeCardProps = {
  name: string;
  role: string;
  dept: string;
  imageUrl: string;
  highlighted?: boolean;
};

const NodeCard = ({ name, role, dept, imageUrl, highlighted }: NodeCardProps) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 16,
      minWidth: 220,
      maxWidth: 220,
      border: `2px solid ${highlighted ? "#2eacb3" : "#e2e8f0"}`,
      boxShadow: highlighted
        ? "0 0 0 4px rgba(46,172,179,0.15), 0 8px 24px rgba(0,0,0,0.1)"
        : "0 4px 16px rgba(0,0,0,0.06)",
      display: "flex",
      flexDirection: "column",
      margin: "auto",
      transition: "border 0.2s, box-shadow 0.2s",
    }}
  >
    {/* Top accent bar */}
    <div
      style={{
        height: 4,
        borderRadius: "14px 14px 0 0",
        background: highlighted
          ? "#2eacb3"
          : "linear-gradient(90deg, #2eacb3, #00d4e4)",
      }}
    />

    {/* Body */}
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px 14px" }}>
      <Avatar
        alt={name}
        src={imageUrl}
        sx={{
          width: 48,
          height: 48,
          border: `2.5px solid ${highlighted ? "#2eacb3" : "#e2e8f0"}`,
          backgroundColor: "#2eacb3",
          pointerEvents: "none",
          userSelect: "none",
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        {name?.charAt(0)}
      </Avatar>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: 13,
            color: highlighted ? "#0097a7" : "#1e293b",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {name}
        </div>
        {role && (
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {role}
          </div>
        )}
        {dept && (
          <div
            style={{
              marginTop: 4,
              display: "inline-block",
              fontSize: 10,
              fontWeight: 600,
              color: highlighted ? "#0097a7" : "#64748b",
              backgroundColor: highlighted ? "#e0f7fa" : "#f1f5f9",
              padding: "1px 8px",
              borderRadius: 99,
            }}
          >
            {dept}
          </div>
        )}
      </div>
    </div>
  </div>
);

const renderTree = (
  node: any,
  selectedId: string,
  visibleIds: Set<string>
): JSX.Element | null => {
  if (!visibleIds.has(node.empcode)) return null;
  return (
    <TreeNode
      label={
        <NodeCard
          name={node.name}
          role={node.other?.designation}
          dept={node.other?.department}
          imageUrl={node.imageUrl}
          highlighted={node.empcode === selectedId}
        />
      }
      key={node.id}
    >
      {(node.children ?? []).map((child: any) =>
        renderTree(child, selectedId, visibleIds)
      )}
    </TreeNode>
  );
};

const EmployeeHierarchyPage = ({ userId }: { userId: any }) => {
  const { hierarchyData, hierarchyLoading } = useHierarchy();
  const [zoom, setZoom] = useState(0.8);

  const path = findPathToId(hierarchyData, userId, hierarchyData) ?? [];
  const visibleIds: any = new Set(path?.map((node: any) => node.empcode));

  const findChildren = (node: any, ids: Set<string>) => {
    ids.add(node.empcode);
    for (const child of node.children ?? []) findChildren(child, ids);
  };

  const selectedNode = path[path.length - 1];
  if (selectedNode) findChildren(selectedNode, visibleIds);

  if (hierarchyLoading) {
    return (
      <div className="w-full flex flex-col h-48 justify-center items-center gap-3">
        <CircularProgress sx={{ color: "#2eacb3" }} size={32} />
        <p className="text-xs text-gray-400 font-medium">Loading hierarchy…</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col relative">
      {/* Zoom controls */}
      <div className="absolute top-2 right-2 z-50 flex items-center gap-0.5 bg-white border border-gray-100 shadow-sm rounded-xl p-1">
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.1, 2))}
          title="Zoom in"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-[#e0f7fa] hover:text-[#2eacb3] transition-all"
        >
          <ZoomInIcon sx={{ fontSize: 18 }} />
        </button>
        <span className="text-xs font-bold text-gray-700 w-12 text-center tabular-nums select-none">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.1, 0.5))}
          title="Zoom out"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-[#e0f7fa] hover:text-[#2eacb3] transition-all"
        >
          <ZoomOutIcon sx={{ fontSize: 18 }} />
        </button>
        <div className="w-px h-5 bg-gray-200 mx-0.5" />
        <button
          onClick={() => setZoom(0.8)}
          title="Reset zoom"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-[#e0f7fa] hover:text-[#2eacb3] transition-all"
        >
          <RestartAltIcon sx={{ fontSize: 18 }} />
        </button>
      </div>

      {/* Chart */}
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top center",
          transition: "transform 0.2s",
          paddingTop: 48,
          paddingBottom: 24,
        }}
      >
        <Tree
          lineWidth="2px"
          lineColor="#cbd5e1"
          lineBorderRadius="12px"
          label={
            <div className="flex justify-center">
              <div
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  minWidth: 250,
                  maxWidth: 250,
                  border: "2px solid #e2e8f0",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                  margin: "auto",
                }}
              >
                <div
                  style={{
                    height: 4,
                    background: "linear-gradient(90deg, #2eacb3, #00d4e4)",
                    borderRadius: "18px 18px 0 0",
                  }}
                />
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
                  <Avatar
                    alt={hierarchyData?.[0]?.name}
                    src={hierarchyData?.[0]?.imageUrl}
                    sx={{
                      width: 56,
                      height: 56,
                      border: "3px solid #e0f7fa",
                      backgroundColor: "#2eacb3",
                      pointerEvents: "none",
                      userSelect: "none",
                      fontSize: 20,
                      fontWeight: 700,
                    }}
                  >
                    {hierarchyData?.[0]?.name?.charAt(0)}
                  </Avatar>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {hierarchyData?.[0]?.name}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                      {hierarchyData?.[0]?.title}
                    </div>
                    <div style={{ marginTop: 4, display: "inline-block", fontSize: 10, fontWeight: 600, color: "#0097a7", backgroundColor: "#e0f7fa", padding: "1px 8px", borderRadius: 99 }}>
                      Organization Head
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        >
          {(hierarchyData?.[0]?.children ?? []).map((child: any) =>
            renderTree(child, userId, visibleIds)
          )}
        </Tree>
      </div>
    </div>
  );
};

export default EmployeeHierarchyPage;
