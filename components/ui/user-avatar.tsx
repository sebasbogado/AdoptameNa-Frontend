"use client";

import { User } from "@/types/auth";
import { useRouter } from "next/navigation";
import clsx from "clsx";

interface UserAvatarProps {
  user?: User;
  userId?: number;
  fullName?: string;
  nombre?: string; // Nuevo prop
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const UserAvatar = ({
  user,
  userId,
  fullName,
  nombre, // Nuevo prop
  size = "md",
  className,
}: UserAvatarProps) => {
  const router = useRouter();

  const id = userId || user?.id;
  const name = nombre || fullName || user?.fullName || "User"; // Prioridad actualizada

  const getColorFromName = (name: string) => {
    const colors = [
      "bg-light-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];
    const charSum = name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charSum % colors.length];
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const handleProfileClick = () => {
    if (id) {
      router.push(`/profile/${id}`);
    }
  };

  return (
    <div
      onClick={handleProfileClick}
      className={clsx(
        "rounded-full flex items-center justify-center text-white font-medium cursor-pointer overflow-hidden flex-shrink-0",
        sizeClasses[size],
        getColorFromName(name),
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
};