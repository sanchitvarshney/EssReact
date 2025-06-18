import { Tree, TreeNode } from "react-organizational-chart";
import { Avatar, Card, CardContent } from "@mui/material";
import { Chip } from "@mui/material";

import type { JSX } from "react";

import { orgData, type OrgNode } from "../dummydata/HierarchyData";
const findPathToId = (
  root: OrgNode,
  id: string,
  path: OrgNode[] = []
): OrgNode[] | null => {
  if (root.id === id) return [...path, root];

  for (const child of root.children ?? []) {
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
      background: highlighted ? "#16a34a" : "#23272f",
      color: "#fff",
      borderRadius: 3,
      minWidth: 260,
      maxWidth: 280,
      boxShadow: 6,
      px: 2,
      py: 1.5,
      border: "1px solid #333",
      position: "relative",
    }}
  >
    <CardContent
      sx={{ display: "flex", alignItems: "center", gap: 2, pb: 1, pt: 1 }}
    >
      <Avatar
        alt={name}
        src={imageUrl}
        sx={{ width: 48, height: 48, border: "2px solid #444" }}
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
  node: OrgNode,
  selectedId: string,
  visibleIds: Set<string>
): JSX.Element | null => {
  if (!visibleIds.has(node.id)) return null;

  return (
    <TreeNode
      label={
        <NodeCard
          name={node.name}
          title={node.title}
          imageUrl={node.imageUrl}
          tags={node.tags}
          highlighted={node.id === selectedId}
        />
      }
      key={node.id}
    >
      {(node.children ?? []).map((child) =>
        renderTree(child, selectedId, visibleIds)
      )}
    </TreeNode>
  );
};

const EmployeeHierarchyPage = ({ selectedId = "hr" }) => {
  const path = findPathToId(orgData, selectedId) ?? [];
  const visibleIds = new Set(path.map((node) => node.id));
  const findChildren = (node: OrgNode, ids: Set<string>) => {
    ids.add(node.id);
    for (const child of node.children ?? []) {
      findChildren(child, ids);
    }
  };

   
  const selectedNode = path[path.length - 1];
  if (selectedNode) {
    findChildren(selectedNode, visibleIds);
  }

  return (
    <div className="   w-full flex">
      <div
        style={{
          justifySelf: "center",
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
                  minWidth: 260,
                  maxWidth: 280,
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
                    alt={orgData.name}
                    src={orgData.imageUrl}
                    sx={{ width: 48, height: 48, border: "2px solid #444" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 18 }}>
                      {orgData.name}
                    </div>
                    <div style={{ fontSize: 14, color: "#cbd5e1" }}>
                      {orgData.title}
                    </div>
                    <div
                      style={{
                        marginTop: 6,
                        display: "flex",
                        gap: 6,
                        flexWrap: "wrap",
                      }}
                    >
                      {orgData.tags?.map((tag: string) => (
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
            </div>
          } // Invisible wrapper
        >
           {(orgData.children ?? []).map((child) => renderTree(child, selectedId, visibleIds))}
        </Tree>
      </div>
    </div>
  );
};

export default EmployeeHierarchyPage;
