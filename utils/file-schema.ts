import { z } from "zod";

export const allowedImageTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp"
];

export const allowedVideoTypes = [
  "video/mp4",
  "video/webm"
];

export const allowedAllTypes = [...allowedImageTypes, ...allowedVideoTypes];

export const maxFileSize = 5 * 1024 * 1024; // 5MB

export const fileSchema = z
  .instanceof(File)
  .refine(file => allowedAllTypes.includes(file.type), {
    message: "El archivo debe ser una imagen (PNG, JPEG, JPG, WEBP) o un video (MP4 o WEBM)",
  })
  .refine(file => file.size <= maxFileSize, {
    message: "El tamaño del archivo debe ser menor a 5MB",
  });

export const blogFileSchema = z
  .instanceof(File)
  .refine(file => allowedImageTypes.includes(file.type), {
    message: "Solo puedes subir imágenes (PNG, JPEG, JPG, WEBP) en blogs",
  })
  .refine(file => file.size <= maxFileSize, {
    message: "El tamaño del archivo debe ser menor a 5MB",
  });