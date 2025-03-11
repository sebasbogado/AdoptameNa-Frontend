export interface Post {
    id: number;
    idUser: number;
    title: string;
    content: string;
    idPostType: number;
    locationCoordinates: string;
    contactNumber: string;
    status: string;
    sharedCounter: number;
    publicationDate: string;
    imageUrl: string;
}