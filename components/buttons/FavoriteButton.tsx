import React from "react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

import clsx from "clsx";

interface HeartButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
 variant?: "active" | "desactivated";

  size?: "sm" | "md" | "lg";
}

const FavoriteButton: React.FC<HeartButtonProps> = ({variant = "desactivated", size = "md", className, ...props }) => {
  const baseStyles = "bg-btn-favorite text-btn-favorite-text rounded-full transition-all duration-200 flex items-center  justify-center";

  const sizes = {
    sm: "p-2 w-8 h-8", 
    md: "p-2 w-10 h-10", 
    lg: "p-3 w-12 h-12", 
  };
  const Icon = variant === "active" ? HeartIconSolid : HeartIcon;

  return (
    <button className={clsx(baseStyles, sizes[size], className)} {...props}>
         <Icon className="w-6 h-6" />
    </button>
  );
};

export default FavoriteButton;