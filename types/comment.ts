import { User } from "./auth";

export interface Comment {
  id: number;
  user: User;
  content: string;
  createdAt: string;
  likesCount: number;
  liked: boolean;
  reported?: boolean;
  replies?: Comment[];
  referenceType?: string;
  referenceId?: number;
  totalReplies: number;
  nextRepliesCursor: number;
}

export interface CommentResponse {
  comments: Comment[];
  nextCursor: number | null;
  hasMore: boolean;
}
