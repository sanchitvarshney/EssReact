import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

interface FieldWrapProps {
  label: string;
  required?: boolean;
  children: ReactNode;
}

export function FieldWrap({ label, required, children }: FieldWrapProps) {
  return (
    <label className="block mb-4">
      <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full bg-white border border-gray-300 focus:border-blue-600 outline-none text-gray-800 placeholder-gray-400 rounded-md px-3 py-2 text-sm transition-colors";

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className || ""}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClass} ${props.className || ""}`} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputClass} ${props.className || ""}`} />;
}

export function PrimaryButton({
  children,
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`bg-blue-700 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-md px-4 py-2 text-sm transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed rounded-md px-4 py-2 text-sm transition-colors ${className}`}
    >
      {children}
    </button>
  );
}
