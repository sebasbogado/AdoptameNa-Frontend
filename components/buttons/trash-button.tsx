import React from "react";
import clsx from "clsx";

interface TrashButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
}

const TrashButton: React.FC<TrashButtonProps> = ({ size = "md", className, ...props }) => {
  const baseStyles = "bg-btn-trash text-btn-danger rounded-full transition-all duration-200 flex items-center  justify-center w-fit";

  const sizes = {
    sm: "p-2 w-8 h-8",
    md: "p-2 w-10 h-10",
    lg: "p-3 w-12 h-12",
  };

  return (
    <button className={clsx(baseStyles, sizes[size], className)} {...props}>
      <span className="material-symbols-outlined">
        delete
      </span>    </button>
  );
};

export default TrashButton;
