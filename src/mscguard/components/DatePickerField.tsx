import { forwardRef } from "react";
import DatePicker from "react-datepicker";
import { CalendarDays, Clock } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker-overrides.css";

// Both fields keep the same plain-string contract every page already uses
// (yyyy-mm-dd / HH:mm, matching native <input type="date"/time">) — only the
// picker UI changes, so callers that build epoch timestamps from these
// strings don't need to change.

function toDate(value: string, kind: "date" | "time"): Date | null {
  if (!value) return null;
  if (kind === "date") {
    const [y, m, d] = value.split("-").map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  }
  const [h, min] = value.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(min)) return null;
  const d = new Date();
  d.setHours(h, min, 0, 0);
  return d;
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

// NOTE: this must NOT be named `placeholder` — react-datepicker's own Input
// wrapper clones this element via React.cloneElement and always includes a
// `placeholder` key in the config object (mapped from its own top-level
// `placeholderText` prop, which we don't set). cloneElement overwrites props
// even when the new value is `undefined`, so a same-named `placeholder` prop
// here would always get clobbered back to undefined. `placeholderLabel` sits
// outside react-datepicker's known prop set, so it survives the clone.
const CustomInput = forwardRef<
  HTMLButtonElement,
  { value?: string; onClick?: () => void; placeholderLabel?: string; icon: "date" | "time"; className?: string }
>(({ value, onClick, placeholderLabel, icon, className = "" }, ref) => (
  <button
    type="button"
    ref={ref}
    onClick={onClick}
    className={`w-full bg-white border border-gray-300 focus:border-blue-600 outline-none text-gray-800 rounded-md px-3 py-2 text-sm text-left flex items-center justify-between gap-2 transition-colors ${className}`}
  >
    <span className={value ? "" : "text-gray-400"}>{value || placeholderLabel || "Select"}</span>
    {icon === "date" ? <CalendarDays size={16} className="text-gray-400 shrink-0" /> : <Clock size={16} className="text-gray-400 shrink-0" />}
  </button>
));
CustomInput.displayName = "DatePickerCustomInput";

interface DatePickerFieldProps {
  value: string; // "yyyy-mm-dd"
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  maxDate?: Date;
}

export function DatePickerField({ value, onChange, placeholder = "dd-mm-yyyy", className, maxDate }: DatePickerFieldProps) {
  return (
    <DatePicker
      selected={toDate(value, "date")}
      onChange={(date) => onChange(date ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` : "")}
      dateFormat="dd-MM-yyyy"
      maxDate={maxDate}
      isClearable={!!value}
      customInput={<CustomInput icon="date" placeholderLabel={placeholder} className={className} />}
    />
  );
}

interface TimePickerFieldProps {
  value: string; // "HH:mm"
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function TimePickerField({ value, onChange, placeholder = "--:-- --", className }: TimePickerFieldProps) {
  return (
    <DatePicker
      selected={toDate(value, "time")}
      onChange={(date) => onChange(date ? `${pad(date.getHours())}:${pad(date.getMinutes())}` : "")}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={15}
      dateFormat="h:mm aa"
      isClearable={!!value}
      customInput={<CustomInput icon="time" placeholderLabel={placeholder} className={className} />}
    />
  );
}
