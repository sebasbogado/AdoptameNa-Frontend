"use client"

import { useRouter } from "next/navigation";
import clsx from "clsx";

interface ChatUserAvatarProps {
  userId: number;
  fullName: string;
  size?: "sm" | "md" | "lg";
}

export const ChatUserAvatar = ({ userId, fullName, size = "md" }: ChatUserAvatarProps) => {
  const router = useRouter();

  const getColorFromName = (name: string) => {
    const colors = [
      "bg-light-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-teal-500"
    ];

    // Use the sum of character codes to determine color
    const charSum = name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charSum % colors.length];
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base"
  };

  const handleClick = () => {
    router.push(`/profile/${userId}`);
  };

  return (
    <div 
      onClick={handleClick}
      className={clsx(
        "rounded-full flex items-center justify-center text-white font-medium cursor-pointer",
        sizeClasses[size],
        getColorFromName(fullName || "User")
      )}
    >
      {getInitials(fullName)}
    </div>
  );
};
