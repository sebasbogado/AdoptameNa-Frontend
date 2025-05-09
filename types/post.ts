import { Media } from "./media";
import { PostType } from "./post-type";
import { Tags } from "./tags";

export interface Post {
  id: number;
  userId: number;
  userFullName: string;
  title: string;
  content: string;
  locationCoordinates: string;
  contactNumber: string;
  status: string;
  sharedCounter: number;
  publicationDate: string;
  postType: PostType;
  media: Media[];
  tags: Tags[];
}

export interface CreatePost {
  title: string;
  content: string;
  tagIds: number[];
  postTypeId: number;
  locationCoordinates: string;
  contactNumber: string;
  userId: number;
  mediaIds: number[];
}

export interface UpdatePost {
  title: string;
  content: string;
  tagIds: number[];
  postTypeId: number;
  locationCoordinates: string;
  contactNumber: string;
  userId: number;
  mediaIds: number[];
}

export interface RestorePost {
  isDeleted: boolean;
}

