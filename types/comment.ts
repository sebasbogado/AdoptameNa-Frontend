import { User } from "./auth";

export interface Comment {
  id: string;
  user: User;
  content: string;
  createdAt: string;
  likes?: number;
  liked?: boolean;
  reported?: boolean;
  replies?: Comment[];
}
