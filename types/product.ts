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
  userId: number;
  animals: Animal[];
  userFullName: string;
  price: number;
  category: ProductCategory;
  condition: "NUEVO" | "USADO"; // Enum como string
  sharedCounter: number;
}

export interface CreateProduct {
  title: string;
  content: string;
  locationCoordinates: string;
  contactNumber: string;
  price: number;
  categoryId: number;
  condition: ProductCondition;
  animalIds: number[];
  mediaIds: number[];
  userId: number;
}

export interface UpdateProduct {
  title: string;
  content: string;
  locationCoordinates: string;
  contactNumber: string;
  price: number;
  categoryId: number;
  condition: ProductCondition;
  animalIds: number[];
  mediaIds: number[];
  userId: number;
}
