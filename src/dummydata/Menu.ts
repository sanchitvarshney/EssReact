
import type { MenuItem } from "../types/dummytypes";

export const menu: MenuItem[] = [
  {
    id: 'profile',
    title: 'Profile',
    icon: 'profile',
    path: '/profile',
  },
  {
    id: 'flows',
    title: 'Flows',
    icon: 'flows',
    path: '/flows',
  },
  {
    id: 'benefits',
    title: 'Benefits',
    icon: 'benefits',
    path: '/benefits',
  },
  {
    id: 'leave',
    title: 'Leave',
    icon: 'EventBusyIcon',
    path: '/leave',
  },
  {
    id: 'attendance',
    title: 'Attendance',
    icon: 'AccessTimeIcon',
    path: '/attendance',
  },
  {
    id: 'performance',
    title: 'Performance',
    icon: 'BarChartIcon',
    children: [
      {
        id: 'goals',
        title: 'Goals',
        path: '/performance/goals',
      },
      {
        id: 'reviews',
        title: 'Reviews',
        path: '/performance/reviews',
      },
    ],
  },
  {
    id: 'talent',
    title: 'Talent Management',
    icon: 'PeopleIcon',
    children: [
      {
        id: 'recruitment',
        title: 'Recruitment',
        path: '/talent/recruitment',
      },
      {
        id: 'training',
        title: 'Training',
        path: '/talent/training',
      },
    ],
  },
  {
    id: 'reimbursement',
    title: 'Reimbursement',
    icon: 'MonetizationOnIcon',
    children: [
      {
        id: 'travel',
        title: 'Travel',
        path: '/reimbursement/travel',
      },
      {
        id: 'meals',
        title: 'Meals',
        path: '/reimbursement/meals',
      },
    ],
  },
];
