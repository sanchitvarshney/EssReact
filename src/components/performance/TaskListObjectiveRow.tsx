import { memo, useState, type DragEvent } from "react";
import { Typography, IconButton, TextField, Tooltip } from "@mui/material";
import { StyledTableCell, StyledTableRow } from "../../pages/LeaveStatusPage";
import { Plus, Trash2 } from "lucide-react";
import WeightageInputs from "./WeightageInputs";
import ObjectiveIndexBadge from "./ObjectiveIndexBadge";
import type { KeyObjective } from "../../types/performance-types/keyObjectives";

interface TaskListObjectiveRowProps {
  index: number;
  objective: KeyObjective;
  onAddTask: (objectiveId: string) => void;
  onRemoveTask: (objectiveId: string, taskId: string) => void;
  onReorderTask: (objectiveId: string, fromIndex: number, toIndex: number) => void;
  onUpdateTaskField: (
    objectiveId: string,
    taskId: string,
    column: "totalWeightage" | "managerWeightage",
    field: "percentage" | "remarks",
    value: string
  ) => void;
  onUpdateTaskLabel: (objectiveId: string, taskId: string, label: string) => void;
}

const addButtonSx = {
  border: "1.5px solid #2eacb3",
  color: "#1e8a8f",
  borderRadius: "999px",
  px: 2,
  py: 0.6,
  gap: 0.5,
  fontSize: "0.8rem",
  backgroundColor: "#fff",
  transition: "background-color 0.15s",
  "&:hover": { backgroundColor: "rgba(46,172,179,0.1)" },
};

const TaskListObjectiveRow = memo(
  ({
    index,
    objective,
    onAddTask,
    onRemoveTask,
    onReorderTask,
    onUpdateTaskField,
    onUpdateTaskLabel,
  }: TaskListObjectiveRowProps) => {
    const tasks = objective.tasks ?? [];
    const [dragIndex, setDragIndex] = useState<number | null>(null);

    const handleDrop = (e: DragEvent<HTMLTableRowElement>, dropIndex: number) => {
      e.preventDefault();
      if (dragIndex === null) return;
      onReorderTask(objective.id, dragIndex, dropIndex);
      setDragIndex(null);
    };

    return (
      <>
        <StyledTableRow>
          <StyledTableCell sx={{ verticalAlign: "top" }}>
            <ObjectiveIndexBadge index={index} />
          </StyledTableCell>
          <StyledTableCell sx={{ verticalAlign: "top" }} colSpan={tasks.length === 0 ? 1 : 5}>
            <Typography sx={{ fontWeight: 700, color: "#1f2937", fontSize: "0.9rem" }}>
              {objective.title}
            </Typography>
          </StyledTableCell>
          {tasks.length === 0 && (
            <>
              <StyledTableCell colSpan={2}>
                <IconButton onClick={() => onAddTask(objective.id)} size="small" sx={addButtonSx}>
                  <Plus size={16} />
                  <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, ml: 0.5 }}>
                    {objective.addTaskLabel ?? "Add Task"}
                  </Typography>
                </IconButton>
              </StyledTableCell>
              <StyledTableCell align="center" sx={{ color: "#cbd5e1" }}>
                –
              </StyledTableCell>
              <StyledTableCell align="center" sx={{ color: "#cbd5e1" }}>
                –
              </StyledTableCell>
            </>
          )}
          <StyledTableCell />
        </StyledTableRow>

        {tasks.map((task, taskIndex) => (
          <StyledTableRow
            key={task.id}
            draggable
            onDragStart={() => setDragIndex(taskIndex)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, taskIndex)}
          >
            <StyledTableCell />
            <StyledTableCell sx={{ pl: 3 }}>
              <TextField
                size="small"
                fullWidth
                value={task.label}
                onChange={(e) => onUpdateTaskLabel(objective.id, task.id, e.target.value)}
                placeholder="Task name"
                variant="standard"
                slotProps={{ input: { disableUnderline: true } }}
                sx={{ "& input": { fontSize: "0.85rem", color: "#374151" } }}
              />
            </StyledTableCell>
            <WeightageInputs
              percentage={task.totalWeightage.percentage}
              remarks={task.totalWeightage.remarks}
              onPercentageChange={(v) =>
                onUpdateTaskField(objective.id, task.id, "totalWeightage", "percentage", v)
              }
              onRemarksChange={(v) =>
                onUpdateTaskField(objective.id, task.id, "totalWeightage", "remarks", v)
              }
            />
            <WeightageInputs
              percentage={task.managerWeightage.percentage}
              remarks={task.managerWeightage.remarks}
              onPercentageChange={(v) =>
                onUpdateTaskField(objective.id, task.id, "managerWeightage", "percentage", v)
              }
              onRemarksChange={(v) =>
                onUpdateTaskField(objective.id, task.id, "managerWeightage", "remarks", v)
              }
            />
            <StyledTableCell align="center">
              <Tooltip title="Remove task">
                <IconButton
                  size="small"
                  onClick={() => onRemoveTask(objective.id, task.id)}
                  sx={{ color: "#ef4444", "&:hover": { backgroundColor: "rgba(239,68,68,0.1)" } }}
                >
                  <Trash2 size={16} />
                </IconButton>
              </Tooltip>
            </StyledTableCell>
          </StyledTableRow>
        ))}

        {tasks.length > 0 && (
          <StyledTableRow>
            <StyledTableCell />
            <StyledTableCell colSpan={5}>
              <IconButton onClick={() => onAddTask(objective.id)} size="small" sx={addButtonSx}>
                <Plus size={16} />
                <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, ml: 0.5 }}>
                  {objective.addTaskLabel ?? "Add Task"}
                </Typography>
              </IconButton>
            </StyledTableCell>
            <StyledTableCell />
          </StyledTableRow>
        )}
      </>
    );
  }
);

TaskListObjectiveRow.displayName = "TaskListObjectiveRow";

export default TaskListObjectiveRow;
