import { Post } from './post';

export interface Favorites {
    id: string;
    idPost: string;
    post: Post;
}