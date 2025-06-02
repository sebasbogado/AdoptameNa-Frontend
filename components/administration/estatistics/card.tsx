"use client";

import { ReactNode } from "react";

interface StatCardProps {
  icon?: ReactNode;
  value: number | string;
  label: string;
  className?: string;
  bg?: string; // fondo opcional (ej. "bg-purple-100")
}

export default function StatCard({ icon, value, bg, label, className = "" }: StatCardProps) {
  return (
    <div className={`flex items-center justify-center w-44 h-32 p-5 shadow-lg bg-white rounded-lg ${className}`}>
      {icon && (
        <div className={`mr-3 rounded-full text-gray-700 ${bg ? `p-2 ${bg}` : ''}`}>
          {icon}
        </div>
      )}
      <div>
        <h2 className="text-lg font-semibold">{value}</h2>
        <p className="text-gray-600 text-sm">{label}</p>
      </div>
    </div>
  );
}
