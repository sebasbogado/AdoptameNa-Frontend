"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";
import { postMedia } from "@/utils/media.http";

export interface ImagePreview {
  id: number;
  url: string;
  mimeType: string;
  isUploading?: boolean;
}

export function useChatImageUpload() {
  const { authToken } = useAuth();
  const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([]);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const handleImageSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || !authToken) return;

      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      const maxFileSize = 5 * 1024 * 1024;
      const maxImagesPerMessage = 4;

      setUploadError(null);

      const currentImageCount = selectedImages.filter(
        (img) => !img.isUploading && img.id !== -1
      ).length;
      const newImagesCount = files.length;

      if (currentImageCount + newImagesCount > maxImagesPerMessage) {
        setUploadError(
          `Solo puedes enviar un máximo de ${maxImagesPerMessage} imágenes por mensaje. Ya tienes ${currentImageCount} imagen(es) seleccionada(s).`
        );
        event.target.value = "";
        return;
      }

      const validFiles: File[] = [];
      const errorMessages: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!allowedTypes.includes(file.type)) {
          errorMessages.push(
            `El archivo "${file.name}" no es un tipo de imagen válido. Tipos permitidos: JPG, PNG, GIF, WebP.`
          );
          continue;
        }

        if (file.size > maxFileSize) {
          errorMessages.push(
            `El archivo "${file.name}" es demasiado grande. Máximo 5MB.`
          );
          continue;
        }

        validFiles.push(file);
      }

      if (errorMessages.length > 0) {
        setUploadError(errorMessages.join(" "));
        event.target.value = "";
        return;
      }

      if (validFiles.length === 0) {
        event.target.value = "";
        return;
      }

      const placeholderImages: ImagePreview[] = validFiles.map((file) => {
        const blobUrl = URL.createObjectURL(file);
        return {
          id: -1,
          url: blobUrl,
          mimeType: file.type,
          isUploading: true,
        };
      });

      setSelectedImages((prev) => [...prev, ...placeholderImages]);
      setUploadingCount(placeholderImages.length);
      const uploadPromises = placeholderImages.map(
        async (placeholder, index) => {
          try {
            const file = validFiles[index];
            const formData = new FormData();
            formData.append("file", file);

            const response = await postMedia(formData, authToken);

            URL.revokeObjectURL(placeholder.url);

            return {
              id: response.id,
              url: response.url,
              mimeType: file.type,
              isUploading: false,
            };
          } catch (error) {
            console.error("Error uploading image:", error);
            URL.revokeObjectURL(placeholder.url);

            let errorMessage = "Error desconocido";
            if (error instanceof Error) {
              errorMessage = error.message;
            }

            throw new Error(errorMessage);
          }
        }
      );

      try {
        const uploadedImages = await Promise.allSettled(uploadPromises);

        const successfulUploads: ImagePreview[] = [];
        const failedUploads: string[] = [];
        const failedUploadErrors: string[] = [];

        uploadedImages.forEach((result, index) => {
          if (result.status === "fulfilled") {
            successfulUploads.push(result.value);
          } else {
            failedUploads.push(validFiles[index].name);

            const errorMessage = result.reason?.message || "Error desconocido";
            failedUploadErrors.push(errorMessage);
          }
        });

        setSelectedImages((prev) => {
          const newImages = [...prev];
          newImages.splice(-placeholderImages.length, placeholderImages.length);
          newImages.push(...successfulUploads);
          return newImages;
        });
        if (failedUploads.length > 0) {
          const fileLimitError = failedUploadErrors.find(
            (error) =>
              error.includes(
                "Has alcanzado el límite de archivos permitidos"
              ) || error.includes("límite de archivos permitidos")
          );

          if (fileLimitError) {
            if (fileLimitError.includes("Error 400:")) {
              const cleanMessage = fileLimitError.replace("Error 400: ", "");
              setUploadError(cleanMessage);
            } else {
              setUploadError(fileLimitError);
            }
          } else {
            setUploadError(
              `Error al subir ${
                failedUploads.length
              } imagen(es): ${failedUploads.join(", ")}.`
            );
          }
        } else {
          setUploadError(null);
        }
      } catch (error) {
        console.error("Error uploading images:", error);
        setUploadError("Error al subir las imágenes. Intenta de nuevo.");

        setSelectedImages((prev) => {
          const newImages = [...prev];
          newImages.splice(-placeholderImages.length, placeholderImages.length);
          return newImages;
        });
      } finally {
        setUploadingCount(0);
      }

      event.target.value = "";
    },
    [authToken]
  );
  const removeImage = useCallback((index: number) => {
    setSelectedImages((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  }, []);
  const getImageIds = useCallback((): number[] => {
    return selectedImages
      .filter((image) => !image.isUploading && image.id !== -1)
      .map((image) => image.id);
  }, [selectedImages]);

  const getImages = useCallback((): ImagePreview[] => {
    return selectedImages.filter(
      (image) => !image.isUploading && image.id !== -1
    );
  }, [selectedImages]);

  const clearImages = useCallback(() => {
    setSelectedImages([]);
    setUploadError(null);
  }, []);
  const clearError = useCallback(() => {
    setUploadError(null);
  }, []);

  return {
    selectedImages,
    isUploading: uploadingCount > 0,
    uploadingCount,
    uploadError,
    setUploadError,
    clearError,
    handleImageSelect,
    removeImage,
    getImageIds,
    getImages,
    clearImages,
    hasImages: selectedImages.some(
      (image) => !image.isUploading && image.id !== -1
    ),
  };
}
