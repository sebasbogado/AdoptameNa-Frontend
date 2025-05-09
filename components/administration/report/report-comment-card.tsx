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
        <div
            className={clsx(
                "flex gap-3 p-4 bg-white rounded-lg shadow-md w-full min-h-[160px] max-h-[100px] overflow-hidden",
                className
            )}
        >
            <UserAvatar user={comment.user} />

            <div className="flex-1 overflow-hidden">
                <div className="flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center">
                        <div className="font-medium text-gray-800">
                            {comment.user.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                            {getTimeAgo(comment.createdAt)}
                        </div>
                    </div>

                    <p className="mt-1 text-gray-600 max-w-[800px] break-words whitespace-pre-wrap overflow-hidden text-ellipsis">
                        {comment.content}
                    </p>
                </div>
            </div>
        </div>
    );
}
