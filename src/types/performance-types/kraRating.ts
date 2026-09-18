export type RatingRole = "employee" | "manager";

export type TeamMemberStatus = "no_kra" | "no_points" | "pending" | "partial" | "complete";

export interface RatingWindow {
  open: boolean;
  targetMonth: string;
}

export interface TeamMember {
  empId: string;
  empName: string;
  cycleId: number | null;
  hasKraSetup: boolean;
  totalPoints: number;
  mgrFilled: number;
  status: TeamMemberStatus;
}

export interface KraPoint {
  id: number;
  point_text: string;
  category_title: string;
  category_id: number;
}

export interface RatingEntry {
  percentage: number | null;
  remarks: string;
}

export interface RatingGetData {
  cycleId: number;
  fy: string;
  yourRole: RatingRole;
  points: KraPoint[];
  ratings: Record<string, RatingEntry>;
  window: RatingWindow;
}

export interface SaveRatingEntry {
  pointId: number;
  percentage: number;
  remarks: string;
}

export interface SaveRatingPayload {
  empId: string;
  fy: string;
  entries: SaveRatingEntry[];
}


export interface ApiEnvelope<T> {
  code: number;
  status: "success" | "error";
  message?: string | { msg: string };
  data: T;
}

export const ratingKey = (pointId: number, month: string, role: RatingRole) =>
  `${pointId}_${month}_${role}`;


export const extractMessage = (message: ApiEnvelope<unknown>["message"], fallback: string) => {
  if (!message) return fallback;
  return typeof message === "string" ? message : message.msg || fallback;
};
