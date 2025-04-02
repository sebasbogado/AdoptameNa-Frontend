import React from "react";
import clsx from "clsx";
import { Edit2, XIcon } from "lucide-react";

interface EditButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  isEditing : boolean;
}

const EditButton: React.FC<EditButtonProps> = ({ size = "md", className, isEditing, ...props }) => {
  const baseStyles = "bg-btn-primary text-btn-primary-text rounded-lg transition-all duration-200 flex items-center  justify-center w-fit";

  const sizes = {
    sm: "p-2 w-8 h-8",
    md: "p-2 w-10 h-10",
    lg: "p-3 w-12 h-12",
  };

  return (
    <button className={clsx(baseStyles, sizes[size], className)} {...props}>
        {
          isEditing ? (
            <XIcon className="w-6 h-6 "  strokeWidth={2} />

          ) : (
            <Edit2 className="w-6 h-6 "  strokeWidth={2} />

          )
        }
         </button>
  );
};

export default EditButton;
