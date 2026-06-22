export type OrgNode = {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  tags: string[];
  children?: OrgNode[];
};

export type DepartmentNode = {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  tags: string[];
  employeeCount: number;
  children?: DepartmentNode[];
};
