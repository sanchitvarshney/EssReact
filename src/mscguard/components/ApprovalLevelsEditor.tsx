import { useState } from "react";
import { lookupEmployeeByCode } from "../services/mscguardHierarchy";
import { useToast } from "./ToastProvider";
import { FieldWrap, TextInput, Select, SecondaryButton } from "./FormControls";
import type { ApprovalRole, MaterialChainLevel } from "../types/mscguardTypes";

const ROLE_OPTIONS: ApprovalRole[] = ["TL", "Manager", "HR"];

function emptyLevel(level: number): MaterialChainLevel {
  return { level, role: "TL", name: "", email: "", mobile: "", employeeCode: "" };
}

interface ApprovalLevelsEditorProps {
  levels: MaterialChainLevel[];
  onChange: (levels: MaterialChainLevel[]) => void;
}

export default function ApprovalLevelsEditor({ levels, onChange }: ApprovalLevelsEditorProps) {
  function updateLevel(index: number, patch: Partial<MaterialChainLevel>) {
    onChange(levels.map((lv, i) => (i === index ? { ...lv, ...patch } : lv)));
  }

  function addLevel() {
    onChange([...levels, emptyLevel(levels.length + 1)]);
  }

  function removeLevel(index: number) {
    onChange(levels.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-semibold text-gray-800">Approval Levels</div>
        <SecondaryButton type="button" onClick={addLevel}>
          + Add Level
        </SecondaryButton>
      </div>

      <div className="flex flex-col gap-4">
        {levels.map((level, i) => (
          <LevelCard
            key={i}
            level={level}
            onChange={(patch) => updateLevel(i, patch)}
            onRemove={levels.length > 1 ? () => removeLevel(i) : undefined}
          />
        ))}
      </div>
    </div>
  );
}

function LevelCard({
  level,
  onChange,
  onRemove,
}: {
  level: MaterialChainLevel;
  onChange: (patch: Partial<MaterialChainLevel>) => void;
  onRemove?: () => void;
}) {
  const toast = useToast();
  const [isLookingUp, setIsLookingUp] = useState(false);

  async function handleCodeBlur() {
    const code = (level.employeeCode || "").trim();
    if (!code) return;
    setIsLookingUp(true);
    try {
      const result = await lookupEmployeeByCode(code);
      if (result) {
        onChange({
          name: result.fullName,
          email: result.email || level.email,
          mobile: result.phone || level.mobile,
        });
      } else {
        onChange({ name: "" });
        toast.warning(`No employee found for code "${code}".`);
      }
    } finally {
      setIsLookingUp(false);
    }
  }

  return (
    <div className="border border-gray-200 rounded-md p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="grid grid-cols-2 gap-3 flex-1 max-w-xs">
          <FieldWrap label="Level">
            <TextInput
              type="number"
              value={level.level}
              onChange={(e) => onChange({ level: Number(e.target.value) })}
            />
          </FieldWrap>
          <FieldWrap label="Role" required>
            <Select value={level.role} onChange={(e) => onChange({ role: e.target.value })}>
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </Select>
          </FieldWrap>
        </div>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-500 hover:text-red-600 text-xs font-medium ml-3 mt-1"
          >
            Remove
          </button>
        )}
      </div>

      <FieldWrap label="Employee Code">
        <TextInput
          value={level.employeeCode || ""}
          onChange={(e) => onChange({ employeeCode: e.target.value })}
          onBlur={handleCodeBlur}
          placeholder="Enter code, then Tab"
        />
      </FieldWrap>

      <FieldWrap label="Name">
        <TextInput
          value={isLookingUp ? "Looking up…" : level.name}
          readOnly
          placeholder="Auto-filled from Employee Code"
          className="bg-gray-50 text-gray-500 cursor-not-allowed"
        />
      </FieldWrap>

      <div className="grid grid-cols-2 gap-3">
        <FieldWrap label="Email" required>
          <TextInput value={level.email} onChange={(e) => onChange({ email: e.target.value })} />
        </FieldWrap>
        <FieldWrap label="Mobile">
          <TextInput value={level.mobile} onChange={(e) => onChange({ mobile: e.target.value })} />
        </FieldWrap>
      </div>
    </div>
  );
}

export { emptyLevel as emptyApprovalLevel };
