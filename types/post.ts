import { PostType } from "./post-type";

export interface Post {
  id: number;
  idUser: number;
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
