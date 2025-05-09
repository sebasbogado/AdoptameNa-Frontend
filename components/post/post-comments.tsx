import { useState, useEffect, useRef } from "react";
import { Comments } from "@/components/comments/comments";
import { Comment, CommentResponse } from "@/types/comment";
import { User } from "@/types/auth";
import Modal from "@/components/modal";

import {
    getPostComments,
    getPetComments,
    createComment,
    likeComment,
    deleteComment,
    getCommentReplies,
    getProductComments
} from "@/utils/comments.http";
import ReportForm from "../report-form";

interface PostCommentsProps {
    user: User | null;
    userLoading: boolean;
    referenceType: "POST" | "PET" | "PRODUCT";
    referenceId: number;
    authToken?: string;
}

const PostComments = ({ user, userLoading, referenceType, referenceId, authToken }: PostCommentsProps) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentsLoading, setCommentsLoading] = useState<boolean>(true);
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [nextCursor, setNextCursor] = useState<number | null>(null);
    const [loadingReplies, setLoadingReplies] = useState<{ [key: number]: boolean }>({});
    const [loadingLikes, setLoadingLikes] = useState<{ [key: number]: boolean }>({});
    const [isAddingComment, setIsAddingComment] = useState<boolean>(false);
    const [loadingMoreComments, setLoadingMoreComments] = useState<boolean>(false);
    const observerRef = useRef<HTMLDivElement>(null);
    const [modalReport, setModalReport] = useState(false);
    const [commentId, setCommentId] = useState<number | null>(null);

    const fetchComments = async (cursor?: number) => {
        try {
            if (cursor) {
                setLoadingMoreComments(true);
            } else {
                setCommentsLoading(true);
            }

            let response: CommentResponse;

            if (referenceType === "POST") {
                response = await getPostComments(
                    referenceId,
                    cursor,
                    20,
                    5,
                    authToken
                );
            } else if (referenceType === "PET") {
                response = await getPetComments(
                    referenceId,
                    cursor,
                    20,
                    5,
                    authToken
                );
            } else {
                response = await getProductComments(
                    referenceId,
                    cursor,
                    20,
                    5,
                    authToken
                );
            }

            if (cursor) {
                setComments(prev => [...prev, ...response.comments]);
            } else {
                setComments(response.comments);
            }

            setNextCursor(response.nextCursor);
            setHasMore(response.hasMore);
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setCommentsLoading(false);
            setLoadingMoreComments(false);
        }
    };

    useEffect(() => {
        if (loadingMoreComments) return;

        const observer = new IntersectionObserver(
            (entries) => {

                if (entries[0].isIntersecting &&
                    hasMore &&
                    !loadingMoreComments &&
                    !commentsLoading &&
                    nextCursor) {
                    fetchComments(nextCursor);
                }
            },
            { threshold: 0.1 }
        );

        const currentObserver = observerRef.current;
        if (currentObserver) {
            observer.observe(currentObserver);
        }

        return () => {
            if (currentObserver) {
                observer.unobserve(currentObserver);
            }
        };
    }, [hasMore, commentsLoading, nextCursor, loadingMoreComments]);

    useEffect(() => {
        if (referenceId) {
            fetchComments();
        }
    }, [referenceId, referenceType, authToken]);

    const handleAddComment = async (content: string) => {
        if (!user || !authToken) {
            return;
        }

        try {
            setIsAddingComment(true);
            await createComment(
                content,
                referenceId,
                referenceType,
                null,
                authToken
            );

            fetchComments();
        } catch (error) {
            console.error("Error adding comment:", error);
        } finally {
            setIsAddingComment(false);
        }
    };

    const handleLike = async (commentId: number) => {
        if (!user || !authToken) {
            return;
        }

        try {
            setLoadingLikes(prev => ({ ...prev, [commentId]: true }));
            await likeComment(commentId, authToken);

            setComments(prev => updateCommentLikeStatus(prev, commentId));
        } catch (error) {
            console.error("Error liking comment:", error);
            fetchComments();
        } finally {
            setLoadingLikes(prev => ({ ...prev, [commentId]: false }));
        }
    };

    const updateCommentLikeStatus = (commentsList: Comment[], targetId: number): Comment[] => {
        return commentsList.map(comment => {
            if (comment.id === targetId) {
                return {
                    ...comment,
                    liked: !comment.liked,
                    likesCount: comment.liked ? comment.likesCount - 1 : comment.likesCount + 1
                };
            }

            if (comment.replies && comment.replies.length > 0) {
                return {
                    ...comment,
                    replies: updateCommentLikeStatus(comment.replies, targetId)
                };
            }

            return comment;
        });
    };

    const removeCommentById = (commentsList: Comment[], targetId: number): Comment[] => {

        const filteredComments = commentsList.filter(comment => {
            if (comment.id === targetId) {
                return false;
            }

            if (comment.replies && comment.replies.length > 0) {
                const originalReplyCount = comment.replies.length;
                comment.replies = removeCommentById(comment.replies, targetId);

                const removedRepliesCount = originalReplyCount - comment.replies.length;
                if (removedRepliesCount > 0) {
                    comment.totalReplies = Math.max(0, (comment.totalReplies || 0) - removedRepliesCount);
                }
            }

            return true;
        });

        return filteredComments;
    };

    const handleDelete = async (commentId: number) => {
        if (!user || !authToken) {
            return;
        }

        try {
            await deleteComment(commentId, authToken);

            setComments(prevComments => {
                const updatedComments = removeCommentById([...prevComments], commentId);
                return updatedComments;
            });


        } catch (error) {
            console.error("Error deleting comment:", error);
            fetchComments();
        }
    };

    const handleReply = async (commentId: number, content: string) => {
        if (!user || !authToken) {
            return;
        }

        try {
            setLoadingReplies(prev => ({ ...prev, [commentId]: true }));

            await createComment(
                content,
                referenceId,
                referenceType,
                commentId,
                authToken
            );

            fetchComments();
        } catch (error) {
            console.error("Error adding reply:", error);
        } finally {
            setLoadingReplies(prev => ({ ...prev, [commentId]: false }));
        }
    };

    const handleLoadMoreReplies = async (commentId: number, cursor: number | null) => {
        try {
            setLoadingReplies(prev => ({ ...prev, [commentId]: true }));

            const response = await getCommentReplies(
                commentId,
                cursor ?? undefined,
                10,
                authToken
            );


            const updateCommentReplies = (comments: Comment[]): Comment[] => {
                return comments.map(comment => {
                    if (comment.id === commentId) {
                        const existingReplies = comment.replies || [];
                        return {
                            ...comment,
                            replies: cursor ? [...existingReplies, ...response.comments] : response.comments,
                            nextRepliesCursor: response.nextCursor ?? 0
                        };
                    } else if (comment.replies && comment.replies.length > 0) {
                        return {
                            ...comment,
                            replies: updateCommentReplies(comment.replies)
                        };
                    }
                    return comment;
                });
            };

            setComments(prev => updateCommentReplies(prev));
        } catch (error) {
            console.error("Error loading more replies:", error);
        } finally {
            setLoadingReplies(prev => ({ ...prev, [commentId]: false }));
        }
    };

    const handleReport = (commentId: number) => {
        setModalReport(true);
        setCommentId(commentId);
    }
    return (
        <>
            <Modal isOpen={modalReport} onClose={() => setModalReport(false)} title="Reportar comentario">
                <ReportForm idComment={commentId?.toString()} handleClose={() => setModalReport(false)} />
            </Modal>
            {commentsLoading && comments.length === 0 ? (
                <div className="max-w-2xl mx-auto py-8 px-4 flex items-center justify-center min-h-[300px]">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-2 text-gray-600">Cargando comentarios...</p>
                    </div>
                </div>
            ) : (
                <div className="w-full">
                    <Comments
                        comments={comments}
                        onAddComment={handleAddComment}
                        onLike={handleLike}
                        onDelete={handleDelete}
                        onReport={(id) => { handleReport(id)}}
                        onReply={handleReply}
                        onLoadMoreReplies={handleLoadMoreReplies}
                        loadingReplies={loadingReplies}
                        loadingLikes={loadingLikes}
                        isAddingComment={isAddingComment}
                        currentUser={user}
                    />

                    {/* Infinite scroll trigger element */}
                    {hasMore && (
                        <div ref={observerRef} className="h-20 flex items-center justify-center">
                            {loadingMoreComments && (
                                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default PostComments;