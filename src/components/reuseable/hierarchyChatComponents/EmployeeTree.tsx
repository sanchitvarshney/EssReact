import type { FC, JSX, ReactNode } from "react";

import { TreeNode } from "react-organizational-chart";
import { NodeCard } from "./NodeCard";

type EmployeeTreeProps = {
  toggleNode: any;
  expandedNodes: any;
  node: any;
  highlightType?: "self" | "colleague" | "child" | "ancestor";
  onHover?: () => void;
  onUnhover?: () => void;
  children?: ReactNode;
};
export const EmployeeTree: FC<EmployeeTreeProps> = ({
  toggleNode,
  expandedNodes,
  node,
  highlightType,
  onHover,
  onUnhover,
  children,
}): JSX.Element => {
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
          highlightType={highlightType}
          onMouseEnter={onHover}
          onMouseLeave={onUnhover}
        />
      }
      key={node.id}
    >
      {children}
    </TreeNode>
  );
};
