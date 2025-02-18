import React from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

interface EditButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
}

const EditButton: React.FC<EditButtonProps> = ({ size = "md", className, ...props }) => {
  const baseStyles = "bg-btn-primary text-btn-primary-text rounded-lg transition-all duration-200 flex items-center  justify-center";

  const sizes = {
    sm: "p-2 w-8 h-8", 
    md: "p-2 w-10 h-10", 
    lg: "p-3 w-12 h-12", 
  };

  return (
    <button className={clsx(baseStyles, sizes[size], className)} {...props}>
      <PencilIcon className="w-5 h-5" />
    </button>
  );
};

export default EditButton;