'use client'
import { User } from "@/types/auth";
import { Post } from "@/types/post";
import { UserProfile } from "@/types/user-profile";
import React, { useState } from "react";
interface InputProps {
  user: User;
  posts: Post[];
  isDisable: boolean;
  userProfile: UserProfile | null; // <-- Agregar esta línea
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>; // <-- Agregar esta línea
}

export const Detail = ({ posts, userProfile, isDisable, setUserProfile }: InputProps) => {4
  return (
    <div className="relative p-8 left-1/3 transform -translate-x-1/2 bg-white shadow-lg rounded-xl p-5 font-roboto z-40 p-6 bg-white shadow-lg rounded-lg mt-[-50px] w-[55vw]">
      <form>
        <input
          type="text"
          disabled={isDisable}
          value={userProfile?.fullName}
          className="text-5xl font-black bg-transparent border-none focus:outline-none w-full"
          onChange={(e) =>
            setUserProfile((prev) => prev ? { ...prev, fullName: e.target.value } : null)
          }
        />
        <p className="text-foreground text-gray-700 mt-4 text-3xl">{`${posts.length} Publicaciones`}</p>
        <textarea
          disabled={isDisable}
          value={userProfile?.description}
          className="mt-2 text-foreground text-gray-700 mt-8 text-3xl bg-transparent border-none focus:outline-none w-full resize-none"
          onChange={(e) =>
            setUserProfile((prev) => prev ? { ...prev, description: e.target.value } : null)
          }
        />
      </form>
    </div>
  );
};