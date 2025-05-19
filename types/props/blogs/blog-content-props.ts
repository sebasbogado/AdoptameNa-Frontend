import { Post } from "@/types/post";

export interface PostMedia {
  url: string;

}


export interface BlogContentProps {
  post?: Post | null;          
  blogContent: string;      
  
}
