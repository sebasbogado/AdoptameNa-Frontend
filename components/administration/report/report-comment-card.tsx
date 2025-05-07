'use client';

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { Comment } from "@/types/comment";
import { UserAvatar } from "@/components/ui/user-avatar";

type ReportCommentCardProps = {
    comment: Comment;
    className?: string;
};

export default function ReportCommentCard({ comment, className }: ReportCommentCardProps) {
    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds} seg`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} h`;
        if (diffInSeconds < 86400 * 3) return `${Math.floor(diffInSeconds / 86400)} días`;

        return date.toLocaleDateString();
    };

    return (
        <div className={clsx("flex gap-3 p-4 bg-white rounded-lg shadow-md", className)}>
             <UserAvatar user={comment.user} />
          

            {/* Contenido del comentario */}
            <div className="flex-1  w-full md:w-[1rem]">
                <div className="flex flex-col">
                  <div className="flex justify-between align-center ">
                    {/* Nombre del usuario */}
                    <div className="font-medium text-gray-800">{comment.user.fullName}</div>
                    {/* Fecha del comentario */}
                    <div className="text-sm flex   text-gray-500">
                      <div className="flex  items-center">
                        {getTimeAgo(comment.createdAt)}
                      </div>
                      
                      </div>

                  </div>

                    {/* Contenido del comentario */}
                    <p className="mt-1 text-gray-600 break-words whitespace-pre-wrap">
                        {comment.content}
                    </p>

                </div>
            </div>
        </div>
    );
}
