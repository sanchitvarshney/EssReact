import { useCallback, useMemo, useState } from "react";
import { initialKeyObjectives } from "../dummydata/KeyObjectives";
import type {
  KeyObjective,
  SubObjectiveTask,
  WeightageValue,
} from "../types/performance-types/keyObjectives";
import { useToast } from "./useToast";

type Column = "totalWeightage" | "managerWeightage";
type Field = keyof WeightageValue;

let idCounter = 0;
const generateId = () => `task-${Date.now()}-${idCounter++}`;

const emptyWeightage = (): WeightageValue => ({ percentage: null, remarks: "" });

const sumColumn = (objectives: KeyObjective[], column: Column) =>
  objectives.reduce((sum, objective) => {
    if (objective.type === "standard") {
      return sum + (objective[column]?.percentage ?? 0);
    }
    if (objective.type === "taskList") {
      const taskSum = (objective.tasks ?? []).reduce(
        (acc, task) => acc + (task[column].percentage ?? 0),
        0
      );
      return sum + taskSum;
    }
    return sum;
  }, 0);


export const useKeyObjectives = () => {
  const [objectives, setObjectives] = useState<KeyObjective[]>(initialKeyObjectives);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const totalWeightageSum = useMemo(
    () => sumColumn(objectives, "totalWeightage"),
    [objectives]
  );
  const managerWeightageSum = useMemo(
    () => sumColumn(objectives, "managerWeightage"),
    [objectives]
  );

  const updateStandardField = useCallback(
    (objectiveId: string, column: Column, field: Field, value: string) => {
      setObjectives((prev) =>
        prev.map((objective) => {
          if (objective.id !== objectiveId) return objective;
          const current = objective[column] ?? emptyWeightage();
          const nextValue =
            field === "percentage"
              ? value === ""
                ? null
                : Math.max(0, Math.min(100, Number(value)))
              : value;
          return { ...objective, [column]: { ...current, [field]: nextValue } };
        })
      );
    },
    []
  );

  const updateTaskField = useCallback(
    (objectiveId: string, taskId: string, column: Column, field: Field, value: string) => {
      setObjectives((prev) =>
        prev.map((objective) => {
          if (objective.id !== objectiveId || !objective.tasks) return objective;
          return {
            ...objective,
            tasks: objective.tasks.map((task) => {
              if (task.id !== taskId) return task;
              const nextValue =
                field === "percentage"
                  ? value === ""
                    ? null
                    : Math.max(0, Math.min(100, Number(value)))
                  : value;
              return { ...task, [column]: { ...task[column], [field]: nextValue } };
            }),
          };
        })
      );
    },
    []
  );

  const updateTaskLabel = useCallback((objectiveId: string, taskId: string, label: string) => {
    setObjectives((prev) =>
      prev.map((objective) => {
        if (objective.id !== objectiveId || !objective.tasks) return objective;
        return {
          ...objective,
          tasks: objective.tasks.map((task) => (task.id === taskId ? { ...task, label } : task)),
        };
      })
    );
  }, []);

  const addTask = useCallback((objectiveId: string) => {
    const newTask: SubObjectiveTask = {
      id: generateId(),
      label: "",
      totalWeightage: emptyWeightage(),
      managerWeightage: emptyWeightage(),
    };
    setObjectives((prev) =>
      prev.map((objective) =>
        objective.id === objectiveId
          ? { ...objective, tasks: [...(objective.tasks ?? []), newTask] }
          : objective
      )
    );
  }, []);

  const removeTask = useCallback((objectiveId: string, taskId: string) => {
    setObjectives((prev) =>
      prev.map((objective) =>
        objective.id === objectiveId
          ? { ...objective, tasks: (objective.tasks ?? []).filter((t) => t.id !== taskId) }
          : objective
      )
    );
  }, []);

  const reorderTask = useCallback((objectiveId: string, fromIndex: number, toIndex: number) => {
    setObjectives((prev) =>
      prev.map((objective) => {
        if (objective.id !== objectiveId || !objective.tasks) return objective;
        if (fromIndex === toIndex) return objective;
        const tasks = [...objective.tasks];
        const [moved] = tasks.splice(fromIndex, 1);
        tasks.splice(toIndex, 0, moved);
        return { ...objective, tasks };
      })
    );
  }, []);

  const resetAll = useCallback(() => {
    setObjectives(initialKeyObjectives);
  }, []);

  const save = useCallback(async () => {
    if (totalWeightageSum !== 100 || managerWeightageSum !== 100) {
      showToast("Total Weightage must add up to 100% in both columns", "error");
      return;
    }
    setSaving(true);
    try {
   
      await new Promise((resolve) => setTimeout(resolve, 500));
      showToast("Key objectives saved successfully", "success");
    } finally {
      setSaving(false);
    }
  }, [objectives, totalWeightageSum, managerWeightageSum, showToast]);

  return {
    objectives,
    saving,
    totalWeightageSum,
    managerWeightageSum,
    updateStandardField,
    updateTaskField,
    updateTaskLabel,
    addTask,
    removeTask,
    reorderTask,
    resetAll,
    save,
  };
};
