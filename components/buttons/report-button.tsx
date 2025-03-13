import React from "react";
import clsx from "clsx";

interface ReportButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

const ReportButton: React.FC<ReportButtonProps> = ({size = "md", className, ...props}) => {
  const baseStyles =
    "bg-btn-danger text-btn-primary-text rounded-lg transition-all duration-200 flex items-center  justify-center w-fit";

  const sizes = {
    sm: "p-2 w-8 h-8",
    md: "p-2 w-10 h-10",
    lg: "p-3 w-12 h-12",
  };

  return (
    <button className={clsx(baseStyles, sizes[size], className)} {...props} onClick={props.onClick}>
      <span className="material-symbols-outlined">block</span>
    </button>
  );
};

export default ReportButton;
