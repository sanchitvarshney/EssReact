import { Tree,  } from "react-organizational-chart";
import { Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
// import PeopleIcon from "@mui/icons-material/People";
// import BusinessIcon from "@mui/icons-material/Business";

import type { JSX } from "react";

// import {
//   departmentData,
//   type DepartmentNode,
// } from "../dummydata/HierarchyData";
// import CustomToolTip from "../components/reuseable/CustomToolTip";
// import { customColor } from "../constants/themeConstant";
// import { DepartmentCard } from "../components/reuseable/hierarchyChatComponents/DepartmentCard";

import { RootEmployeeTree } from "../components/reuseable/hierarchyChatComponents/RootEmployeeTree";
import { EmployeeTree } from "../components/reuseable/hierarchyChatComponents/EmployeeTree";

import HierarchyChartSkeleton from "../skeleton/HierarchyChartSkeleton";

import { useHierarchy } from "../contextapi/hierarchyProvider";

export const tagColors: Record<string, string> = {
  Leadership: "#60a5fa",
  Design: "#fbbf24",
  Development: "#86efac",
  Legal: "#a78bfa",
  HR: "#f87171",
  Product: "#f59e0b",
};

const HierarchyChart = () => {
  const { hierarchyData, hierarchyLoading } = useHierarchy();
 

  const [zoom, setZoom] = useState(0.7);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>(
    {}
  );
  const [viewMode] = useState<"employee" | "department">("employee");
  const [nodeData, setNodeData] = useState<any>([]);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const chartScrollRef = useRef<HTMLDivElement>(null);
  const hasCenteredRef = useRef(false);

  const toggleNode = (id: string) => {
   
    setExpandedNodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getAllNodeIds = (nodes: any[]): string[] => {
    let ids: string[] = [];
    nodes.forEach((node) => {
      ids.push(node.id);
      if (node.children && node.children.length > 0) {
        ids = ids.concat(getAllNodeIds(node.children));
      }
    });
    return ids;
  };

  useEffect(() => {
    if (hierarchyData && hierarchyData.length > 0) {
      const allIds = getAllNodeIds(hierarchyData);
      const initialExpanded: Record<string, boolean> = {};

      initialExpanded[hierarchyData[0].id] = true;

      allIds.forEach((id) => {
        if (!(id in initialExpanded)) {
          initialExpanded[id] = false;
        }
      });
      setExpandedNodes(initialExpanded);
      setNodeData(hierarchyData);
    }
  }, [hierarchyData]);

  useEffect(() => {
    if (nodeData.length === 0 || hasCenteredRef.current) return;
    const el = chartScrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
      hasCenteredRef.current = true;
    });
  }, [nodeData]);

  // const renderDepartmentTree = (node: DepartmentNode): JSX.Element => {
  //   const hasChildren = Boolean(node.children && node.children.length > 0);
  //   const isExpanded = expandedNodes[node.id] ?? true;

  //   return (
  //     <TreeNode
  //       label={
  //         <DepartmentCard
  //           name={node.name}
  //           title={node.title}
  //           imageUrl={node.imageUrl}
  //           tags={node.tags}
  //           employeeCount={node.employeeCount}
  //           hasChildren={hasChildren}
  //           isExpanded={isExpanded}
  //           onToggle={() => toggleNode(node.id)}
  //         />
  //       }
  //       key={node.id}
  //     >
  //       {isExpanded &&
  //         hasChildren &&
  //         (node.children ?? []).map(renderDepartmentTree)}
  //     </TreeNode>
  //   );
  // };

  // const renderDepartmentRoot = () => (
  //   <div className="flex justify-center">
  //     <Card
  //       sx={{
  //         background: customColor.bgColor,
  //         color: "#fff",
  //         borderRadius: 3,
  //         minWidth: 280,
  //         maxWidth: 320,
  //         boxShadow: 6,
  //         border: "1px solid #333",
  //         position: "relative",
  //       }}
  //     >
  //       <CardContent
  //         sx={{
  //           display: "flex",
  //           alignItems: "center",
  //           gap: 2,
  //           pb: 1,
  //           pt: 1,
  //         }}
  //       >
  //         <Avatar
  //           alt={departmentData.name}
  //           src={departmentData.imageUrl}
  //           sx={{
  //             width: 48,
  //             height: 48,
  //             border: "2px solid #444",
  //             backgroundColor: "#2eacb3",
  //             pointerEvents: "none",
  //             userSelect: "none",
  //           }}
  //         />
  //         <div style={{ flex: 1 }}>
  //           <div style={{ fontWeight: 600, fontSize: 18 }}>
  //             {departmentData.name}
  //           </div>
  //           <div style={{ fontSize: 14, color: "#cbd5e1" }}>
  //             {departmentData.title}
  //           </div>
  //           <div
  //             style={{
  //               marginTop: 6,
  //               display: "flex",
  //               gap: 6,
  //               flexWrap: "wrap",
  //             }}
  //           >
  //             {departmentData.tags?.map((tag: string) => (
  //               <Chip
  //                 key={tag}
  //                 label={tag}
  //                 size="small"
  //                 sx={{
  //                   background: tagColors[tag] || "#64748b",
  //                   color: "#23272f",
  //                   fontWeight: 600,
  //                   fontSize: 12,
  //                   px: 1,
  //                   height: 22,
  //                 }}
  //               />
  //             ))}
  //             <Chip
  //               label={`${departmentData.employeeCount} employees`}
  //               size="small"
  //               sx={{
  //                 background: "#10b981",
  //                 color: "#fff",
  //                 fontWeight: 600,
  //                 fontSize: 11,
  //                 px: 1,
  //                 height: 20,
  //               }}
  //             />
  //           </div>
  //           <div className="mt-4">
  //             {departmentData.children &&
  //               departmentData.children.length > 0 && (
  //                 <IconButton
  //                   size="small"
  //                   onClick={() => toggleNode(departmentData.id)}
  //                   sx={{
  //                     position: "absolute",
  //                     left: "50%",
  //                     bottom: 3,
  //                     transform: "translate(-50%, 50%)",
  //                     background: "#334155",
  //                     color: "#fff",
  //                     "&:hover": { background: "#475569" },
  //                     zIndex: 1,
  //                     width: 32,
  //                     height: 32,
  //                     fontSize: 20,
  //                     fontWeight: "bold",
  //                   }}
  //                 >
  //                   {expandedNodes[departmentData.id] ?? true ? (
  //                     <KeyboardArrowUpIcon />
  //                   ) : (
  //                     <KeyboardArrowDownIcon />
  //                   )}
  //                 </IconButton>
  //               )}
  //           </div>
  //         </div>
  //       </CardContent>
  //     </Card>
  //   </div>
  // );

  const rootNode = useMemo(
    () => (Array.isArray(nodeData) && nodeData.length > 0 ? nodeData[0] : null),
    [nodeData]
  );

  const rootNodeId = rootNode?.id || "root";

  if (hierarchyLoading) {
    return <HierarchyChartSkeleton />;
  }

 

  const renderEmployeeTree = (
    node: any,
    parentId: string | null,
    siblings: any[],
   
  ): JSX.Element => {
    const hasChildren = Boolean(node.children && node.children.length > 0);
    const isExpanded = expandedNodes[node.id] ?? true;

    // Determine highlightType based on hoveredNodeId
    let highlightType: "self" | "child" | "colleague" | "ancestor" | undefined = undefined;
    if (hoveredNodeId) {
      if (node.id === hoveredNodeId) highlightType = "self";
      else if (parentId && parentId === hoveredNodeId) highlightType = "child";
      else if (siblings.some((s: any) => s.id === hoveredNodeId)) highlightType = "colleague";
      else if (node.children?.some((c: any) => c.id === hoveredNodeId)) highlightType = "ancestor";
    }

    return (
      <EmployeeTree
        key={node.id}
        toggleNode={toggleNode}
        expandedNodes={expandedNodes}
        node={node}
        highlightType={highlightType}
        onHover={() => setHoveredNodeId(node.id)}
        onUnhover={() => setHoveredNodeId(null)}
      >
        {isExpanded && hasChildren &&
          node.children.map((child: any) =>
            renderEmployeeTree(
              child,
              node.id,
              node.children.filter((n: any) => n.id !== child.id)
            )
          )
        }
      </EmployeeTree>
    );
  };

  return (
    <div className="h-[calc(100vh-78px)] flex flex-col overflow-hidden px-3 py-4 w-full">

      {/* Page header */}
      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        <div className="w-1 h-7 rounded-full bg-[#2eacb3]" />
        <AccountTreeIcon sx={{ fontSize: 20, color: "#2eacb3" }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b", fontSize: 18 }}>
          Organization Chart
        </Typography>
      </div>

      {/* Toolbar card */}
      <div className="flex-shrink-0 mb-3 bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-2.5 flex items-center justify-between gap-4">

        {/* Legend */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {[
          
            { color: "#38bdf8", label: "Colleague" },
            { color: "#4ade80", label: "Associate" },
            { color: "#a78bfa", label: "Mentor" },
          ].map(({ color, label }) => (
            <span
              key={label}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold select-none border"
              style={{ backgroundColor: `${color}18`, borderColor: `${color}50`, color: "#374151" }}
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              {label}
            </span>
          ))}
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1 bg-gray-50 rounded-xl border border-gray-200 p-1">
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.1, 0.3))}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-white hover:text-[#2eacb3] hover:shadow-sm transition-all duration-150"
            title="Zoom out"
          >
            <ZoomOutIcon sx={{ fontSize: 18 }} />
          </button>

          <span className="w-12 text-center text-xs font-bold text-gray-700 select-none tabular-nums">
            {Math.round(zoom * 100)}%
          </span>

          <button
            onClick={() => setZoom((z) => Math.min(z + 0.1, 2))}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-white hover:text-[#2eacb3] hover:shadow-sm transition-all duration-150"
            title="Zoom in"
          >
            <ZoomInIcon sx={{ fontSize: 18 }} />
          </button>

          <div className="w-px h-5 bg-gray-200 mx-0.5" />

          <button
            onClick={() => setZoom(0.7)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-white hover:text-[#2eacb3] hover:shadow-sm transition-all duration-150"
            title="Reset zoom"
          >
            <RestartAltIcon sx={{ fontSize: 18 }} />
          </button>
        </div>
      </div>

      {/* Chart scroll area */}
      <div
        ref={chartScrollRef}
        className="flex-1 overflow-auto custom-scrollbar-for-menu bg-white rounded-2xl border border-gray-100 shadow-sm"
        style={{ minHeight: 0 }}
      >
        <div
          style={{
            display: "inline-block",
            minWidth: "100%",
            padding: "40px 60px",
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
            transition: "transform 0.2s",
          }}
        >
          <Tree
            lineWidth={"2px"}
            lineColor={"#cbd5e1"}
            lineBorderRadius={"16px"}
            label={
              viewMode === "employee" && rootNode && (
                <RootEmployeeTree
                  toggleNode={toggleNode}
                  expandedNodes={expandedNodes}
                  node={rootNode}
                  highlightType={hoveredNodeId === rootNode.id ? "self" : undefined}
                  onHover={() => setHoveredNodeId(rootNode.id)}
                  onUnhover={() => setHoveredNodeId(null)}
                />
              )
            }
          >
            {viewMode === "employee" && rootNode && (expandedNodes[rootNodeId] ?? true)
              ? rootNode.children?.map((child: any) =>
                  renderEmployeeTree(
                    child,
                    rootNode.id,
                    rootNode.children.filter((n: any) => n.id !== child.id)
                  )
                )
              : null}
          </Tree>
        </div>
      </div>
    </div>
  );
};

export default HierarchyChart;
