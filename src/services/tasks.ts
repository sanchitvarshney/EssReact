// src/services/tasks.ts
// Task Box — talks to BACKEND controller/ROUTES/APP/tasksWeb.js (/tasks/*), the ESS Web
// mirror of the Android app's Task feature. Same tables/state machine as the app; see that
// file's own doc comment for the full flow (Assigned -> InProgress -> Forwarded/Completed ->
// Closed, etc.).
import { baseApiInstance } from "./baseApiInstance";

const tasksApi = baseApiInstance.injectEndpoints({
  endpoints: (builder) => ({
    // ── Lists + metrics ──────────────────────────────────────────────────────
    getMyTasks: builder.mutation<any, { filter?: string; page?: number; limit?: number } | void>({
      query: (params) => ({ url: "/tasks/employee", method: "GET", params: params || {} }),
    }),
    getMyTaskMetrics: builder.mutation<any, void>({
      query: () => ({ url: "/tasks/employee/metrics", method: "GET" }),
    }),
    getManagedTasks: builder.mutation<any, { filter?: string; page?: number; limit?: number } | void>({
      query: (params) => ({ url: "/tasks/manager", method: "GET", params: params || {} }),
    }),
    getManagerTaskMetrics: builder.mutation<any, void>({
      query: () => ({ url: "/tasks/manager/metrics", method: "GET" }),
    }),
    getPersonTasks: builder.mutation<any, { empCode: string; filter?: string; by?: "assigner" }>({
      query: ({ empCode, ...params }) => ({ url: `/tasks/of/${empCode}`, method: "GET", params }),
    }),
    getAssignees: builder.mutation<any, void>({
      query: () => ({ url: "/tasks/assignees", method: "GET" }),
    }),
    searchAssignees: builder.mutation<any, string>({
      query: (q) => ({ url: "/tasks/assignee-search", method: "GET", params: { q } }),
    }),

    // ── Detail ───────────────────────────────────────────────────────────────
    getTaskDetail: builder.mutation<any, number>({
      query: (id) => ({ url: `/tasks/${id}`, method: "GET" }),
    }),
    getTaskTimeline: builder.mutation<any, number>({
      query: (id) => ({ url: `/tasks/${id}/timeline`, method: "GET" }),
    }),

    // ── Create ───────────────────────────────────────────────────────────────
    createTask: builder.mutation<any, FormData>({
      query: (body) => ({ url: "/tasks/create", method: "POST", body }),
    }),

    // ── Lifecycle actions (id + optional body) ──────────────────────────────
    startTask: builder.mutation<any, { id: number }>({
      query: ({ id }) => ({ url: `/tasks/${id}/start`, method: "POST" }),
    }),
    completeTask: builder.mutation<any, { id: number; notes?: string }>({
      query: ({ id, ...body }) => ({ url: `/tasks/${id}/complete`, method: "POST", body }),
    }),
    closeTask: builder.mutation<any, { id: number; notes?: string }>({
      query: ({ id, ...body }) => ({ url: `/tasks/${id}/close`, method: "POST", body }),
    }),
    forwardTask: builder.mutation<any, { id: number; assigned_to: string; note?: string }>({
      query: ({ id, ...body }) => ({ url: `/tasks/${id}/forward`, method: "POST", body }),
    }),
    takebackTask: builder.mutation<any, { id: number; reason?: string }>({
      query: ({ id, ...body }) => ({ url: `/tasks/${id}/takeback`, method: "POST", body }),
    }),
    surrenderTask: builder.mutation<any, { id: number; reason: string }>({
      query: ({ id, ...body }) => ({ url: `/tasks/${id}/surrender`, method: "POST", body }),
    }),
    setEta: builder.mutation<any, { id: number; expected_at: string; remark?: string }>({
      query: ({ id, ...body }) => ({ url: `/tasks/${id}/eta`, method: "POST", body }),
    }),
    reopenTask: builder.mutation<any, { id: number; reason: string }>({
      query: ({ id, ...body }) => ({ url: `/tasks/${id}/reopen`, method: "POST", body }),
    }),
    withdrawTask: builder.mutation<any, { id: number; reason?: string }>({
      query: ({ id, ...body }) => ({ url: `/tasks/${id}/withdraw`, method: "POST", body }),
    }),
    editTask: builder.mutation<any, { id: number; title: string; priority: string }>({
      query: ({ id, ...body }) => ({ url: `/tasks/${id}/edit`, method: "POST", body }),
    }),
    setDeadline: builder.mutation<any, { id: number; deadline_date?: string; deadline_time: string; reason?: string }>({
      query: ({ id, ...body }) => ({ url: `/tasks/${id}/set-deadline`, method: "POST", body }),
    }),
    changeDeadline: builder.mutation<any, { id: number; expected_end_at: string; reason?: string }>({
      query: ({ id, ...body }) => ({ url: `/tasks/${id}/deadline`, method: "POST", body }),
    }),
    reassignTask: builder.mutation<any, { id: number; assigned_to: string }>({
      query: ({ id, ...body }) => ({ url: `/tasks/${id}/reassign`, method: "POST", body }),
    }),

    // ── Sub-tasks + comments ─────────────────────────────────────────────────
    addSubtask: builder.mutation<any, { id: number; title: string }>({
      query: ({ id, ...body }) => ({ url: `/tasks/${id}/subtasks`, method: "POST", body }),
    }),
    toggleSubtask: builder.mutation<any, { id: number; sid: number }>({
      query: ({ id, sid }) => ({ url: `/tasks/${id}/subtasks/${sid}/toggle`, method: "POST" }),
    }),
    postComment: builder.mutation<any, { id: number; comment: string }>({
      query: ({ id, ...body }) => ({ url: `/tasks/${id}/comments`, method: "POST", body }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMyTasksMutation,
  useGetMyTaskMetricsMutation,
  useGetManagedTasksMutation,
  useGetManagerTaskMetricsMutation,
  useGetPersonTasksMutation,
  useGetAssigneesMutation,
  useSearchAssigneesMutation,
  useGetTaskDetailMutation,
  useGetTaskTimelineMutation,
  useCreateTaskMutation,
  useStartTaskMutation,
  useCompleteTaskMutation,
  useCloseTaskMutation,
  useForwardTaskMutation,
  useTakebackTaskMutation,
  useSurrenderTaskMutation,
  useSetEtaMutation,
  useReopenTaskMutation,
  useWithdrawTaskMutation,
  useEditTaskMutation,
  useSetDeadlineMutation,
  useChangeDeadlineMutation,
  useReassignTaskMutation,
  useAddSubtaskMutation,
  useToggleSubtaskMutation,
  usePostCommentMutation,
} = tasksApi;
