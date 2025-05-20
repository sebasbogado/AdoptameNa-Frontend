import { User } from "./auth";
import { Post } from "./post";

export type HeaderUserProps = {

  post: Post;
  routeUserProfile: () => void;
}