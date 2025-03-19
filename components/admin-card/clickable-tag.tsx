import React, { useState } from "react";
import clsx from "clsx";

interface ClickableTagProps {
  onClick: () => void;
  type?: "default" | "add";
  label?: string;
}

const ClickableTag: React.FC<ClickableTagProps> = ({ onClick, type = "default", label }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={clsx(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset cursor-pointer transition-all duration-200",
        type === "default"
          ? "bg-blue-50 text-blue-700 ring-blue-700/10 hover:bg-blue-100"
          : "bg-blue-50 text-blue-700 ring-blue-600 hover:bg-cyan-100"
      )}
    >
      {type != "add" ? label : <span className="material-symbols-outlined">
        add
      </span>}
      {(isHovered && type !== "add") ? (
        <span className="material-symbols-outlined text-sm mr-1">edit</span>
      ) : null}
    </div>
  );
};

export default ClickableTag;


