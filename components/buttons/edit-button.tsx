import React from "react";
import clsx from "clsx";
import { Edit2, XIcon } from "lucide-react";

interface EditButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "xs" | "sm" | "md" | "lg";
  isEditing: boolean;
}

const EditButton: React.FC<EditButtonProps> = ({ size = "md", className, isEditing, ...props }) => {
  const baseStyles =
    "bg-btn-primary text-btn-primary-text rounded-lg transition-all duration-200 flex items-center justify-center w-fit";

  const sizes = {
    xs: "p-1 w-6 h-6",
    sm: "p-2 w-8 h-8",
    md: "p-2 w-10 h-10",
    lg: "p-3 w-12 h-12",
  };

  const iconSizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <button className={clsx(baseStyles, sizes[size], className)} {...props}>
      {isEditing ? (
        <XIcon className={iconSizes[size]} strokeWidth={2} />
      ) : (
        <Edit2 className={iconSizes[size]} strokeWidth={2} />
      )}
    </button>
  );
};

export default EditButton;