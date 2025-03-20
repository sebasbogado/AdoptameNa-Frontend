"use client";

import commentsData from "@/lib/comment-example.json";
import { User } from "@/types/auth";
import { Comment } from "@/types/comment";

//funcion para comentarios para usar de forma local y modo de ejemplo
// Todo: Implementar la lógica de comentarios en el servidor y luego actualizar estas funciones

const COMMENTS_STORAGE_KEY = "app_comments";

function initializeComments(): Comment[] {
  if (typeof window === "undefined") {
    return commentsData.comments;
  }

  const savedComments = localStorage.getItem(COMMENTS_STORAGE_KEY);
  if (savedComments) {
    try {
      return JSON.parse(savedComments);
    } catch (e) {
      console.error("Failed to parse saved comments:", e);
    }
  }

  saveComments(commentsData.comments);
  return commentsData.comments;
}

function saveComments(comments: Comment[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
  }
}

export function getComments(): Comment[] {
  return initializeComments();
}

export function addComment(content: string, currentUser: User): Comment[] {
  const comments = getComments();

  const newComment: Comment = {
    id: `comment-${Date.now()}`,
    user: currentUser,
    content,
    createdAt: new Date().toISOString(),
    likes: 0,
    liked: false,
    replies: [],
  };

  const updatedComments = [newComment, ...comments];
  saveComments(updatedComments);

  return updatedComments;
}

export function toggleLike(commentId: string): Comment[] {
  const comments = getComments();

  const updatedComments = comments.map((comment) => {
    if (comment.id === commentId) {
      return {
        ...comment,
        likes: comment.liked
          ? (comment.likes || 1) - 1
          : (comment.likes || 0) + 1,
        liked: !comment.liked,
      };
    }

    // Check if the target comment is in the replies
    if (comment.replies && comment.replies.length > 0) {
      const updatedReplies = comment.replies.map((reply) => {
        if (reply.id === commentId) {
          return {
            ...reply,
            likes: reply.liked
              ? (reply.likes || 1) - 1
              : (reply.likes || 0) + 1,
            liked: !reply.liked,
          };
        }
        return reply;
      });

      return {
        ...comment,
        replies: updatedReplies,
      };
    }

    return comment;
  });

  saveComments(updatedComments);
  return updatedComments;
}

export function toggleReport(commentId: string): Comment[] {
  const comments = getComments();

  const updatedComments = comments.map((comment) => {
    if (comment.id === commentId) {
      return {
        ...comment,
        reported: !comment.reported,
      };
    }

    if (comment.replies && comment.replies.length > 0) {
      const updatedReplies = comment.replies.map((reply) => {
        if (reply.id === commentId) {
          return {
            ...reply,
            reported: !reply.reported,
          };
        }
        return reply;
      });

      return {
        ...comment,
        replies: updatedReplies,
      };
    }

    return comment;
  });

  saveComments(updatedComments);
  return updatedComments;
}

export function addReply(
  commentId: string,
  content: string,
  currentUser: User
): Comment[] {
  const comments = getComments();

  const updatedComments = comments.map((comment) => {
    if (comment.id === commentId) {
      const newReply: Comment = {
        id: `reply-${Date.now()}`,
        user: currentUser,
        content,
        createdAt: new Date().toISOString(),
        likes: 0,
        liked: false,
      };

      return {
        ...comment,
        replies: [...(comment.replies || []), newReply],
      };
    }
    return comment;
  });

  saveComments(updatedComments);
  return updatedComments;
}

export function resetComments(): Comment[] {
  saveComments(commentsData.comments);
  return commentsData.comments;
}
