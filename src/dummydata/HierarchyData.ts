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

// Employee-wise hierarchy data
export const orgData: OrgNode = {
  id: "ceo",
  name: "Benjamin Davis",
  title: "Chief Executive Officer",
  imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
  tags: ["Leadership"],
  children: [
    {
      id: "cpo",
      name: "Olivia Reynolds",
      title: "Chief Product Officer",
      imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
      tags: ["Leadership", "Design"],
      children: [
        {
          id: "designer",
          name: "You",
          title: "Product Designer",
          imageUrl: "https://randomuser.me/api/portraits/men/99.jpg",
          tags: ["Design"],
          children: [
            {
              id: "intern",
              name: "Olivia Bennett",
              title: "Design Intern",
              imageUrl: "https://randomuser.me/api/portraits/women/65.jpg",
              tags: ["Design"],
            },
          ],
        },
        {
          id: "researcher",
          name: "Liam Foster",
          title: "User Research",
          imageUrl: "https://randomuser.me/api/portraits/men/45.jpg",
          tags: ["Design"],
        },
      ],
    },
    {
      id: "cto",
      name: "Henry Mitchell",
      title: "Chief Technology Officer",
      imageUrl: "https://randomuser.me/api/portraits/men/46.jpg",
      tags: ["Leadership", "Development"],
      children: [],
    },
    {
      id: "clo",
      name: "Nathan Rodriguez",
      title: "Chief Legal Officer",
      imageUrl: "https://randomuser.me/api/portraits/men/47.jpg",
      tags: ["Leadership", "Legal"],
      children: [],
    },
    {
      id: "hr",
      name: "Isabella Turner-Smith",
      title: "Chief Human Resources Officer",
      imageUrl: "https://randomuser.me/api/portraits/women/48.jpg",
      tags: ["Leadership", "HR"],
      children: [
          {
          id: "designer",
          name: "You",
          title: "Product Designer",
          imageUrl: "https://randomuser.me/api/portraits/men/99.jpg",
          tags: ["Design"],
          children: [
            {
              id: "intern",
              name: "Olivia Bennett",
              title: "Design Intern",
              imageUrl: "https://randomuser.me/api/portraits/women/65.jpg",
              tags: ["Design"],
            },
          ],
        },
        {
          id: "researcher",
          name: "Liam Foster",
          title: "User Research",
          imageUrl: "https://randomuser.me/api/portraits/men/45.jpg",
          tags: ["Design"],
        },
      ],
    },
  ],
};

// Department-wise hierarchy data
export const departmentData: DepartmentNode = {
  id: "company",
  name: "TechCorp Inc.",
  title: "Technology Company",
  imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
  tags: ["Leadership"],
  employeeCount: 150,
  children: [
    {
      id: "product-dept",
      name: "Product Department",
      title: "Product & Design",
      imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
      tags: ["Design", "Product"],
      employeeCount: 45,
      children: [
        {
          id: "design-team",
          name: "Design Team",
          title: "UI/UX Design",
          imageUrl: "https://randomuser.me/api/portraits/men/99.jpg",
          tags: ["Design"],
          employeeCount: 12,
          children: [
            {
              id: "ux-team",
              name: "UX Team",
              title: "User Experience",
              imageUrl: "https://randomuser.me/api/portraits/women/65.jpg",
              tags: ["Design"],
              employeeCount: 6,
            },
            {
              id: "ui-team",
              name: "UI Team",
              title: "User Interface",
              imageUrl: "https://randomuser.me/api/portraits/men/45.jpg",
              tags: ["Design"],
              employeeCount: 6,
            },
          ],
        },
        {
          id: "product-team",
          name: "Product Team",
          title: "Product Management",
          imageUrl: "https://randomuser.me/api/portraits/women/66.jpg",
          tags: ["Product"],
          employeeCount: 8,
        },
      ],
    },
    {
      id: "tech-dept",
      name: "Technology Department",
      title: "Engineering & Development",
      imageUrl: "https://randomuser.me/api/portraits/men/46.jpg",
      tags: ["Development"],
      employeeCount: 65,
      children: [
        {
          id: "frontend-team",
          name: "Frontend Team",
          title: "Frontend Development",
          imageUrl: "https://randomuser.me/api/portraits/men/67.jpg",
          tags: ["Development"],
          employeeCount: 20,
        },
        {
          id: "backend-team",
          name: "Backend Team",
          title: "Backend Development",
          imageUrl: "https://randomuser.me/api/portraits/men/68.jpg",
          tags: ["Development"],
          employeeCount: 25,
        },
        {
          id: "devops-team",
          name: "DevOps Team",
          title: "DevOps & Infrastructure",
          imageUrl: "https://randomuser.me/api/portraits/men/69.jpg",
          tags: ["Development"],
          employeeCount: 15,
        },
      ],
    },
    {
      id: "legal-dept",
      name: "Legal Department",
      title: "Legal & Compliance",
      imageUrl: "https://randomuser.me/api/portraits/men/47.jpg",
      tags: ["Legal"],
      employeeCount: 8,
    },
    {
      id: "hr-dept",
      name: "HR Department",
      title: "Human Resources",
      imageUrl: "https://randomuser.me/api/portraits/women/48.jpg",
      tags: ["HR"],
      employeeCount: 12,
      children: [
        {
          id: "recruitment-team",
          name: "Recruitment Team",
          title: "Talent Acquisition",
          imageUrl: "https://randomuser.me/api/portraits/women/70.jpg",
          tags: ["HR"],
          employeeCount: 6,
        },
        {
          id: "hr-ops-team",
          name: "HR Operations",
          title: "HR Operations",
          imageUrl: "https://randomuser.me/api/portraits/women/71.jpg",
          tags: ["HR"],
          employeeCount: 6,
        },
      ],
    },
  ],
};