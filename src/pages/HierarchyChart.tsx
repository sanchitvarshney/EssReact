import { Tree, TreeNode } from "react-organizational-chart";
import { Avatar, Card, CardContent } from "@mui/material";
import { Chip } from "@mui/material";
import { IconButton } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
// import PeopleIcon from "@mui/icons-material/People";
// import BusinessIcon from "@mui/icons-material/Business";

import type { JSX } from "react";

import {
  departmentData,
  type DepartmentNode,
} from "../dummydata/HierarchyData";
// import CustomToolTip from "../components/reuseable/CustomToolTip";
import { customColor } from "../constants/themeConstant";
import { DepartmentCard } from "../components/reuseable/hierarchyChatComponents/DepartmentCard";


import { RootEmployeeTree } from "../components/reuseable/hierarchyChatComponents/RootEmployeeTree";
import { EmployeeTree } from "../components/reuseable/hierarchyChatComponents/EmployeeTree";

import HierarchyChartSkeleton from "../skeleton/HierarchyChartSkeleton";
import { useAuth } from "../contextapi/AuthContext";

export const tagColors: Record<string, string> = {
  Leadership: "#60a5fa",
  Design: "#fbbf24",
  Development: "#86efac",
  Legal: "#a78bfa",
  HR: "#f87171",
  Product: "#f59e0b",
};

const HierarchyChart = () => {

  const  {hierarchyData,hierarchyLoading} = useAuth();
  
  const [zoom, setZoom] = useState(0.7);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>(
    {}
  );
  const [viewMode] = useState<"employee" | "department">("employee");
  const [nodeData, setNodeData] = useState<any>([]);

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  useEffect(() => {
    if (hierarchyData) {
      {
        hierarchyData[0].children.map((item:any) => {
           setExpandedNodes((prev) => ({
        ...prev,
        [item.id]: false,
        [item.id]: false,
      }))
        })
      }
    
      setNodeData(hierarchyData);
    }
  }, [hierarchyData]);

 

  const renderDepartmentTree = (node: DepartmentNode): JSX.Element => {
    const hasChildren = Boolean(node.children && node.children.length > 0);
    const isExpanded = expandedNodes[node.id] ?? true;

    return (
      <TreeNode
        label={
          <DepartmentCard
            name={node.name}
            title={node.title}
            imageUrl={node.imageUrl}
            tags={node.tags}
            employeeCount={node.employeeCount}
            hasChildren={hasChildren}
            isExpanded={isExpanded}
            onToggle={() => toggleNode(node.id)}
          />
        }
        key={node.id}
      >
        {isExpanded &&
          hasChildren &&
          (node.children ?? []).map(renderDepartmentTree)}
      </TreeNode>
    );
  };

  const renderDepartmentRoot = () => (
    <div className="flex justify-center">
      <Card
        sx={{
          background: customColor.bgColor,
          color: "#fff",
          borderRadius: 3,
          minWidth: 280,
          maxWidth: 320,
          boxShadow: 6,
          border: "1px solid #333",
          position: "relative",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            pb: 1,
            pt: 1,
          }}
        >
          <Avatar
            alt={departmentData.name}
            src={departmentData.imageUrl}
            sx={{
              width: 48,
              height: 48,
              border: "2px solid #444",
              backgroundColor: "#2eacb3",
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 18 }}>
              {departmentData.name}
            </div>
            <div style={{ fontSize: 14, color: "#cbd5e1" }}>
              {departmentData.title}
            </div>
            <div
              style={{
                marginTop: 6,
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
              }}
            >
              {departmentData.tags?.map((tag: string) => (
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
                label={`${departmentData.employeeCount} employees`}
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
            <div className="mt-4">
              {departmentData.children &&
                departmentData.children.length > 0 && (
                  <IconButton
                    size="small"
                    onClick={() => toggleNode(departmentData.id)}
                    sx={{
                      position: "absolute",
                      left: "50%",
                      bottom: 3,
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
                    {expandedNodes[departmentData.id] ?? true ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </IconButton>
                )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const rootNode = useMemo(
    () => (Array.isArray(nodeData) && nodeData.length > 0 ? nodeData[0] : null),
    [nodeData]
  );

  const rootNodeId = rootNode?.id || "root";

  if (hierarchyLoading) {
    return <HierarchyChartSkeleton />;
  }

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

      <div className="overflow-auto p-4 h-[calc(100vh-150px)]  flex  flex-col">
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
                ? rootNode && (
                    <RootEmployeeTree
                      toggleNode={toggleNode}
                      expandedNodes={expandedNodes}
                      node={rootNode}
                    />
                  )
                : renderDepartmentRoot()
            }
          >
            {viewMode === "employee"
              ? (expandedNodes[rootNodeId] ?? true) &&
                rootNode?.children?.map((item: any) => (
                  <EmployeeTree
                    key={item.id}
                    toggleNode={toggleNode}
                    expandedNodes={expandedNodes}
                    node={item}
                  />
                ))
              : (expandedNodes[departmentData.id] ?? true) &&
                (departmentData.children ?? []).map(renderDepartmentTree)}
          </Tree>
        </div>
      </div>
    </>
  );
};

export default HierarchyChart;
