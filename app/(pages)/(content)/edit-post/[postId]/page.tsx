"use client"

import Loading from "@/app/loading";
import { useAuth } from "@/contexts/auth-context";
import { Post, UpdatePost } from "@/types/post";
import { PostType } from "@/types/post-type";
import { getPostsType } from "@/utils/post-type.http";
import { deletePost, getPost, updatePost } from "@/utils/posts.http";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/buttons/button";
import { ConfirmationModal } from "@/components/form/modal";
import NotFound from "@/app/not-found";
import { MapProps } from "@/types/map-props";
import dynamic from "next/dynamic";
import { PostFormValues, postSchema } from "@/validations/post-schema";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "@material-tailwind/react";
import Image from "next/image";
import { deleteMedia, postMedia } from "@/utils/media.http";
import { ImagePlus, Check, X, AlertTriangle } from "lucide-react";
import { Media } from "@/types/media";
import { getTags } from "@/utils/tags";
import { POST_TYPEID } from "@/types/constants";
import { Tags } from "@/types/tags";
import { MultiSelect } from "@/components/multi-select";
import NewBanner from "@/components/newBanner";
import ForwardRefEditor from "@/components/editor/forward-ref-editor";

const MapWithNoSSR = dynamic<MapProps>(
    () => import('@/components/ui/map'),
    { ssr: false }
);

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
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [precautionMessage, setPrecautionMessage] = useState<string | null>(null);
    const {
        register,
        handleSubmit,  // Renombramos el handleSubmit de useForm
        setValue,
        reset,
           watch,
        control,
        formState: { errors, isSubmitting }
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
    const postTypeId = watch("postTypeId");
    const editorContentRef = useRef('')
    const [initialContent, setInitialContent] = useState('') // Si necesitas contenido inicial

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [selectedImages, setSelectedImages] = useState<ExtendedMedia[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const MAX_IMAGES = 5; //Tam max de imagenes
    const [validatedData, setValidatedData] = useState<PostFormValues | null>(null);
    const [allTags, setAllTags] = useState<Tags[]>([]);
    const [selectedTags, setSelectedTags] = useState<Tags[]>([]);
    const watchedPostTypeId = useWatch({
        control,
        name: "postTypeId", // El nombre del campo en tu formulario
    });

    const handlePositionChange = useCallback((newPosition: [number, number]) => {
        setPosition(newPosition);
        setValue("locationCoordinates", newPosition, { shouldValidate: true, shouldDirty: true });
    }, [setValue]);

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

    // --- Carga de Datos Iniciales (Post, Tipos, Tags) ---
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
                    postTypeId: postData.postType?.id || 0,
                    title: postData.title || "",
                    content: postData.content || "",
                    locationCoordinates: initialCoords,
                    mediaIds: postData.media?.map(m => m.id) || [],
                    tagIds: postData.tags?.map(t => t.id) || [], // Si usas tags
                });

                // Poblar estado local de imágenes
                setSelectedImages(postData.media || []);

                // Poblar estado local de tags seleccionados (si usas tags)
                setSelectedTags(postData.tags || []);
                setInitialContent(postData.content)
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
    }, [authToken, authLoading, user?.id, postId, router, reset]); // reset añadido como dependencia

    const filteredTags = useMemo(() => {
        if (!allTags || allTags.length === 0) {
            return [];
        }

        // Siempre incluye los tags generales (postTypeId === 0)
        const generalTags = allTags.filter(tag => tag.postTypeId === null);

        // Incluye tags específicos si se selecciona un tipo (1 o 2)
        let specificTags: Tags[] = [];
        if (watchedPostTypeId === POST_TYPEID.BLOG || watchedPostTypeId === POST_TYPEID.VOLUNTEERING) {
            specificTags = allTags.filter(tag => tag.postTypeId === watchedPostTypeId);
        }

        return [...generalTags, ...specificTags];

    }, [allTags, watchedPostTypeId]); // Recalcula cuando cambien los tags o el tipo seleccionado

    useEffect(() => {
        if (!post || !user?.id) return;
        if ((postError !== null) || (String(post.userId) !== String(user.id))) {
            router.push("/");
        }
    }, [post, user?.id]);

    if (authLoading) return Loading();
    if (loading) return Loading();
    if (!post) return NotFound();

    const openConfirmationModalEdit = (data: PostFormValues) => {
        setValidatedData(data); // Guardamos los datos validados
        setIsEditModalOpen(true);
    };

    const onSubmit = (data: PostFormValues) => {
        // 'data' aquí ya está validado por Zod
        openConfirmationModalEdit(data); // Pasa los datos validados al modal/handler
    };

    const confirmSubmit = async () => {
        setIsEditModalOpen(false);
        if (!post || !authToken || !validatedData) return;

        const updatedFormData = {
            ...validatedData,
            userId: Number(user?.id),
            locationCoordinates: validatedData.locationCoordinates?.join(",") || "",
        };

        setLoading(true);
        try {
            await updatePost(String(post.id), updatedFormData as UpdatePost, authToken);
            setSuccessMessage('¡Publicación actualizada con éxito!');
            setTimeout(() => {
                router.push(`/posts/${post.id}`); // Redirige a la vista del post
            }, 1500);
        } catch (error) {
            console.error('Error al actualizar la publicación', error);
            setErrorMessage('Hubo un problema al actualizar la publicación.');
        } finally {
            setLoading(false);
            setValidatedData(null); // Limpia los datos guardados
        }
    };

    // --- Lógica de Eliminación ---
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
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
        setValidatedData(null); // Limpia datos si se cierra el modal de edición
    };

    const handleCancel = () => {
        if (!post?.id) {
            router.push("/dashboard"); // Fallback si no hay ID
        } else {
            router.push(`/posts/${post.id}`);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        
        const files = Array.from(e.target.files);
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/webp",
            "video/mp4",
            "video/webm",
            "video/ogg",
            "video/x-matroska",
            "audio/mpeg"
        ];
        
        // Verificar cantidad de archivos
        if (selectedImages.length + files.length > MAX_IMAGES) {
            setPrecautionMessage(`Solo puedes subir hasta ${MAX_IMAGES} archivos en total.`);
            e.target.value = '';
            return;
        }

        setLoading(true);
        setErrorMessage(null);
        setPrecautionMessage(null);

        if (!authToken) {
            setErrorMessage("Error de autenticación. Por favor, inicia sesión nuevamente.");
            e.target.value = '';
            setLoading(false);
            return;
        }

        try {
            const uploadPromises = files.map(async (file) => {
                // Validar tipo de archivo
                if (!allowedTypes.includes(file.type)) {
                    throw new Error(`Tipo de archivo no permitido: ${file.name}. Solo se permiten JPG, PNG, WEBP, MP4, WEBM, OGG, MKV y MP3.`);
                }

                // Verificar el tamaño del archivo (50MB para videos/audio, 5MB para imágenes)
                const maxSize = file.type.startsWith('video/') || file.type.startsWith('audio/') 
                    ? 50 * (1024 * 1024) 
                    : 5 * (1024 * 1024);
                if (file.size > maxSize) {
                    const maxSizeMB = file.type.startsWith('video/') || file.type.startsWith('audio/') ? 50 : 5;
                    throw new Error(`El archivo ${file.name} es demasiado grande. Tamaño máximo: ${maxSizeMB}MB.`);
                }

                const fileData = new FormData();
                fileData.append("file", file);
                return await postMedia(fileData, authToken);
            });

            const responses = await Promise.all(uploadPromises);
            const successfulUploads = responses.filter(response => response !== null);
            
            if (successfulUploads.length > 0) {
                const newSelectedImages = [...selectedImages, ...successfulUploads];
                setSelectedImages(newSelectedImages);
                const updatedMediaIds = newSelectedImages.map(img => img.id);
                setValue("mediaIds", updatedMediaIds, { shouldValidate: true });
                setSuccessMessage(`${successfulUploads.length} archivo(s) subido(s) correctamente.`);
                setTimeout(() => setSuccessMessage(null), 2000);
            }
        } catch (error: any) {
            console.error("Error al subir los archivos", error);
            setErrorMessage(error.message || "Error al subir los archivos. Intenta nuevamente.");
        } finally {
            setLoading(false);
            e.target.value = '';
        }
    };

    const handleRemoveImage = async (index: number) => {
        if (!authToken) return;
        const imageToRemove = selectedImages[index];

        setLoading(true);
        setErrorMessage(null);

        try {
            await deleteMedia(imageToRemove.id, authToken);
            const updatedImages = selectedImages.filter((_, i) => i !== index);
            setSelectedImages(updatedImages);
            // Actualiza RHF con los IDs restantes
            setValue("mediaIds", updatedImages.map(img => img.id), { shouldValidate: true, shouldDirty: true });
            setSuccessMessage("Imagen eliminada.");
            // Ajusta el índice de la imagen actual si se elimina la última o una anterior
            if (currentImageIndex >= updatedImages.length) {
                setCurrentImageIndex(Math.max(0, updatedImages.length - 1));
            }
            setTimeout(() => setSuccessMessage(null), 2000);
        } catch (error) {
            console.error("Error al eliminar la imagen", error);
            setErrorMessage("No se pudo eliminar la imagen. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-auto">
            {/* Fondo de imagen + overlay violeta */}
            <div
                className="fixed inset-0 z-0"
                style={{
                    backgroundImage: `url('/andrew-s-ouo1hbizWwo-unsplash.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="absolute inset-0 bg-lilac-background opacity-60"></div>
            </div>

            {/* Card del formulario */}
<div className="relative z-10 w-full max-w-5xl mx-auto px-24 py-16 bg-white rounded-3xl shadow-lg my-24">
                <div className="flex items-center gap-2 mb-16">
                    <button
                        type="button"
                        aria-label="Volver"
                        onClick={() => router.push(`/posts/${postId}`)}
                        className="text-text-primary hover:text-gray-700 focus:outline-none"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <h1 className="text-2xl font-bold text-text-primary">Editar publicación</h1>
                </div>

                <div className="w-full mb-8">
                    <NewBanner medias={selectedImages} />
                </div>
                {successMessage && (
                    <Alert
                        open={true}
                        color="green"
                        animate={{
                            mount: { y: 0 },
                            unmount: { y: -100 },
                        }}
                        icon={<Check className="h-5 w-5" />}
                        onClose={() => setSuccessMessage(null)}
                        className="fixed top-4 right-4 w-72 shadow-lg z-[10001]"
                    >
                        <p className="text-sm">{successMessage}</p>
                    </Alert>
                )}
                {errorMessage && (
                    <Alert
                        open={true}
                        color="red"
                        animate={{
                            mount: { y: 0 },
                            unmount: { y: -100 },
                        }}
                        icon={<X className="h-5 w-5" />}
                        onClose={() => setErrorMessage(null)}
                        className="fixed top-4 right-4 w-72 shadow-lg z-[10001]"
                    >
                        <p className="text-sm">{errorMessage}</p>
                    </Alert>
                )}
                {precautionMessage && (
                    <Alert
                        open={true}
                        color="amber"
                        animate={{
                            mount: { y: 0 },
                            unmount: { y: -100 },
                        }}
                        icon={<AlertTriangle className="h-5 w-5" />}
                        onClose={() => setPrecautionMessage(null)}
                        className="fixed top-4 right-4 w-72 shadow-lg z-[10001]"
                    >
                        <p className="text-sm">{precautionMessage}</p>
                    </Alert>
                )}

                <div className="flex gap-2 mt-2 justify-center items-center">
                    {selectedImages.map((src, index) => (
                        <div key={index} className="relative w-[95px] h-[95px] cursor-pointer">
                            {src.mimeType && src.mimeType.startsWith('image') ? (
                                <Image
                                    src={src.url}
                                    alt="post-image"
                                    fill
                                    className={`object-cover rounded-md ${index === currentImageIndex ? 'border-2 border-blue-500' : ''}`}
                                    onClick={() => setCurrentImageIndex(index)}
                                    unoptimized
                                />
                            ) : src.mimeType && src.mimeType.startsWith('video') ? (
                                <video
                                    src={src.url}
                                    className={`object-cover rounded-md w-full h-full ${index === currentImageIndex ? 'border-2 border-blue-500' : ''}`}
                                    onClick={() => setCurrentImageIndex(index)}
                                    muted
                                    playsInline
                                    loop
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded-md">
                                    Archivo no soportado
                                </div>
                            )}
                            <button
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-700/60 text-white/80 text-xs hover:bg-red-600 hover:text-white transition-colors duration-150"
                                title="Eliminar archivo"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,image/webp,video/mp4,video/webm,video/ogg,video/x-matroska,audio/mpeg"
                        multiple
                        className="hidden"
                        id="fileInput"
                        onChange={handleImageUpload}
                        disabled={selectedImages.length >= MAX_IMAGES}
                    />
                    <label
                        htmlFor="fileInput"
                        className={`cursor-pointer flex items-center justify-center w-24 h-24 rounded-lg border-2 transition ${selectedImages.length >= MAX_IMAGES ? "border-gray-400 cursor-not-allowed" : "border-blue-500 hover:border-blue-700"} bg-white`}
                    >
                        <ImagePlus size={20} className={selectedImages.length >= MAX_IMAGES ? "text-gray-400" : "text-blue-500"} />
                    </label>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 mt-8">
                    {/* Tipo de publicación */}
                    <div className="w-1/3 mb-2">
                        <label className="block mb-1">Tipo de publicación</label>
                        <select
                            {...register("postTypeId", { valueAsNumber: true })}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
                        >
                            <option value={0}>Seleccione un tipo</option>
                            {postTypes.map((type) => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </select>
                        {errors.postTypeId && <p className="text-red-500 text-sm">{errors.postTypeId.message}</p>}
                    </div>

                    {/* Título */}
                    <div className="mb-2">
                        <label className="block mb-1">Título <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            {...register("title")}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
                        />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                    </div>

                    {/* Tags (MultiSelect) */}
                    <div className="mb-2">
                        <label className="block mb-1">Tags</label>
                        <MultiSelect
                            options={filteredTags}
                            selected={selectedTags}
                            onChange={(selected) => {
                                setSelectedTags(selected);
                                setValue("tagIds", selected.map((animal) => animal.id));
                            }}
                            placeholder="Seleccionar tags"
                        />
                        {errors.tagIds && <p className="text-red-500 text-sm">{errors.tagIds.message}</p>}
                    </div>

                   <div className="flex flex-col gap-2">
                                
                                  {postTypeId === POST_TYPEID.BLOG ? (
                                      <Controller
                                          name="content"
                                          control={control}
                                          render={(
                                              field
                                          ) => <ForwardRefEditor
                                           IsCreateBlog={true} 
                                                  markdown={initialContent}
                                                  onChange={(value: string) => {
                                                      editorContentRef.current = value // No renderiza nada
                                                  }}
                                                  className="border-2 rounded-lg border-gray"
                                              />}
                                      > 
              
                                      </Controller>
              
                                  ) : (
                                      <>
                                        <label className="block">
                                      Descripción <span className="text-red-500">*</span>
                                  </label>
              
                                      <textarea
                                          {...register("content")}
                                          placeholder="Descripción"
                                          className={`w-full p-2 border rounded mb-4 ${errors.content ? 'border-red-500' : ''}`}
                                      />
                                                              </>
              
                                  )}
                              </div>
                              {errors.content && (
                                  <p className="text-red-500 text-sm">{errors.content.message}</p>
                              )}

                    {postTypeId !== POST_TYPEID.BLOG && (

                    <div className="mb-2">
                        <label className="block mb-1">Número de contacto <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            {...register("contactNumber")}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
                        />
                        {errors.contactNumber && <p className="text-red-500 text-sm">{errors.contactNumber.message}</p>}
                    </div>
                                    )}

                {postTypeId !== POST_TYPEID.BLOG && (

                    <div className={`h-full relative ${isEditModalOpen || isDeleteModalOpen ? "pointer-events-none opacity-50" : ""}`}>
                        <MapWithNoSSR position={position} setPosition={handlePositionChange} />
                        {errors.locationCoordinates && <p className="text-red-500 text-sm">{errors.locationCoordinates.message}</p>}

                    </div>
                )}

                    <div className="flex justify-between items-center mt-6 gap-10">
                        <Button
                            type="button"
                            variant="danger"
                            size="md"
                            className="rounded hover:bg-red-700"
                            onClick={openDeleteModal}
                            disabled={loading}
                        >
                            {loading ? 'Eliminando...' : 'Eliminar publicación'}
                        </Button>

                        <div className="flex gap-4">
                            <Button
                                type="button"
                                variant="tertiary"
                                className="border rounded text-gray-700 hover:bg-gray-100"
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="cta"
                                className="rounded hover:bg-purple-700"
                                disabled={loading}
                            >
                                {loading ? "Editando..." : "Confirmar cambios"}
                            </Button>
                        </div>
                    </div>
                </form>

                {isEditModalOpen &&
                    <ConfirmationModal
                        isOpen={isEditModalOpen}
                        title="Confirmar cambios"
                        message="¿Estás seguro de que deseas guardar los cambios en esta publicación?"
                        textConfirm="Confirmar cambios"
                        confirmVariant="cta"
                        onClose={closeModal}
                        onConfirm={confirmSubmit}
                    />}

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