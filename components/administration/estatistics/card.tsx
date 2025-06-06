"use client";

import { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";

interface StatCardProps {
  icon?: ReactNode;
  value: number | string;
  label: string;
  className?: string;
  bg?: string; // opcional, ej: "bg-purple-100"
  growthPercentage?: number; // nuevo
  growthLabel?: string; // nuevo, etiqueta para el crecimiento
  path?: string; // opcional, para enlaces
} 

export default function StatCard({ icon, value, bg, label, growthPercentage, growthLabel, path, className = "" }: StatCardProps) {
  const growthColor =
    growthPercentage === undefined
      ? "text-gray-400"
      : growthPercentage > 0
        ? "text-green-600"
        : growthPercentage < 0
          ? "text-red-500"
          : "text-gray-400";

  const GrowthIcon =
    growthPercentage === undefined
      ? null
      : growthPercentage > 0
        ? ArrowUpRight
        : growthPercentage < 0
          ? ArrowDownRight
          : null;

  return (
    <Link href={path || "#"} className="no-underline">
    <div className={`flex items-center justify-center w-44 h-32 p-5 shadow-lg bg-white rounded-lg ${className}`}>
      {icon && (
        <div className={`mr-3 rounded-full text-gray-700 ${bg ? `p-2 ${bg}` : ""}`}>
          {icon}
        </div>
      )}
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-1">
          {value}
          {GrowthIcon && (
            <span className={growthColor}>
              <GrowthIcon className="inline w-4 h-4" />
            </span>
          )}
        </h2>
        <p className="text-gray-600 text-sm">{label}</p>
        {growthPercentage !== undefined && (
          <div className="text-xs">
            <p className={`font-medium ${growthColor}`}>
              {growthPercentage > 0 ? "+" : ""}
              {growthPercentage}%
            </p>
            <p className="text-gray-400 text-[10px] leading-tight">
              vs. {growthLabel ?? "periodo anterior"}
            </p>
          </div>
        )}
      </div>
    </div>
    </Link>
  );
}
