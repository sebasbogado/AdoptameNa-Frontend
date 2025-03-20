"use client"

import { User } from "@/types/auth"


interface UserAvatarProps {
    user: User;
    size?: "sm" | "md" | "lg";
}


export const UserAvatar = ({ user, size = "md" }: UserAvatarProps) => {
    const getColorFromName = (name: string) => {
        const colors = [
            "bg-blue-500",
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

    const sizeClasses = {
        sm: "w-8 h-8 text-xs",
        md: "w-10 h-10 text-sm",
        lg: "w-12 h-12 text-base"
    };

    return (
        <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0`}>

            <div
                className={`w-full h-full flex items-center justify-center ${getColorFromName(user.fullName)} text-white font-medium`}
            >
                {user.fullName.charAt(0).toUpperCase()}
            </div>

        </div>
    );
}