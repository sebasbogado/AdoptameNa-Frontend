import React from "react";

import clsx from "clsx";
import { Heart } from "lucide-react";

interface HeartButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
 variant?: "active" | "desactivated";

  size?: "sm" | "md" | "lg" | "xl";
}

const FavoriteButton: React.FC<HeartButtonProps> = ({variant = "desactivated", size = "md", className, ...props }) => {
  const baseStyles = "bg-btn-favorite text-btn-favorite-text rounded-full transition-all duration-200 flex items-center  justify-center w-fit";

  const sizes = {
    sm: "p-2 w-8 h-8", 
    md: "p-2 w-10 h-10", 
    lg: "p-3 w-12 h-12", 
    xl: "p-2 w-14 h-14", 
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12  h-12",
  };
  return (
    <button className={clsx(baseStyles, sizes[size], className)} {...props}>
      <Heart
        className={clsx(iconSizes[size], {
          "fill-btn-favorite-text": variant === "active",
        })}
        strokeWidth={variant === "active" ? 0 : 3}
      />
    </button>
  );
};

export default FavoriteButton;
