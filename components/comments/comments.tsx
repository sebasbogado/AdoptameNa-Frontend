"use client";

import { CommentItem } from "./comment-item";
import { CommentForm } from "./comment-form";
import { User } from "@/types/auth";
import { Comment } from "@/types/comment";


interface CommentsProps {
    comments: Comment[];
    onAddComment?: (content: string) => void;
    onLike?: (commentId: string) => void;
    onReport?: (commentId: string) => void;
    onReply?: (commentId: string, content: string) => void;
    title?: string;
    currentUser?: User | null;
}
export function Comments({
    comments,
    onAddComment,
    onLike,
    onReport,
    onReply,
    title = "Comentarios",
    currentUser,
}: CommentsProps) {
    return (
        <div className="pl-12 w-full bg-white rounded-lg  shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-700 ">{title}</h2>
            </div>
            <div className="p-6 space-y-6">
                {onAddComment && currentUser && (
                    <>
                        <CommentForm onSubmit={onAddComment} />
                        {comments.length > 0 && <div className="h-px bg-gray-200 my-6" />}
                    </>
                )}

                {comments.length > 0 ? (
                    <div className="space-y-6">
                        {comments.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                onLike={onLike}
                                onReport={onReport}
                                onReply={onReply}
                                currentUser={currentUser}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 text-gray-500">
                        No hay comentarios todavía. Sé el primero en comentar.
                    </div>
                )}
            </div>
        </div>
    );
}