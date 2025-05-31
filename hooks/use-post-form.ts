import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { MAX_BLOG_IMAGES, PostFormValues, postSchema } from "@/validations/post-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Media } from "@/types/media";
import { Tags } from "@/types/tags";

import { allowedImageTypes, blogFileSchema, fileSchema } from "@/utils/file-schema";
import { POST_TYPEID } from "@/types/constants";
import { postMedia } from "@/utils/media.http";

export function usePostForm(setSaveLoading: (loading: boolean) => void, setErrorMessage: (message: string) => void, setPrecautionMessage: (message: string) => void, authToken?: string | null) {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        control,
        trigger,
        formState: { errors },
    } = useForm<PostFormValues>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            postTypeId: 0,
            title: "",
            content: "",
            locationCoordinates: [0, 0],
            contactNumber: "",
            mediaIds: [],
            tagIds: [],
            blogImages: [],
        },
    });

    const watchedPostTypeId = useWatch({ control, name: "postTypeId" });
    const [selectedImages, setSelectedImages] = useState<Media[]>([]);
    const [editorMediaIds, setEditorMediaIds] = useState<number[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);


    const handleEditorImageUpload = (mediaId: number) => {
        setEditorMediaIds(prev => {
            if (prev.includes(mediaId)) return prev;
            const updated = [...prev, mediaId];
            setValue("blogImages", updated, { shouldValidate: true });
            return updated;
        });
    };

    const handleRemoveImage = async (
        index: number,
        deleteMedia: (id: number, token: string) => Promise<void>,
    ) => {
        const image = selectedImages[index];
        if (!authToken) {
            setErrorMessage("No hay token de autenticación.");
            return;
        }

        try {
            setSaveLoading(true);
            if (image.id) await deleteMedia(image.id, authToken);
            const updated = selectedImages.filter((_, i) => i !== index);
            setSelectedImages(updated);
            setValue("mediaIds", updated.map(img => img.id), { shouldValidate: true });
        } catch {
            setErrorMessage("No se pudo eliminar la imagen.");
        } finally {
            setSaveLoading(false);
        }
    };
    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
        watchedPostTypeId: number,
    ) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const fileData = new FormData();
            fileData.append("file", file);

            if (!authToken) {
                throw new Error("El token de autenticación es requerido");
            }
            const schema = watchedPostTypeId === POST_TYPEID.BLOG ? blogFileSchema : fileSchema;
            const result = schema.safeParse(file);

            if (!result.success) {
                setPrecautionMessage(result.error.errors[0].message);
                return;
            }
            try {
                setSaveLoading(true);
                const response = await postMedia(fileData, authToken);

                if (response) {
                    const newSelectedImages = [...selectedImages, response];
                    setSelectedImages(newSelectedImages);
                    setValue("mediaIds", newSelectedImages.map(img => img.id), { shouldValidate: true });
                }
            } catch (error) {
                setErrorMessage("Error al subir el archivo. Intenta nuevamente.");
                console.error("Error al subir el archivo", error);
            } finally {
                setSaveLoading(false);
            }
        }
    };
  
    const prevPostTypeId = useRef(watchedPostTypeId);
    function getFirstAllowedImageOrFirst(images: Media[]): Media[] {
        console.log("Filtrando imágenes permitidas:", images);
        const firstImage = images.find(img => allowedImageTypes.includes(img.mimeType || ""));
        console.log("Primera imagen permitida:", firstImage);
        if (firstImage) return [firstImage];
        if (images.length > 0) return [images[0]];
        return [];
    }

    useEffect(() => {
        if (
            prevPostTypeId.current !== undefined &&
            prevPostTypeId.current !== watchedPostTypeId
        ) {
            if (watchedPostTypeId === POST_TYPEID.BLOG) {
                if (selectedImages.length > MAX_BLOG_IMAGES) {
                    const limitedImages = getFirstAllowedImageOrFirst(selectedImages);

                    setSelectedImages(limitedImages);
                    setCurrentImageIndex(0);
                    setValue(
                        "mediaIds",
                        limitedImages.map(img => img.id),
                        { shouldValidate: true }
                    );
                    setPrecautionMessage(
                        `Solo se permite un máximo de ${MAX_BLOG_IMAGES} imagen${MAX_BLOG_IMAGES === 1 ? '' : 'es'} para blogs.`
                    );
                }
            }
            setValue("content", "");

        }
        prevPostTypeId.current = watchedPostTypeId;
    }, [watchedPostTypeId, selectedImages, setValue]);
    return {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        control,
        trigger,
        errors,
        watchedPostTypeId,
        selectedImages,
        setSelectedImages,
        editorMediaIds,
        setEditorMediaIds,
        handleEditorImageUpload,
        handleRemoveImage,
        currentImageIndex,
        setCurrentImageIndex,
        handleImageUpload,
    };
}
