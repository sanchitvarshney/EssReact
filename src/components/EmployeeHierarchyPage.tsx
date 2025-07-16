import { Tree, TreeNode } from "react-organizational-chart";
import { Avatar, Card, CardContent, CircularProgress } from "@mui/material";
import { Chip } from "@mui/material";

import {  type JSX } from "react";

import { useAuth } from "../contextapi/AuthContext";


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

const tagColors: Record<string, string> = {
  Leadership: "#60a5fa",
  Design: "#fbbf24",
  Development: "#86efac",
  Legal: "#a78bfa",
  HR: "#f87171",
};

type NodeCardProps = {
  name: string;
  title: string;
  imageUrl: string;
  tags: string[];
  highlighted?: boolean;
};

const NodeCard = ({
  name,
  title,
  imageUrl,
  tags,
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
        }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 18 }}>{name}</div>
        <div style={{ fontSize: 14, color: "#cbd5e1" }}>{title}</div>
        <div
          style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}
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
        </div>
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
          title={node.title}
          imageUrl={node.imageUrl}
          tags={node.tags}
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

const EmployeeHierarchyPage = () => {
  const { hierarchyData, user,hierarchyLoading } = useAuth();
  //@ts-ignore
  const userId: any = user?.id;

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
  if (hierarchyLoading ||true) {
    return (
      <div className="w-full flex h-[40vh]  justify-center items-center">
       <CircularProgress sx={{ color: "green" }} size={"50px"} />
      </div>
    );
    
  }

  return (
    <div className="w-full flex justify-center items-center">
      <div className="flex">
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
