// components/ui/Button.tsx
import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "tertiary" | "action" | "cta";
  size?: "sm" | "md" | "lg";
}

const Button: React.FC<ButtonProps> = ({ variant = "primary", size = "md", className, children, ...props }) => {
  const baseStyles = "rounded-lg font-medium transition-all duration-200";
  const variants = {
    primary: "bg-btn-primary text-btn-primary-text ",
    secondary: "bg-btn-secondary text-btn-secondary-text border border-btn-secondary-text",
    tertiary: "bg-btn-tertiary text-btn-tertiary-text ",
    danger: "bg-btn-danger text-btn-danger-text",
    action: "bg-btn-action text-btn-action-text ",
    cta: "bg-btn-cta text-btn-cta-text ",
  };
  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button className={clsx(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
};

export default Button;
