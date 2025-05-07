"use client";

import { Comment, CommentResponse } from "@/types/comment";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/comments`;

// Update a comment
export const updateComment = async (
  id: number,
  content: string,
  token: string
): Promise<Comment> => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Delete a comment
export const deleteComment = async (
  id: number,
  token: string
): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Create a new comment
export const createComment = async (
  content: string,
  referenceId: number,
  referenceType: "PET" | "POST" | "PRODUCT",
  parentId: number | null,
  token: string
): Promise<Comment> => {
  const response = await axios.post(
    `${API_URL}`,
    { content, referenceId, referenceType, parentId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Like a comment
export const likeComment = async (id: number, token: string): Promise<void> => {
  await axios.post(
    `${API_URL}/${id}/like`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Get replies to a comment
export const getCommentReplies = async (
  id: number,
  cursor?: number,
  size: number = 20,
  token?: string
): Promise<CommentResponse> => {
  const params = new URLSearchParams();
  if (cursor) params.append("cursor", cursor.toString());
  params.append("size", size.toString());

  const config: any = {};
  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  const response = await axios.get(
    `${API_URL}/${id}/replies?${params.toString()}`,
    config
  );
  return response.data;
};

// Get comments for a post
export const getPostComments = async (
  postId: number,
  cursor?: number,
  size: number = 20,
  repliesPerComment: number = 5,
  token?: string
): Promise<CommentResponse> => {
  const params = new URLSearchParams();
  if (cursor) params.append("cursor", cursor.toString());
  params.append("size", size.toString());
  params.append("repliesPerComment", repliesPerComment.toString());

  const config: any = {};
  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  const response = await axios.get(
    `${API_URL}/post/${postId}?${params.toString()}`,
    config
  );
  return response.data;
};

// Get comments for a pet
export const getPetComments = async (
  petId: number,
  cursor?: number,
  size: number = 20,
  repliesPerComment: number = 5,
  token?: string
): Promise<CommentResponse> => {
  const params = new URLSearchParams();
  if (cursor) params.append("cursor", cursor.toString());
  params.append("size", size.toString());
  params.append("repliesPerComment", repliesPerComment.toString());

  const config: any = {};
  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  const response = await axios.get(
    `${API_URL}/pet/${petId}?${params.toString()}`,
    config
  );
  return response.data;
};

// Get comments for a product
export const getProductComments = async (
  productId: number,
  cursor?: number,
  size: number = 20,
  repliesPerComment: number = 5,
  token?: string
): Promise<CommentResponse> => {
  const params = new URLSearchParams();
  if (cursor) params.append("cursor", cursor.toString());
  params.append("size", size.toString());
  params.append("repliesPerComment", repliesPerComment.toString());

  const config: any = {};
  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  const response = await axios.get(
    `${API_URL}/product/${productId}?${params.toString()}`,
    config
  );
  return response.data;
};
