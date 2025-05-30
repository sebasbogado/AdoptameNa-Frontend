"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getPostsType } from "@/utils/post-type.http";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { createPost } from "@/utils/posts.http";
import { PostType } from "@/types/post-type";
import { CreatePost } from "@/types/post";
import { ConfirmationModal } from "@/components/form/modal";
import { deleteMedia, postMedia } from "@/utils/media.http";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, PostFormValues } from "@/validations/post-schema";
import { useForm, useWatch } from "react-hook-form";
import { Media } from "@/types/media";
import { Tags } from "@/types/tags";
import NewBanner from "@/components/newBanner";
import { getTags } from "@/utils/tags";
import { POST_TYPEID } from "@/types/constants";
import UploadImages from "@/components/post/upload-images";
import { FormData as FormDataPost } from "@/components/post/form-data";
import { MAX_TAGS, MAX_IMAGES, MAX_BLOG_IMAGES } from "@/validations/post-schema";
import { allowedImageTypes, blogFileSchema, fileSchema } from "@/utils/file-schema";
import { ChevronLeftIcon } from "lucide-react";

export default function Page() {
    const {
        register,
        handleSubmit,
        setValue,
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
        }
    });
    const { authToken, user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [precautionMessage, setPrecautionMessage] = useState("");
    const [postTypes, setPostTypes] = useState<PostType[]>([]);
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImages, setSelectedImages] = useState<Media[]>([]);
    const [selectedTags, setSelectedTags] = useState<Tags[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [validatedData, setValidatedData] = useState<PostFormValues | null>(null);
    const [tags, setTags] = useState<Tags[]>([]);
    const [editorMediaIds, setEditorMediaIds] = useState<number[]>([]);
    const [saveLoading, setSaveLoading] = useState<boolean>(false);

    const watchedPostTypeId = useWatch({
        control,
        name: "postTypeId",
    });

    const handlePositionChange = useCallback((newPosition: [number, number] | null) => {
        setPosition(newPosition);
        if (newPosition) {
            setValue("locationCoordinates", newPosition, { shouldValidate: true, shouldDirty: true });
        }
    }, [setValue]);
    const handleEditorImageUpload = (mediaId: number) => {
        setEditorMediaIds(prev => {
            if (prev.includes(mediaId)) return prev;
            const next = [...prev, mediaId];
            const combinedMediaIds = [
                ...selectedImages.map(img => img.id),
                ...next
            ].filter((v, i, arr) => arr.indexOf(v) === i);
            setValue("mediaIds", combinedMediaIds, { shouldValidate: true });
            return next;
        });
    };

    const handleRemoveImage = async (index: number) => {
        const imageToRemove = selectedImages[index];

        if (!authToken) {
            setErrorMessage("No se pudo obtener el token de authenticación!");

            return;
        }

        try {
            setLoading(true);

            if (imageToRemove.id) {
                await deleteMedia(imageToRemove.id, authToken);
            }
            const updatedImages = selectedImages.filter((_, i) => i !== index);
            setSelectedImages(updatedImages);
            syncAllMediaIds(updatedImages, editorMediaIds, setValue); // <-- Cambia esto


        } catch (error) {
            console.error("Error al eliminar la imagen", error);
            setErrorMessage("No se pudo eliminar la imagen. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (!authLoading && !authToken) {
            router.push("/auth/login");
        }
    }, [authToken, authLoading, router]);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [postTypeData, tagsData] = await Promise.all([
                getPostsType(),
                getTags({ postTypeIds: [POST_TYPEID.ALL, POST_TYPEID.BLOG, POST_TYPEID.VOLUNTEERING] })
            ]);
            setPostTypes(postTypeData.data);
            setTags(tagsData.data);
        } catch (error: any) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const filteredTags = useMemo(() => {
        if (!tags || tags.length === 0) {
            return [];
        }

        // Siempre incluye los tags generales (postTypeId === 0)
        const generalTags = tags.filter(tag => tag.postTypeId === null);

        // Incluye tags específicos si se selecciona un tipo (1 o 2)
        let specificTags: Tags[] = [];
        if (watchedPostTypeId === POST_TYPEID.BLOG || watchedPostTypeId === POST_TYPEID.VOLUNTEERING) {
            specificTags = tags.filter(tag => tag.postTypeId === watchedPostTypeId);
        }

        return [...generalTags, ...specificTags];

    }, [tags, watchedPostTypeId]); // Recalcula cuando cambien los tags o el tipo seleccionado

    useEffect(() => {
        // Cuando las opciones filtradas cambian, debemos asegurarnos
        // de que los tags seleccionados actualmente todavía están en la lista de opciones válidas.
        const validSelectedTags = selectedTags.filter(selectedTag =>
            filteredTags.some(filteredTag => filteredTag.id === selectedTag.id)
        );

        // Si la lista de seleccionados válidos es diferente a la actual, actualiza
        if (validSelectedTags.length !== selectedTags.length) {
            setSelectedTags(validSelectedTags);
            setValue("tagIds", validSelectedTags.map(tag => tag.id), { shouldValidate: true });
        }
        // Queremos que esto se ejecute solo cuando las *opciones* filtradas cambien.
    }, [filteredTags, setValue]);

    // Abre el modal cuando el formulario es válido
    const openConfirmationModal = (data: PostFormValues) => {
        setValidatedData(data); // Guardamos los datos validados
        setIsModalOpen(true);
    };

    const onSubmit = (data: PostFormValues) => {
        openConfirmationModal(data); // Pasa los datos validados al modal/handler
    };

    const confirmSubmit = async () => {
        if (!authToken || !user?.id || !validatedData) {
            setPrecautionMessage("Faltan completar datos para crear producto!");
            return;
        }
        setIsModalOpen(false);
        setSaveLoading(true);
        const updatedFormData: CreatePost = {
            userId: Number(user?.id),
            title: validatedData.title,
            content: validatedData.content,
            tagIds: validatedData.tagIds || [],
            postTypeId: validatedData.postTypeId,
            locationCoordinates: validatedData.locationCoordinates?.join(",") || "",
            mediaIds: validatedData.mediaIds || []
        };
        if (validatedData.contactNumber && validatedData.contactNumber.trim() !== "") {
            updatedFormData.contactNumber = validatedData.contactNumber;
        }
        if (!authToken) {
            setErrorMessage("No se pudo obtener el token de authenticación!");
            setLoading(false);
            return;
        }

        try {
            const response = await createPost(updatedFormData, authToken);
            if (response && response.id) {
                setSuccessMessage("Post creado exitosamente.")

                if (validatedData.postTypeId === POST_TYPEID.BLOG) {
                    router.push(`/blog/${response.id}`);
                } else {
                    router.push(`/posts/${response.id}`);
                }
            } else {
                setErrorMessage("Se ha producido un error. Inténtelo de nuevo!")
                router.push("/dashboard"); // O a donde sea apropiado como fallback
            }
        } catch (error: any) {
            setErrorMessage("Error al crear la publicación");
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        router.push("/dashboard");
    };
    const syncAllMediaIds = useCallback((selectedImages: Media[], editorMediaIds: number[], setValue: any) => {
        const combined = [
            ...selectedImages.map(img => img.id),
            ...editorMediaIds
        ].filter((id, idx, arr) => arr.indexOf(id) === idx);
        setValue("mediaIds", combined, { shouldValidate: true });
    }, [setValue]);
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
                setLoading(true);
                const response = await postMedia(fileData, authToken);

                if (response) {
                    const newSelectedImages = [...selectedImages, response];
                    setSelectedImages(newSelectedImages);
                    syncAllMediaIds(newSelectedImages, editorMediaIds, setValue);
                }
            } catch (error) {
                setErrorMessage("Error al subir el archivo. Intenta nuevamente.");
                console.error("Error al subir el archivo", error);
            } finally {
                setLoading(false);
            }
        }
    };


    const prevPostTypeId = useRef(watchedPostTypeId);
    function getFirstAllowedImageOrFirst(images: Media[]): Media[] {
        const firstImage = images.find(img => allowedImageTypes.includes(img.mimeType || ""));
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
    function shouldShowCoverImage(content: string, images: Media[]): boolean {
  if (!images || images.length === 0) return false;

  const firstImageUrl = images[0]?.url;
  if (!firstImageUrl) return false;

  return !content.includes(firstImageUrl);
}
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-auto">
            {/* Fondo de imagen + overlay violeta */}
            <div
                className="fixed inset-0 -z-50"
                style={{
                    backgroundImage: `url('/andrew-s-ouo1hbizWwo-unsplash.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-lilac-background opacity-60"></div>
            </div>

            {/* Card del formulario */}
            <div className="relative z-0 w-full max-w-5xl mx-auto p-16 bg-white rounded-3xl shadow-lg overflow-y-auto my-24">
                <div className="flex items-center gap-2 mb-16">
                    <button
                        type="button"
                        aria-label="Volver"
                        onClick={() => router.push('/dashboard')}
                        className="text-text-primary hover:text-gray-700 focus:outline-none"
                    >
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-bold text-text-primary">Nueva publicación</h1>
                </div>
                <NewBanner
                medias={
                    watchedPostTypeId === POST_TYPEID.BLOG && shouldShowCoverImage(watch("content"), selectedImages)
                    ? selectedImages.slice(0, 1)
                    : []
                }
                />
                <UploadImages
                    selectedImages={selectedImages}
                        currentImageIndex={currentImageIndex}
                    setCurrentImageIndex={setCurrentImageIndex}
                    handleRemoveImage={handleRemoveImage}
                    handleImageUpload={handleImageUpload}
                    MAX_IMAGES={POST_TYPEID.BLOG === watchedPostTypeId ? MAX_BLOG_IMAGES : MAX_IMAGES}
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                    precautionMessage={precautionMessage}
                    setPrecautionMessage={setPrecautionMessage}
                    successMessage={successMessage}
                    setSuccessMessage={setSuccessMessage}
                    watch={watch}
                />

                <FormDataPost
                    onEditorImageUpload={handleEditorImageUpload}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    register={register}
                    errors={errors}
                    watch={watch}
                    postTypes={postTypes}
                    filteredTags={filteredTags}
                    selectedTags={selectedTags}
                    setSelectedTags={setSelectedTags}
                    setValue={setValue}
                    isModalOpen={isModalOpen}
                    position={position}
                    loading={saveLoading}
                    handleCancel={handleCancel}
                    handlePositionChange={handlePositionChange}
                    closeModal={closeModal}
                    confirmSubmit={confirmSubmit}
                    MAX_IMAGES={MAX_IMAGES}
                    MAX_TAGS={MAX_TAGS}
                    control={control}
                    trigger={trigger}
                />

                {isModalOpen &&
                    <ConfirmationModal
                        isOpen={isModalOpen}
                        title="Confirmar creación"
                        message="¿Estás seguro de que deseas crear esta publicación?"
                        textConfirm="Confirmar"
                        confirmVariant="cta"
                        onClose={closeModal}
                        onConfirm={confirmSubmit}
                    />
                }
            </div>
        </div>
    );

}