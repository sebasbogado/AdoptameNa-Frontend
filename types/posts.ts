export interface Post {
    postId: string;
    title: string;
    tags: {
        especie: string;
        edad: string;
        tamaño?: string;
        color?: string;
        ciudad: string;
    };
    author: string;
    content: string;
    date: string;
    imageUrl: string;
    postType: string;
}
