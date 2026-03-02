// src/components/common/Input.tsx

import { useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({
  label,
  error,
  id,
  className = "",
  required,
  ...props
}: InputProps) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium"
        >
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}

      <input
        id={inputId}
        required={required}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`login-input ${className}`}
        {...props}
      />

      {error && (
        <p
          id={errorId}
          role="alert"
          aria-live="assertive"
          className="text-red-500 text-xs mt-1"
        >
          {error}
        </p>
      )}
    </div>
  );
};