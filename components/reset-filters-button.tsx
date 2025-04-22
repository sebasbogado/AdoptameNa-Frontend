"use client";

import { X } from "lucide-react";

interface ResetFiltersButtonProps {
  onClick: () => void;
  title?: string;
  className?: string;
}

export default function ResetFiltersButton({
  onClick,
  title = "Limpiar filtros",
  className = "",
}: ResetFiltersButtonProps) {
  return (
    <div className={`flex items-end justify-start ${className}`}>
      <button
        onClick={onClick}
        title={title}
        className="p-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded flex items-center justify-center"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}