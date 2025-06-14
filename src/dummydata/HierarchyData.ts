export type OrgNode = {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  tags: string[];
  children?: OrgNode[];
};

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