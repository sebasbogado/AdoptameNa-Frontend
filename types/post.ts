import { Media } from "./media";
import { PostType } from "./post-type";

export interface Post {
  id: number;
  idUser: number;
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
  idUser: number;
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
    idUser: number;
    title: string;
    content: string;
    idPostType: number;
    locationCoordinates: string;
    contactNumber: string;
    status: string;
    mediaIds: number[];
  }