import { useState, useEffect } from "react";
import { Comments } from "@/components/comments/comments";
import { Comment } from "@/types/comment";
import { User } from "@/types/auth";
import { addComment, addReply, getComments, toggleLike, toggleReport } from "@/utils/comments-client";

interface PostCommentsProps {
    user: User | null;
    userLoading: boolean;
}

const PostComments = ({ user, userLoading }: PostCommentsProps) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentsLoading, setCommentsLoading] = useState<boolean>(true);

    useEffect(() => {
        setComments(getComments());
        setCommentsLoading(false);
    }, []);

    const handleAddComment = (content: string) => {
        const updatedComments = addComment(content, user as User);
        setComments(updatedComments);
    };

    const handleLike = (commentId: string) => {
        const updatedComments = toggleLike(commentId);
        setComments(updatedComments);
    };

    const handleReport = (commentId: string) => {
        const updatedComments = toggleReport(commentId);
        setComments(updatedComments);
    };

    const handleReply = (commentId: string, content: string) => {
        const updatedComments = addReply(commentId, content, user as User);
        setComments(updatedComments);
    };

    return (
        <>
            {commentsLoading && userLoading ?
                <div className="max-w-2xl mx-auto py-8 px-4 flex items-center justify-center min-h-[300px]">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-2 text-gray-600">Cargando comentarios...</p>
                    </div>
                </div> :
                <Comments
                    comments={comments}
                    onAddComment={handleAddComment}
                    onLike={handleLike}
                    onReport={handleReport}
                    onReply={handleReply}
                    currentUser={user}
                />
            }
        </>
    );
};

export default PostComments;