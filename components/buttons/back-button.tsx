"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  label?: string;
  className?: string;
}

export default function BackButton({ label = "Volver", className = "" }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={`flex items-center text-blue-600 hover:underline ${className}`}
    >
      <ArrowLeft size={16} className="mr-1" />
      {label}
    </button>
  );
}
