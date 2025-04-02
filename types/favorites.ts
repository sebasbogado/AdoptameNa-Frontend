import { Post } from './post';

export interface Favorites {
    id: string;
    postId: number;
    post: Post;
}