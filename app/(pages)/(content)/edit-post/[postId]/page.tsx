"use client"

import Loading from "@/app/loading";
import { useAuth } from "@/contexts/auth-context";
import { Post, UpdatePost } from "@/types/post";
import { FormData as FormDataPost } from "@/components/post/form-data";

import { PostType } from "@/types/post-type";
import { getPostsType } from "@/utils/post-type.http";
import { deletePost, getPost, updatePost } from "@/utils/posts.http";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/buttons/button";
import { ConfirmationModal } from "@/components/form/modal";
import NotFound from "@/app/not-found";
import { PostFormValues, postSchema } from "@/validations/post-schema";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "@material-tailwind/react";
import Image from "next/image";
import { deleteMedia, postMedia } from "@/utils/media.http";
import { ImagePlus, Check, X, AlertTriangle, ChevronLeftIcon } from "lucide-react";
import { Media } from "@/types/media";
import { getTags } from "@/utils/tags";
import { POST_TYPEID } from "@/types/constants";
import { Tags } from "@/types/tags";
import { MultiSelect } from "@/components/multi-select";
import NewBanner from "@/components/newBanner";
import { CreatePostLocation } from "@/components/post/create-post-location";
import { MAX_TAGS, MAX_IMAGES, MAX_BLOG_IMAGES } from "@/validations/post-schema";
import UploadImages from "@/components/post/upload-images";
import { allowedImageTypes, blogFileSchema, fileSchema } from "@/utils/file-schema";

// Map is imported via CreatePostLocation component

// Asegurémonos de que el tipo Media incluya la propiedad type
interface ExtendedMedia extends Media {
    type?: string;
}

