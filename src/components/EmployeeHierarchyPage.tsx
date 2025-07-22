import { Tree, TreeNode } from "react-organizational-chart";
import {
  Avatar,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
} from "@mui/material";


import { useState, type JSX } from "react";

import { useHierarchy } from "../contextapi/hierarchyProvider";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";

const findPathToId = (root: any, id: string, path: any): any => {
  if (!root?.empcode) {
    root = {
      ...root?.[0],
      empcode: "bod",
    };
  }
  if (root?.empcode === id) return [...path, root];

  for (const child of root?.children ?? []) {
    const result = findPathToId(child, id, [...path, root]);

    if (result) return result;
  }

  return null;
};


type NodeCardProps = {
  name: string;
  role: string;
    dept: string;
  imageUrl: string;
 
  highlighted?: boolean;
};

const NodeCard = ({
  name,
  role,
  dept,
  imageUrl,
 
  highlighted,
}: NodeCardProps) => (
  <Card
    sx={{
      width: "100%",
      background: highlighted ? "#16a34a" : "#23272f",
      color: "#fff",
      borderRadius: 3,
      minWidth: 300,
      maxWidth: 300,
      boxShadow: 6,
      display: "flex",
      flexDirection: "column",
      mx: "auto",

      // border: "1px solid #333",
      position: "relative",
    }}
  >
    <CardContent
      sx={{ display: "flex", alignItems: "center", gap: 2, pb: 1, pt: 1 }}
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
        <div style={{ fontSize: 15, color: "#cbd5e1" }}>{role}</div>
          <div style={{ fontSize: 15, color: "#cbd5e1" }}>{dept}</div>
      </div>
    </CardContent>
  </Card>
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
    for (const child of node.children ?? []) {
      findChildren(child, ids);
    }
  };

  const selectedNode = path[path.length - 1];

  if (selectedNode) {
    findChildren(selectedNode, visibleIds);
  }
  if (hierarchyLoading) {
    return (
      <div className="w-full flex h-[40vh]  justify-center overflow-y-hidden items-center">
        <CircularProgress sx={{ color: "green" }} size={"50px"} />
      </div>
    );
  }

  return (
    <div className="w-full  flex flex-col ">
      <div className="flex gap-2 absolute top-2 right-2 z-1200 items-center">
        <IconButton
          onClick={() => setZoom((z) => Math.min(z + 0.1, 2))}
          size="small"
          sx={{
            color: "#fff",
            background: "#000",
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
      <div
        style={{
          // height: "60vh",
          transform: `scale(${zoom})`,
          transformOrigin: "top center",
          transition: "transform 0.2s",
          // marginRight: "300px",
        }}
      >
        <Tree
          lineWidth={"3px"}
          lineColor={"#444"}
          lineBorderRadius={"8px"}
          label={
            <div className="flex justify-center">
              {" "}
              <Card
                sx={{
                  background: "#23272f",
                  color: "#fff",
                  borderRadius: 3,
                  minWidth: 300,
                  maxWidth: 300,
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
                    alt={hierarchyData?.[0]?.name}
                    src={hierarchyData?.[0]?.imageUrl}
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
                    <div style={{ fontWeight: 600, fontSize: 18 }}>
                      {hierarchyData?.[0]?.name}
                    </div>
                    <div style={{ fontSize: 14, color: "#cbd5e1" }}>
                      {hierarchyData?.[0]?.title}
                    </div>
                  </div>
                </CardContent>
              </Card>
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
