import { ProductCategory } from "@/types/product-category";
import { ProductCondition } from "./product-condition";
import { Media } from "./media";
import { Animal } from "./animal";

export interface Product {
  id: number;
  title: string;
  content: string;
  locationCoordinates: string;
  contactNumber: string;
  media: Media[];
  idUser: number;
  userFullName: string;
  price: number;
  category: ProductCategory;
  condition: "NUEVO" | "USADO"; // Enum como string
  sharedCounter: number;
  animals: Animal[];
}

export interface CreateProduct {
  title: string;
  content: string;
  locationCoordinates: string;
  contactNumber: string;
  price: number;
  categoryId: number;
  condition: ProductCondition;
  animalsId: number[];
  mediaIds: number[];
  userId: number;
}
