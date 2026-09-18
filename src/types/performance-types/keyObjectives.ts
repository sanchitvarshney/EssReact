export interface WeightageValue {
  percentage: number | null;
  remarks: string;
}

export interface SubObjectiveTask {
  id: string;
  label: string;
  totalWeightage: WeightageValue;
  managerWeightage: WeightageValue;
}

export type ObjectiveRowType = "standard" | "taskList";

export interface KeyObjective {
  id: string;
  type: ObjectiveRowType;
  title: string;
  description?: string;
  totalWeightage?: WeightageValue;
  managerWeightage?: WeightageValue;
  addTaskLabel?: string;
  tasks?: SubObjectiveTask[];
}
