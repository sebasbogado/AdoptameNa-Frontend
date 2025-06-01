"use client";

import { CommentItem } from "./comment-item";
import { CommentForm } from "./comment-form";
import { User } from "@/types/auth";
import { Comment } from "@/types/comment";

interface CommentsProps {
    comments: Comment[];
    onAddComment?: (content: string) => void;
    onLike?: (commentId: number) => void;
    onDelete?: (commentId: number) => void;
    onReport?: (commentId: number) => void;
    onReply?: (commentId: number, content: string) => void;
    onLoadMoreReplies?: (commentId: number, cursor: number | null) => void;
    loadingReplies?: { [key: number]: boolean };
    loadingLikes?: { [key: number]: boolean };
    isAddingComment?: boolean;
    title?: string;
    currentUser?: User | null;
}

export function Comments({
    comments,
    onAddComment,
    onLike,
    onDelete,
    onReport,
    onReply,
    onLoadMoreReplies,
    loadingReplies = {},
    loadingLikes = {},
    isAddingComment = false,
    title = "Comentarios",
    currentUser,
}: CommentsProps) {
    return (
        <div className="mt-16 px-4 sm:px-12 w-full bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
            </div>
            <div className="p-6 space-y-6">
                {onAddComment && currentUser && (
                    <>
                        <CommentForm
                            onSubmit={onAddComment}
                            isSubmitting={isAddingComment}
                            placeholder="Escribe un comentario..."
                        />
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
                                onDelete={onDelete}
                                onReport={onReport}
                                onReply={onReply}
                                onLoadMoreReplies={onLoadMoreReplies}
                                isLoadingReplies={loadingReplies[comment.id] || false}
                                isLikeLoading={loadingLikes[comment.id] || false}
                                isReplyLoading={loadingReplies[comment.id] || false}
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