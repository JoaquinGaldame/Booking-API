import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

export function FormField({ label, error, hint, children }: FormFieldProps) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error ? <p className="mt-2 text-sm text-alert">{error}</p> : null}
      {!error && hint ? <p className="mt-2 text-xs text-slate">{hint}</p> : null}
    </div>
  );
}
