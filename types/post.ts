import { Media } from "./media";
import { PostType } from "./post-type";
import { Tags } from "./tags";

export interface Post {
  id: number;
  userId: number;
  userFullName: string;
  organizationName: string;
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
  blogImages: Media[];
  hasSensitiveImages: boolean;
}

export interface CreatePost {
  title: string;
  content: string;
  tagIds: number[];
  postTypeId: number;
  locationCoordinates: string;
  contactNumber?: string;
  userId: number;
  mediaIds: number[];
  blogImages?: number[]; // Optional field for blog images
  hasSensitiveImages: boolean;
}

export interface UpdatePost {
  title: string;
  content: string;
  tagIds: number[];
  postTypeId: number;
  locationCoordinates?: string;
  contactNumber?: string;
  userId: number;
  mediaIds: number[];
  blogImages?: number[]; // Optional field for blog images
  hasSensitiveImages: boolean;
}

export interface RestorePost {
  isDeleted: boolean;
}

