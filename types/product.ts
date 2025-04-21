import { ProductCategory } from "@/types/product-category";

export interface Product{
    id: number;
    title: string;
    content: string;
    locationCoordinates: string;
    contactNumber: string;
    urlPhoto: string;
    idUser: number;
    userFullName: string;
    price: number;
    category: ProductCategory;
    condition: "NUEVO" | "USADO"; // Enum como string
    sharedCounter: number;
}