import type { FC, JSX } from "react";

import { TreeNode } from "react-organizational-chart";
import { NodeCard } from "./NodeCard";

type EmployeeTreeProps = {
  toggleNode: any;
  expandedNodes: any;
  node: any;
};
export const EmployeeTree: FC<EmployeeTreeProps> = ({
  toggleNode,
  expandedNodes,
  node,
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
        />
      }
      key={node.id}
    >
      {isExpanded &&
        hasChildren &&
        (node.children ?? []).map((childNode: any) => (
          <EmployeeTree
            key={childNode.id}
            toggleNode={toggleNode}
            expandedNodes={expandedNodes}
            node={childNode}
          />
        ))}
    </TreeNode>
  );
};
