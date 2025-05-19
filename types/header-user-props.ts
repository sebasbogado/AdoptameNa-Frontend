import { User } from "./auth";
import { Post } from "./post";

export type HeaderUserProps = {

  user: User;
  post: Post;
  routeUserProfile: () => void;
}