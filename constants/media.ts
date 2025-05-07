export const ALLOWED_IMAGE_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
] as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ALLOWED_IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".svg"] as const;

export type AllowedImageType = typeof ALLOWED_IMAGE_TYPES[number];
export type AllowedImageExtension = typeof ALLOWED_IMAGE_EXTENSIONS[number]; 