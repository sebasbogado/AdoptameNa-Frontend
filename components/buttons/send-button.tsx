import React from "react";
import clsx from "clsx";
import { Send } from "lucide-react";

interface SendButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

const SendButton: React.FC<SendButtonProps> = ({ size = "md", className, ...props }) => {
  const baseStyles =
    "bg-btn-primary text-btn-primary-text rounded-lg transition-all duration-200 flex items-center  justify-center w-fit disabled:opacity-50 disabled:cursor-not-allowed";

  const sizes = {
    sm: "p-2 w-8 h-8",
    md: "p-2 w-10 h-10",
    lg: "p-3 w-12 h-12",
  };

  return (
    <button className={clsx(baseStyles, sizes[size], className)} {...props} onClick={props.onClick}>
      <Send className="w-6 h-6 " strokeWidth={2} />
    </button>
  );
};

export default SendButton;
