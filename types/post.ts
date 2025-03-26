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
}

export interface CreatePost {
  idUser: number;
  title: string;
  content: string;
  idPostType: number;
  locationCoordinates: string;
  contactNumber: string;
  status: string;
  sharedCounter: number;
  urlPhoto: string;
}

export interface UpdatePost {
    idUser: number
    title: string
    content: string
    idPostType: number
    locationCoordinates: string
    contactNumber: string
    status: string
    urlPhoto: string
  }