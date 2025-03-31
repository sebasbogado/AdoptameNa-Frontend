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
    onLike?: (commentId: string) => void;
    onReport?: (commentId: string) => void;
    onReply?: (commentId: string, content: string) => void;
    currentUser?: User | null;
    level?: number;
}

export function CommentItem({
    comment,
    onLike,
    onReport,
    onReply,
    currentUser,
    level = 0
}: CommentItemProps) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const router = useRouter()

    const handleReply = (content: string) => {
        if (onReply) {
            onReply(comment.id, content);
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
        console.log(currentUser)
        router.push(`/profile/${comment.user.id}`)
    }
    return (
        <div className={`flex gap-3 ${level > 0 ? 'ml-12' : ''}`}>
            <UserAvatar user={comment.user} />

            <div className="flex-1">
                <div className={`${level > 0 ? 'p-3 bg-gray-50 rounded-lg' : ''}`}>
                    <div className="flex flex-col">
                    <div  onClick={routeUserProfile} className="font-medium cursor-pointer  hover:underline">{comment.user.fullName}</div>
                    <p className="text-gray-800 mt-1">{comment.content}</p>

                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-500 flex-wrap">
                            <span>{getTimeAgo(comment.createdAt)}</span>

                            {onLike && (
                                <button
                                    onClick={() => handleAction(() => onLike(comment.id))}
                                    className={`hover:text-light-blue-600 ${comment.liked ? 'text-light-blue-600 font-medium' : ''}`}
                                >
                                    Me gusta{comment.likes ? ` (${comment.likes})` : ''}
                                </button>
                            )}

                            {onReport && (
                                <button
                                    onClick={() => handleAction(() => onReport(comment.id))}
                                    className={`hover:text-red-600 ${comment.reported ? 'text-red-600' : ''}`}
                                >
                                    Reportar
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
                                onReport={onReport}
                                onReply={level < 1 ? onReply : undefined}
                                currentUser={currentUser}
                                level={level + 1}
                            />
                        ))}
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