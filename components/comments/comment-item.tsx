"use client";

import { useState } from "react";
import { CommentForm } from "./comment-form";
import { User } from "@/types/auth";
import { UserAvatar } from "../ui/user-avatar";
import { Comment } from "@/types/comment";
import { Alert } from "@material-tailwind/react";
import { useRouter } from "next/navigation";

interface CommentItemProps {
    comment: Comment;
    onLike?: (commentId: number) => void;
    onDelete?: (commentId: number) => void;
    onReport?: (commentId: number) => void;
    onReply?: (commentId: number, content: string) => void;
    onLoadMoreReplies?: (commentId: number, cursor: number | null) => void;
    isLoadingReplies?: boolean;
    isLikeLoading?: boolean;
    isReplyLoading?: boolean; // Add this prop to track reply loading state
    currentUser?: User | null;
    level?: number;
}

export function CommentItem({
    comment,
    onLike,
    onDelete,
    onReport,
    onReply,
    onLoadMoreReplies,
    isLoadingReplies = false,
    isLikeLoading = false,
    isReplyLoading = false, // Use the reply loading state from props
    currentUser,
    level = 0
}: CommentItemProps) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const router = useRouter();

    const handleReply = async (content: string) => {
        if (onReply) {
            await onReply(comment.id, content);
            setShowReplyForm(false);
        }
    };

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

    const handleAction = (action: () => void) => {
        if (showAlert) return;
        if (currentUser) {
            action();
        } else {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);
        }
    };

    const routeUserProfile = () => {
        router.push(`/profile/${comment.user.id}`);
    };

    const isCurrentUserComment = currentUser && comment.user.id === currentUser.id;

    const shouldShowLoadReplies = comment.totalReplies > 0 &&
        (comment.replies?.length === 0 || comment.totalReplies > (comment.replies?.length || 0));

    return (
        <div className={`flex gap-3 ${level > 0 ? 'ml-12' : ''}`}>
            <UserAvatar user={comment.user} />

            <div className="flex-1">
                <div className={`${level > 0 ? 'p-3 bg-gray-50 rounded-lg' : ''}`}>
                    <div className="flex flex-col">
                        <div onClick={routeUserProfile} className="font-medium cursor-pointer hover:underline">
                            {comment.user.fullName}
                        </div>
                        <p className="text-gray-800 mt-1">{comment.content}</p>

                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-500 flex-wrap">
                            <span>{getTimeAgo(comment.createdAt)}</span>

                            {onLike && (
                                <button
                                    onClick={() => handleAction(() => onLike(comment.id))}
                                    disabled={isLikeLoading}
                                    className={`flex items-center hover:text-light-blue-600 ${comment.liked ? 'text-light-blue-600 font-medium' : ''} ${isLikeLoading ? 'opacity-60' : ''}`}
                                >
                                    {isLikeLoading && comment.id ? (
                                        <div className="w-3 h-3 mr-1 border-2 border-light-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    ) : null}
                                    Me gusta{comment.likesCount > 0 ? ` (${comment.likesCount})` : ''}
                                </button>
                            )}

                            {onReport && !isCurrentUserComment && (
                                <button
                                    onClick={() => handleAction(() => onReport(comment.id))}
                                    className={`hover:text-red-600 ${comment.reported ? 'text-red-600' : ''}`}
                                >
                                    Reportar
                                </button>
                            )}

                            {onDelete && isCurrentUserComment && (
                                <button
                                    onClick={() => handleAction(() => onDelete(comment.id))}
                                    className="hover:text-red-600"
                                >
                                    Eliminar
                                </button>
                            )}

                            {onReply && level < 2 && (
                                <button
                                    onClick={() => handleAction(() => setShowReplyForm(!showReplyForm))}
                                    className="hover:text-light-blue-600"
                                >
                                    Responder
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {showReplyForm && onReply && (
                    <div className="mt-3">
                        <CommentForm
                            onSubmit={handleReply}
                            placeholder="Escribe una respuesta..."
                            isSubmitting={isReplyLoading}
                        />
                    </div>
                )}

                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-3 space-y-3">
                        {comment.replies.map((reply) => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                onLike={onLike}
                                onDelete={onDelete}
                                onReport={onReport}
                                onReply={level < 1 ? onReply : undefined}
                                onLoadMoreReplies={onLoadMoreReplies}
                                isLoadingReplies={isLoadingReplies}
                                isLikeLoading={isLikeLoading}
                                currentUser={currentUser}
                                level={level + 1}
                            />
                        ))}
                    </div>
                )}

                {/* Load More Replies Button - Now shows whenever totalReplies > 0 and not all replies are loaded */}
                {shouldShowLoadReplies && onLoadMoreReplies && (
                    <div className={`mt-3 ${level > 0 ? 'ml-12' : ''}`}>
                        <button
                            onClick={() => onLoadMoreReplies(comment.id, comment.nextRepliesCursor)}
                            disabled={isLoadingReplies}
                            className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                        >
                            {isLoadingReplies ? (
                                <span className="flex items-center">
                                    <div className="w-4 h-4 mr-2 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    Cargando respuestas...
                                </span>
                            ) : (
                                comment.replies?.length === 0
                                    ? `Ver respuestas (${comment.totalReplies})`
                                    : `Ver más respuestas (${comment.totalReplies - (comment.replies?.length || 0)})`
                            )}
                        </button>
                    </div>
                )}
            </div>

            {showAlert && (
                <Alert
                    color="red"
                    onClose={() => setShowAlert(false)}
                    className="fixed bottom-4 right-0 m-5 z-50 w-80"
                >
                    Debes estar logueado para dar like, reportar o responder.
                </Alert>
            )}
        </div>
    );
}