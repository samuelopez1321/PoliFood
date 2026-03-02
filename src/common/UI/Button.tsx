import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
    
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: ButtonVariant;
    isLoading?: boolean;
}
export const Button = ({
    children,
    variant = 'primary',
    isLoading,
    className = "",
    disabled,
    ...props
}: ButtonProps) => {
    const baseStyles = "px-4 py-2 rounded-lg font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm uppercase tracking-wide";
    const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark shadow-sm",
    secondary: "bg-secondary text-neutral-900 hover:bg-secondary-dark shadow-sm",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    danger: "bg-accent text-white hover:bg-accent-dark shadow-sm",
  };
    return (
        <button className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={disabled || isLoading}>
            {isLoading ? (
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : children}
        </button>
    );
};
export default Button;