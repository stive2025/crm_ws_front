// src/components/common/Button.tsx

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`login-button ${className}`}  // ← usa TU clase + extras
      disabled={loading || disabled}
      {...props}
    >
      {loading ? 'Cargando...' : children}
    </button>
  );
};