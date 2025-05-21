import { z } from "zod";

export const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "video/mp4", "video/webm"];
export const maxFileSize = 5 * 1024 * 1024; // 5MB

export const fileSchema = z
  .instanceof(File)
  .refine(file => allowedTypes.includes(file.type), {
    message: "El archivo debe ser una imagen (PNG, JPEG o WEBP) o un video (MP4 o WEBM)",
  })
  .refine(file => file.size <= maxFileSize, {
    message: "El tamaño del archivo debe ser menor a 5MB",
  }); 