import type { KeyObjective } from "../types/performance-types/keyObjectives";

// TODO: replace with the key-objectives API response once the backend endpoint is available.
export const initialKeyObjectives: KeyObjective[] = [
  {
    id: "obj-1",
    type: "standard",
    title: "Payroll System Transformation",
    description:
      "Implement a fully system-driven payroll process based on actual data and records. Ensure accuracy, compliance, and elimination of manual dependencies and xls working.",
    totalWeightage: { percentage: 10, remarks: "" },
    managerWeightage: { percentage: 10, remarks: "" },
  },
  {
    id: "obj-2",
    type: "standard",
    title: "Shram Setu Project Execution",
    description:
      "Drive the Shram Setu project aggressively, with direct involvement. You will also be responsible for coordination, execution, and progress tracking.",
    totalWeightage: { percentage: null, remarks: "" },
    managerWeightage: { percentage: null, remarks: "" },
  },
  {
    id: "obj-3",
    type: "standard",
    title: "AI-Driven HR Improvements",
    description:
      "Explore and implement AI-based solutions (including Generative AI) to improve HR functions. Focus on areas like documentation, reporting, and employee engagement.",
    totalWeightage: { percentage: null, remarks: "" },
    managerWeightage: { percentage: null, remarks: "" },
  },
  {
    id: "obj-4",
    type: "standard",
    title: "Automation & Process Improvement",
    description:
      "Identify improvement areas at both internal and client levels. Drive maximum automation through systems, reducing manual work and improving efficiency.",
    totalWeightage: { percentage: null, remarks: "" },
    managerWeightage: { percentage: null, remarks: "" },
  },
  {
    id: "obj-5",
    type: "taskList",
    title: "Current Task",
    addTaskLabel: "Add Task",
    tasks: [],
  },
  {
    id: "obj-6",
    type: "taskList",
    title: "New Projects Task",
    addTaskLabel: "Add New Project Task",
    tasks: [
      {
        id: "task-1",
        label: "Visitors App for face Authentication",
        totalWeightage: { percentage: null, remarks: "" },
        managerWeightage: { percentage: null, remarks: "" },
      },
      {
        id: "task-2",
        label: "Material movement",
        totalWeightage: { percentage: null, remarks: "" },
        managerWeightage: { percentage: null, remarks: "" },
      },
      {
        id: "task-3",
        label: "Workers Gate Pass",
        totalWeightage: { percentage: null, remarks: "" },
        managerWeightage: { percentage: null, remarks: "" },
      },
      {
        id: "task-4",
        label: "Workers Leave apply",
        totalWeightage: { percentage: null, remarks: "" },
        managerWeightage: { percentage: null, remarks: "" },
      },
      {
        id: "task-5",
        label: "Text message for workers miss punches",
        totalWeightage: { percentage: null, remarks: "" },
        managerWeightage: { percentage: null, remarks: "" },
      },
    ],
  },
];
