import React from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Trash } from "lucide-react";

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
      <Trash className="w-6 h-6 " strokeWidth={2} />  
    </button>
  );
};

export default TrashButton;
