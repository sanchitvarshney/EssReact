import { baseApiInstance } from "./baseApiInstance";

export type TeamAttendanceGroup = "present" | "wfh" | "half_day" | "absent" | "leave" | "off" | "other";

export interface TeamAttendanceMember {
  emp_code: string;
  name: string;
  photo: string | null;
  level: number;
  direct: boolean;
  /** Same day code the employee's own calendar shows (P, A, HD, SL, WO, MIS, ...) plus IN = punched in, not out yet. */
  code: string;
  group: TeamAttendanceGroup;
  in_time: string | null;
  out_time: string | null;
  total_time: string | null;
}

export interface TeamAttendanceData {
  date: string;
  is_manager: boolean;
  team_size: number;
  summary: Record<TeamAttendanceGroup, number>;
  members: TeamAttendanceMember[];
}

/** One team member's month, in the same shape the employee's own Attendance page builds its views from. */
export interface TeamMemberMonth {
  emp: { emp_code: string; name: string; photo: string | null; direct: boolean; level: number };
  month: string;
  events: { title: string; start: string | null; in_time: string; out_time: string; total_time: string }[];
  stats: { total_present: number; total_misspunch: number; srtCount: number; lateCount: number };
}

const teamAttendanceApi = baseApiInstance.injectEndpoints({
  endpoints: (builder) => ({
    getTeamAttendance: builder.mutation<any, string | void>({
      query: (date) => ({
        url: "/team-attendance",
        method: "GET",
        params: date ? { date } : {},
      }),
    }),
    getTeamMemberMonth: builder.mutation<any, { empCode: string; month: string }>({
      query: ({ empCode, month }) => ({
        url: "/team-attendance/member",
        method: "GET",
        params: { emp_code: empCode, month },
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetTeamAttendanceMutation, useGetTeamMemberMonthMutation } = teamAttendanceApi;
