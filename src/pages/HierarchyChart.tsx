import { Tree, TreeNode } from "react-organizational-chart";
import { Avatar, Card, CardContent } from "@mui/material";
import { Chip } from "@mui/material";
import { IconButton } from "@mui/material";
import { useState } from "react";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import type { JSX } from "react";

import { orgData, type OrgNode } from "../dummydata/HierarchyData";

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
  hasChildren: boolean;
  isExpanded: boolean;
  onToggle: () => void;
};

const NodeCard = ({ name, title, imageUrl, tags, hasChildren, isExpanded, onToggle }: NodeCardProps) => (
  <Card
    sx={{
      background: "#23272f",
      color: "#fff",
      borderRadius: 3,
      minWidth: 260,
      maxWidth: 280,
      boxShadow: 6,
      px: 2,
      py: 1.5,
      border: "1px solid #333",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}
  >
    <CardContent
      sx={{ display: "flex", alignItems: "center", gap: 2, pb: 1, pt: 1, width: "100%" }}
    >
      <Avatar
        alt={name}
        src={imageUrl}
        sx={{ width: 48, height: 48, border: "2px solid #444", backgroundColor: "#2eacb3" }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 18 }}>{name}</div>
        <div style={{ fontSize: 14, color: "#cbd5e1" }}>{title}</div>
        <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
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
    {hasChildren && (
      <IconButton
        size="small"
        onClick={onToggle}
        sx={{
          position: "absolute",
          left: "50%",
          bottom: 4,
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
        {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </IconButton>
    )}
  </Card>
);

const HierarchyChart = () => {
  const [zoom, setZoom] = useState(1);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderTree = (node: OrgNode): JSX.Element => {
    const hasChildren = Boolean(node.children && node.children.length > 0);
    const isExpanded = expandedNodes[node.id] ?? true;

    return (
      <TreeNode
        label={
          <NodeCard
            name={node.name}
            title={node.title}
            imageUrl={node.imageUrl}
            tags={node.tags}
            hasChildren={hasChildren}
            isExpanded={isExpanded}
            onToggle={() => toggleNode(node.id)}
          />
        }
        key={node.id}
      >
        {isExpanded && hasChildren && (node.children ?? []).map(renderTree)}
      </TreeNode>
    );
  };

  return (
    <div
      className="overflow-auto p-6 h-[calc(100vh-90px)]  w-full flex"
      style={{ position: "relative" }}
    >
      <div
        style={{
          position: "fixed",
          top: 90,
          right: 32,
          zIndex: 10,
          display: "flex",
          gap: 8,
        }}
      >
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
            fontSize: 16,
            marginLeft: 8,
          }}
        >
          {Math.round(zoom * 100)}%
        </span>
      </div>
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top center",
          transition: "transform 0.2s",
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
                    sx={{ width: 48, height: 48, border: "2px solid #444" ,backgroundColor:"#2eacb3"}}
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
                    <div className="mt-4">{orgData.children && orgData.children.length > 0 && (
                        <IconButton
                          size="small"
                          onClick={() => toggleNode(orgData.id)}
                          sx={{
                            position: "absolute",
                            left: "50%",
                            bottom: 3,
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
                         
                          {expandedNodes[orgData.id] ?? true ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    
                  )}</div>
                  </div>
                  
                </CardContent>
              </Card>
            </div>
          }
        >
          {(expandedNodes[orgData.id] ?? true) && (orgData.children ?? []).map(renderTree)}
        </Tree>
      </div>
    </div>
  );
};

export default HierarchyChart;