export default function Page() {
    const { postId } = useParams();
    const { authToken, user, loading: authLoading } = useAuth();
    const [post, setPost] = useState<Post | null>(null);
    const [postTypes, setPostTypes] = useState<PostType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [postError, setPostError] = useState<string | null>(null);
    const router = useRouter();
    const [saveLoading, setSaveLoading] = useState<boolean>(false);
 const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [precautionMessage, setPrecautionMessage] = useState("");
        const {
        register,
        handleSubmit,  // Renombramos el handleSubmit de useForm
        setValue,
        reset,
        control,
        watch,
        trigger,
        formState: { errors }
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
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editorMediaIds, setEditorMediaIds] = useState<number[]>([]);
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [selectedImages, setSelectedImages] = useState<ExtendedMedia[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [validatedData, setValidatedData] = useState<PostFormValues | null>(null);
    const [allTags, setAllTags] = useState<Tags[]>([]);
    const [selectedTags, setSelectedTags] = useState<Tags[]>([]);
    const watchedPostTypeId = useWatch({
        control,
        name: "postTypeId", // El nombre del campo en tu formulario
    });



    useEffect(() => {
        if (!authLoading && !authToken) {
            router.push("/auth/login");
        }
    }, [authToken, authLoading, router])


    // --- Carga de Datos Iniciales (Post, Tipos, Tags) ---
    useEffect(() => {
        if (!post || !user?.id) return;
        if ((postError !== null) || (String(post.userId) !== String(user.id))) {
            router.push("/");
        }
    }, [post, user?.id]);

    useEffect(() => {
        const fetchInitialData = async () => {
            if (authLoading || !authToken || !user?.id || !postId) return;
            setLoading(true);
            setPostError(null);
            try {
                // Fetch en paralelo
                const [postDataResult, postTypeData, tagsData] = await Promise.all([
                    getPost(String(postId)),
                    getPostsType(),
                    getTags({ postTypeIds: [POST_TYPEID.ALL, POST_TYPEID.BLOG, POST_TYPEID.VOLUNTEERING] })
                ]);

                // Procesa Tipos
                setPostTypes(postTypeData.data);

                // Procesa Tags (si usas tags)
                setAllTags(tagsData.data);

                // Procesa Post
                const postData = postDataResult; // getPost devuelve el Post directamente
                setPost(postData);

                // --- Validar propietario ---
                if (String(postData.userId) !== String(user.id)) {
                    setPostError("No tienes permiso para editar esta publicación.");
                    router.push("/"); // O a una página de error/dashboard
                    setLoading(false);
                    return; // Detiene la ejecución adicional si no es propietario
                }

                // --- Poblar el Formulario ---
                let initialCoords: [number, number] = [0, 0];
                if (postData.locationCoordinates) {
                    const coords = postData.locationCoordinates.split(',').map(Number);
                    if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
                        initialCoords = [coords[0], coords[1]];
                    }
                }
                setPosition(initialCoords);

                // Usa reset para poblar eficientemente el formulario
                reset({
                      postTypeId: Number(postData.postType?.id) || 0,
                    
                    title: postData.title || "",
                    content: postData.content || "",
                      locationCoordinates: postData.postType?.id !== POST_TYPEID.BLOG ? initialCoords : undefined,

                    contactNumber: postData.contactNumber || "",
                    mediaIds: postData.media?.map(m => m.id) || [],
                    tagIds: postData.tags?.map(t => t.id) || [], // Si usas tags
                });
                console.log("reset() ejecutado con:", {
                content: postData.content,
                postTypeId: postData.postType?.id,
                });

                // Poblar estado local de imágenes
                setSelectedImages(postData.media || []);

                // Poblar estado local de tags seleccionados (si usas tags)
                setSelectedTags(postData.tags || []);

            } catch (err: any) {
                console.error("Error al cargar datos iniciales:", err);
                if (err.response?.status === 404) {
                    setPostError("Publicación no encontrada.");
                } else {
                    setPostError("No se pudo cargar la publicación.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [authToken, authLoading, user?.id, postId, router, reset]); 
 const handlePositionChange = useCallback((newPosition: [number, number] | null) => {
        setPosition(newPosition);
        if (newPosition) {
            setValue("locationCoordinates", newPosition, { shouldValidate: true, shouldDirty: true });
        }
    }, [setValue]);
    const openDeleteModal = () => setIsDeleteModalOpen(true);

    const handleDelete = async () => {
        setIsDeleteModalOpen(false);
        setLoading(true);
        if (!post?.id || !authToken) {
            console.error('Falta el ID de la publicación o el token');
            return;
        }

        try {
            await deletePost(String(post.id), authToken);

            setSuccessMessage('Publicación eliminada con éxito');
            setTimeout(() => router.push('/dashboard'), 1500);

        } catch (error) {
            console.error('Error al eliminar la publicación:', error);
            setErrorMessage('Hubo un problema al eliminar la publicación.');
        } finally {
            setLoading(false);
        }
    };

    // --- Otros Handlers ---
    const closeModal = () => {
        setIsModalOpen(false);
        setIsDeleteModalOpen(false);
        setValidatedData(null); // Limpia datos si se cierra el modal de edición
    };

    const handleCancel = () => {
        if (!post?.id) {
            router.push("/dashboard"); // Fallback si no hay ID
        } else {
            if (post?.postType?.id === POST_TYPEID.BLOG) {
                router.push(`/blog/${post.id}`);
            } else {
                router.push(`/posts/${post.id}`);
            }
        }
    };
    const openConfirmationModal = (data: PostFormValues) => {
        
          console.log("Datos validados:", data);

        setValidatedData(data); // Guardamos los datos validados
        setIsModalOpen(true);
    };
  const onSubmit = async (data: PostFormValues) => {
  // Limpieza de campos para BLOG
  if (data.postTypeId === POST_TYPEID.BLOG) {
    data.contactNumber = undefined;
    data.locationCoordinates = undefined;
  }

  console.log("Datos validados:", data);
  const isValid = await trigger();
  console.log("Errores actuales:", errors); // <-- aquí deberían mostrarse
  openConfirmationModal(data);
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

const filteredTags = useMemo(() => {
    if (!allTags || allTags.length === 0) return [];

    const generalTags = allTags.filter(tag => tag.postTypeId === null);
    const specificTags = allTags.filter(tag => tag.postTypeId === watchedPostTypeId);

    return [...generalTags, ...specificTags];
}, [allTags, watchedPostTypeId]);
useEffect(() => {
    const validSelectedTags = selectedTags.filter(selectedTag =>
        filteredTags.some(filteredTag => filteredTag.id === selectedTag.id)
    );

    if (validSelectedTags.length !== selectedTags.length) {
        setSelectedTags(validSelectedTags);
        setValue("tagIds", validSelectedTags.map(tag => tag.id), { shouldValidate: true });
    }
}, [filteredTags]);

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
const confirmSubmit = async () => {
  if (!authToken || !user?.id || !validatedData || !post?.id) {
    setPrecautionMessage("Faltan datos requeridos.");
    return;
  }

  setIsModalOpen(false);
setSaveLoading(true);
  const isBlog = validatedData.postTypeId === POST_TYPEID.BLOG;

  const updatedFormData: UpdatePost = {
    userId: Number(user?.id),
    title: validatedData.title,
    content: validatedData.content,
    tagIds: validatedData.tagIds || [],
    postTypeId: validatedData.postTypeId,
    mediaIds: validatedData.mediaIds || [],
    ...(isBlog ? {} : {
      locationCoordinates: validatedData.locationCoordinates?.join(",") || "",
  contactNumber: validatedData.contactNumber?.trim() || "",
})
  };

  try {
    const result = await updatePost(String(post.id), updatedFormData, authToken);
    if (result) {
      setSuccessMessage("Post actualizado exitosamente.");
      if (post?.postType?.id === POST_TYPEID.BLOG) {
                router.push(`/blog/${post.id}`);
            } else {
                router.push(`/posts/${post.id}`);
            }
    }
  } catch (error) {
    setErrorMessage("Error al actualizar la publicación.");
  } finally {
    setLoading(false);
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
            

        }
        prevPostTypeId.current = watchedPostTypeId;
    }, [watchedPostTypeId, selectedImages, setValue]);
    if (authLoading || loading) {
        return <Loading />;
    }
    const editorImageIds = new Set(editorMediaIds);
const previewImages = selectedImages.filter((img) => !editorImageIds.has(img.id));
const imagesForUploadComponent =
  watchedPostTypeId === POST_TYPEID.BLOG
    ? previewImages.slice(0, 1)
    : previewImages;
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
                    <ChevronLeftIcon    className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-bold text-text-primary">Editar publicación</h1>
                </div>
                <NewBanner
                       medias={
                        watchedPostTypeId === POST_TYPEID.BLOG
                            ? selectedImages.slice(0, 1)
                            : selectedImages
                    }
                />
                    <UploadImages
                    selectedImages={imagesForUploadComponent}
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
                    isEditMode={true}
                    openDeleteModal={openDeleteModal}
                    trigger = {trigger}
                />
            {isModalOpen &&
                    <ConfirmationModal
                        isOpen={isModalOpen}
                        title="Confirmar cambios"
                        message="¿Estás seguro de que deseas editar esta publicación?"
                        textConfirm="Confirmar"
                        confirmVariant="cta"
                        onClose={closeModal}
                        onConfirm={confirmSubmit}
                    />
                }
               
                {isDeleteModalOpen &&
                    <ConfirmationModal
                        isOpen={isDeleteModalOpen}
                        title="Confirmar eliminación"
                        message="¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer."
                        textConfirm="Eliminar"
                        confirmVariant="danger"
                        onClose={closeModal}
                        onConfirm={handleDelete}
                    />}
            </div>
        </div>
    );
}