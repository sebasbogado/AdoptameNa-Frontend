export const ALLOWED_IMAGE_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "video/mp4",
    "video/webm"
] as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ALLOWED_IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".mp4", ".webm"] as const;

export type AllowedImageType = typeof ALLOWED_IMAGE_TYPES[number];
export type AllowedImageExtension = typeof ALLOWED_IMAGE_EXTENSIONS[number]; 