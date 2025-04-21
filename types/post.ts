import { Media } from "./media";
import { PostType } from "./post-type";

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
  urlPhoto: string;
  postType: PostType;
  media: Media[];
}

export interface CreatePost {
  title: string;
  content: string;
  postTypeId: number;
  locationCoordinates: string;
  contactNumber: string;
  status: string;
  sharedCounter: number;
  mediaIds: number[];
}

export interface UpdatePost {
  title: string;
  content: string;
  idPostType: number;
  locationCoordinates: string;
  contactNumber: string;
  status: string;
  mediaIds: number[];
}
