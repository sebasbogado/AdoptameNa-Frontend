import { z } from "zod";

export const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
export const maxFileSize = 5 * 1024 * 1024; // 5MB

export const fileSchema = z
  .instanceof(File)
  .refine(file => allowedTypes.includes(file.type), {
    message: "El archivo debe ser una imagen (PNG, JPEG o WEBP)",
  })
  .refine(file => file.size <= maxFileSize, {
    message: "El tamaño de la imagen debe ser menor a 5MB",
  }); 