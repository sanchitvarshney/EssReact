
import {
  orgData,
  departmentData,
  type OrgNode,
  type DepartmentNode,
} from "../dummydata/HierarchyData";
export const renderData  = [
const renderEmployeeTree : (node: OrgNode): JSX.Element => {
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
          (node.children ?? []).map(renderEmployeeTree)}
      </TreeNode>
    );
  };
] 