export type LeaveData = {
  type: string;
  currentlyAvailable: number;
  accruedThisYear: number;
  creditedFromLastYear: number;
  annualAllotment: number;
};

export const leaveData: LeaveData[] = [
  {
    type: "Sick Leave",
    currentlyAvailable: 8,
    accruedThisYear: 4,
    creditedFromLastYear: 4,
    annualAllotment: 12,
  },
  {
    type: "Earned Leave",
    currentlyAvailable: 15,
    accruedThisYear: 10,
    creditedFromLastYear: 5,
    annualAllotment: 18,
  },
  {
    type: "Work From Home",
    currentlyAvailable: 6,
    accruedThisYear: 6,
    creditedFromLastYear: 0,
    annualAllotment: 12,
  },
    {
    type: "Compensatory Leave",
    currentlyAvailable: 6,
    accruedThisYear: 6,
    creditedFromLastYear: 0,
    annualAllotment: 12,
  },
];