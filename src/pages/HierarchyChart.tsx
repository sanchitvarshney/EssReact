import { Tree,  } from "react-organizational-chart";
// import { Avatar, Card, CardContent } from "@mui/material";
// import { Chip } from "@mui/material";
import { IconButton } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
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
    <>
      <div
        className="w-full h-15 flex justify-between items-center p-4"
        style={{
          // width: "70%",
          backgroundColor: "transparent",

          gap: 8,

          zIndex: 99,
        }}
      >
        <div className="flex gap-2">
            <div key={""} className="flex items-center space-x-2 mb-1">
                  <div className={`w-3 h-3 rounded-full bg-[#a78bfa]`} />
                  <span className=" select-none ">Mentor</span>
                </div>
                  <div key={""} className="flex items-center space-x-2 mb-1">
                  <div className={`w-3 h-3 rounded-full bg-[#4ade80]`} />
                  <span className=" select-none ">Associate</span>
                </div>
                  <div key={""} className="flex items-center space-x-2 mb-1">
                  <div className={`w-3 h-3 rounded-full bg-[#38bdf8]`} />
                  <span className=" select-none ">Colleague</span>
                </div>
                  <div key={""} className="flex items-center space-x-2 mb-1">
                  <div className={`w-3 h-3 rounded-full bg-[#facc15]`} />
                  <span className=" select-none ">Self</span>
                </div>
          {/* <CustomToolTip title={"Employee Hierarchy"} placement={"bottom"}>
            <IconButton
              onClick={() => setViewMode("employee")}
              size="small"
              sx={{
                color: viewMode === "employee" ? "#fff" : "#9ca3af",
                background: viewMode === "employee" ? "#2eacb3" : "gray",
                "&:hover": {
                  backgroundColor:
                    viewMode === "employee" ? "#2eacb3" : "#374151",
                },
                borderRadius: "6px",
                padding: "8px",
              }}
            >
              <PeopleIcon sx={{ color: "#fff" }} />
            </IconButton>
          </CustomToolTip> */}
          {/* <CustomToolTip title={"Department Hierarchy"} placement={"bottom"}>
            <IconButton
              onClick={() => setViewMode("department")}
              size="small"
              sx={{
                color: viewMode === "department" ? "#fff" : "#9ca3af",
                background: viewMode === "department" ? "#2eacb3" : "gray",
                "&:hover": {
                  backgroundColor:
                    viewMode === "department" ? "#2eacb3" : "#374151",
                },
                borderRadius: "6px",
                padding: "8px",
              }}
            >
              <BusinessIcon sx={{ color: "#fff" }} />
            </IconButton>
          </CustomToolTip> */}
        </div>
        <div className="flex gap-2 items-center">
          <IconButton
            onClick={() => setZoom((z) => Math.min(z + 0.1, 2))}
            size="small"
            sx={{
              color: "#fff",
              background: "#000000",
              "&:hover": {
                backgroundColor: "#4b5563",
              },
            }}
          >
            <ZoomInIcon />
          </IconButton>
          <IconButton
            onClick={() => setZoom((z) => Math.max(z - 0.1, 0.5))}
            size="small"
            sx={{
              color: "#fff",
              background: "#000000",
              "&:hover": {
                backgroundColor: "#4b5563",
              },
            }}
          >
            <ZoomOutIcon />
          </IconButton>
          <span
            style={{
              color: "#000",
              fontWeight: 500,
              fontSize: 18,
              marginLeft: 8,
            }}
          >
            {Math.round(zoom * 100)}%
          </span>
        </div>
      </div>

      <div className="overflow-auto p-4 h-[calc(100vh-150px)]  flex  flex-col will-change-transform">
        <div
          style={{
            height: "100%",
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
            transition: "transform 0.2s",
            marginRight: "300px",
          }}
        >
          <Tree
            lineWidth={"3px"}
            lineColor={viewMode === "employee" ? "#444" : "#475569"}
            lineBorderRadius={"20px"}
            label={
              viewMode === "employee"
                && rootNode && (
                    <RootEmployeeTree
                      toggleNode={toggleNode}
                      expandedNodes={expandedNodes}
                      node={rootNode}
                      highlightType={hoveredNodeId === rootNode.id ? "self" : undefined}
                      onHover={() => setHoveredNodeId(rootNode.id)}
                      onUnhover={() => setHoveredNodeId(null)}
                    />
                  )
                // : renderDepartmentRoot()
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
    </>
  );
};

export default HierarchyChart;
