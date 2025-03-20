export interface Post {
    id: number;
    idUser: number;
    userFullName?: string;
    title: string;
    content: string;
    idPostType: number;
    locationCoordinates: string;
    contactNumber: string;
    status: string;
    sharedCounter: number;
    publicationDate: string;
    urlPhoto : string;
    postTypeName: string;
}
export type UpdatePost = Omit<Post, 'id'>;
