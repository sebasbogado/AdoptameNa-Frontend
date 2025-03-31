import { useState, useEffect, useRef } from "react";
import { Comments } from "@/components/comments/comments";
import { Comment, CommentResponse } from "@/types/comment";
import { User } from "@/types/auth";
import {
    getPostComments,
    getPetComments,
    createComment,
    likeComment,
    deleteComment,
    getCommentReplies
} from "@/utils/comments.http";

interface PostCommentsProps {
    user: User | null;
    userLoading: boolean;
    referenceType: "POST" | "PET";
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
            } else {
                response = await getPetComments(
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

    // Set up intersection observer for infinite scrolling con mejora para evitar peticiones duplicadas
    useEffect(() => {
        // Si ya estamos cargando, no configurar un nuevo observer
        if (loadingMoreComments) return;

        const observer = new IntersectionObserver(
            (entries) => {
                // Solo cargar más si:
                // 1. El elemento es visible
                // 2. Hay más comentarios por cargar
                // 3. No estamos cargando actualmente
                // 4. Tenemos un cursor válido
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

            // Refresh comments to show the new one
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

            // Update UI optimistically - toggle the liked status locally
            setComments(prev => updateCommentLikeStatus(prev, commentId));
        } catch (error) {
            console.error("Error liking comment:", error);
            fetchComments(); // Revert optimistic update on failure
        } finally {
            setLoadingLikes(prev => ({ ...prev, [commentId]: false }));
        }
    };

    // Helper function to update like status in nested comments
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

    const handleDelete = async (commentId: number) => {
        if (!user || !authToken) {
            return;
        }

        try {
            await deleteComment(commentId, authToken);

            // Remove deleted comment from state recursively
            setComments(prev => removeCommentById(prev, commentId));
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    // Helper function to remove comment by ID (handles nested comments)
    const removeCommentById = (commentsList: Comment[], targetId: number): Comment[] => {
        return commentsList.filter(comment => {
            if (comment.id === targetId) {
                return false;
            }

            if (comment.replies && comment.replies.length > 0) {
                comment.replies = removeCommentById(comment.replies, targetId);
            }

            return true;
        });
    };

    const handleReply = async (commentId: number, content: string) => {
        if (!user || !authToken) {
            return;
        }

        try {
            // Set loading state for this specific reply
            setLoadingReplies(prev => ({ ...prev, [commentId]: true }));

            await createComment(
                content,
                referenceId,
                referenceType,
                commentId, // parentId = commentId for replies
                authToken
            );

            // Refresh comments to show the new reply
            fetchComments();
        } catch (error) {
            console.error("Error adding reply:", error);
        } finally {
            // Clear loading state for this specific reply
            setLoadingReplies(prev => ({ ...prev, [commentId]: false }));
        }
    };

    const handleLoadMoreReplies = async (commentId: number, cursor: number | null) => {
        try {
            setLoadingReplies(prev => ({ ...prev, [commentId]: true }));

            const response = await getCommentReplies(
                commentId,
                cursor ?? undefined, // Convert null to undefined
                10,
                authToken
            );

            // Function to update nested comments
            const updateCommentReplies = (comments: Comment[]): Comment[] => {
                return comments.map(comment => {
                    if (comment.id === commentId) {
                        // If replies array exists, append new ones, otherwise create new array
                        const existingReplies = comment.replies || [];
                        return {
                            ...comment,
                            replies: cursor ? [...existingReplies, ...response.comments] : response.comments,
                            nextRepliesCursor: response.nextCursor ?? 0
                        };
                    } else if (comment.replies && comment.replies.length > 0) {
                        // Recursive check for nested replies
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

    return (
        <>
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