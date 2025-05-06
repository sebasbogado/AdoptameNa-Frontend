"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { getPostsType } from "@/utils/post-type.http";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { createPost } from "@/utils/posts.http";
import { PostType } from "@/types/post-type";
import { CreatePost } from "@/types/post";
import Button from "@/components/buttons/button";
import { ConfirmationModal } from "@/components/form/modal";
import { deleteMedia, postMedia } from "@/utils/media.http";
import { MapProps } from "@/types/map-props";
import dynamic from "next/dynamic";
import { ImagePlus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, PostFormValues } from "@/validations/post-schema";
import { useForm, useWatch } from "react-hook-form";
import { Alert } from "@material-tailwind/react";
import { Media } from "@/types/media";
import { Tags } from "@/types/tags";
import NewBanner from "@/components/newBanner";
import { getTags } from "@/utils/tags";
import { POST_TYPEID } from "@/types/constants";
import { MultiSelect } from "@/components/multi-select";

const MapWithNoSSR = dynamic<MapProps>(
    () => import('@/components/ui/map'),
    { ssr: false }
);

export default function Page() {
    const {
        register,
        handleSubmit,
        setValue,
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
    const MAX_IMAGES = 5; //Tam max de imagenes
    const [validatedData, setValidatedData] = useState<PostFormValues | null>(null);
    const [tags, setTags] = useState<Tags[]>([]);
    const watchedPostTypeId = useWatch({
        control,
        name: "postTypeId", // El nombre del campo en tu formulario
    });

    const handlePositionChange = (newPosition: [number, number]) => {
        setPosition(newPosition); // Actualiza el estado local
        setValue("locationCoordinates", newPosition); // Actualiza el formulario
    };

    const handleRemoveImage = async (index: number) => {
        const imageToRemove = selectedImages[index];

        if (!authToken) {
            console.log("El token de autenticación es requerido");
            return;
        }

        try {
            setLoading(true);

            // Llamar a la API para eliminar la imagen
            if (imageToRemove.id) {
                await deleteMedia(imageToRemove.id, authToken);
            }

            // Eliminar del estado local
            const updatedImages = selectedImages.filter((_, i) => i !== index);
            setSelectedImages(updatedImages);

            const updatedMediaIds = updatedImages.map(img => img.id);
            setValue("mediaIds", updatedMediaIds, { shouldValidate: true });
            setSuccessMessage("Imagen eliminada exitosamente.")

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
        // 'data' aquí ya está validado por Zod
        openConfirmationModal(data); // Pasa los datos validados al modal/handler
    };

    const confirmSubmit = async () => {
        if (!authToken || !user?.id || !validatedData) {
            setPrecautionMessage("Faltan completar datos para crear producto!");
            return;
        }
        setIsModalOpen(false);
        setLoading(true);

        const updatedFormData: CreatePost = {
            userId: Number(user?.id),
            title: validatedData.title,
            content: validatedData.content,
            tagIds: validatedData.tagIds || [],
            postTypeId: validatedData.postTypeId,
            contactNumber: validatedData.contactNumber,
            locationCoordinates: validatedData.locationCoordinates?.join(",") || "",
            mediaIds: validatedData.mediaIds || []
        };

        if (!authToken) {
            console.log("Usuario no autenticado");
            setLoading(false);
            return;
        }

        try {
            const response = await createPost(updatedFormData, authToken);
            if (response && response.id) {
                setSuccessMessage("Post creado exitosamente.")
                router.push(`/posts/${response.id}`);
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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            const fileData = new FormData();
            fileData.append("file", file);

            if (!authToken) {
                throw new Error("El token de autenticación es requerido");
            }

            const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
            if (!allowedTypes.includes(file.type)) {
                setPrecautionMessage("Tipo de archivo no permitido. Solo se permiten PNG, JPG y WEBP.");
                return;
            }

            // Verifica la cantidad de imagens que se pueden subir
            if (selectedImages.length >= 5) {
                setPrecautionMessage("Solo puedes subir hasta 5 imágenes.");
                return;
            }
            // Verificar el tamaño del archivo (1MB)
            if (file.size > 5 * (1024 * 1024)) {
                setPrecautionMessage("El archivo es demasiado grande. Tamaño máximo: 5MB.");
                return;
            }

            try {
                setLoading(true);
                const response = await postMedia(fileData, authToken);

                if (response) {
                    const newSelectedImages = [...selectedImages, response];
                    setSelectedImages(newSelectedImages);
                    // Actualiza react-hook-form con TODOS los IDs actuales
                    const updatedMediaIds = newSelectedImages.map(img => img.id);
                    setValue("mediaIds", updatedMediaIds, { shouldValidate: true });
                }
            } catch (error) {
                setErrorMessage("Error al subir la imagen. Intenta nuevamente.");
                console.error("Error al subir la imagen", error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="w-2/4 mx-auto p-8 bg-white rounded-lg">
            <NewBanner
                medias={selectedImages}
            />
            <div className="flex gap-2 mt-2 justify-center items-center">
                {selectedImages.map((src, index) => (
                    <div key={index} className="relative w-[95px] h-[95px] cursor-pointer">
                        <Image
                            src={src.url}
                            alt="post"
                            fill
                            className={`object-cover rounded-md ${index === currentImageIndex ? 'border-2 border-blue-500' : ''}`}
                            onClick={() => setCurrentImageIndex(index)}
                        />
                        {/* Botón de eliminación */}
                        <button
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-700/60 text-white/80 text-xs hover:bg-red-600 hover:text-white transition-colors duration-150"
                            title="Eliminar imagen"
                        >
                            ✕
                        </button>
                    </div>
                ))}
                <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    multiple
                    className="hidden"
                    id="fileInput"
                    onChange={handleImageUpload}
                    disabled={selectedImages.length >= MAX_IMAGES} // Deshabilita cuando se llega al límite
                />
                <label
                    htmlFor="fileInput"
                    className={`cursor-pointer flex items-center justify-center w-24 h-24 rounded-lg border-2 transition ${selectedImages.length >= MAX_IMAGES ? "border-gray-400 cursor-not-allowed" : "border-blue-500 hover:border-blue-700"
                        } bg-white`}
                >
                    <ImagePlus size={20} className={selectedImages.length >= MAX_IMAGES ? "text-gray-400" : "text-blue-500"} />
                </label>
            </div>

            {errorMessage && (
                <div>
                    <Alert
                        color="red"
                        className="fixed top-4 right-4 w-75 shadow-lg z-[60]"
                        onClose={() => setErrorMessage("")}>
                        {errorMessage}
                    </Alert>
                </div>
            )}

            {precautionMessage && (
                <div>
                    <Alert
                        color="orange"
                        className="fixed top-4 right-4 w-75 shadow-lg z-[60]"
                        onClose={() => setPrecautionMessage("")}>
                        {precautionMessage}
                    </Alert>
                </div>
            )}

            {successMessage && (
                <div>
                    <Alert
                        color="green"
                        onClose={() => setSuccessMessage("")}
                        className="fixed top-4 right-4 w-75 shadow-lg z-[60]">
                        {successMessage}
                    </Alert>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 p-8">
                {/* Tipo de publicación */}
                <div className="flex flex-col gap-2">
                    <label className="block">Tipo de publicación <span className="text-red-500">*</span></label>
                    <select 
                        {...register("postTypeId", { valueAsNumber: true })}
                        className={`w-fit p-2 border rounded mb-4 
                        ${errors.postTypeId ? 'border-red-500' : ''} 
                        ${watch("postTypeId") === 0 ? 'text-gray-500' : 'text-black'}`}
                    >

                        <option disabled value={0}>Seleccione un tipo</option>
                        {postTypes.map((type) => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                    </select>
                </div>
                {errors.postTypeId && <p className="text-red-500">{errors.postTypeId.message}</p>}

                {/* Tags (MultiSelect) */}
                <div className="flex flex-col gap-2">
                    <label className="block">Tags</label>
                    <MultiSelect
                        options={filteredTags} // <-- Usa los tags filtrados
                        selected={selectedTags}
                        onChange={(selected) => {
                            setSelectedTags(selected);
                            setValue("tagIds", selected.map((animal) => animal.id));
                        }}
                        placeholder="Seleccionar tags"
                    />
                </div>
                {errors.tagIds && <p className="text-red-500">{/* @ts-ignore */} {errors.tagIds.message}</p>}

                {/* Título */}
                <div className="flex flex-col gap-2">
                    <label className="block">Título <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        placeholder="Titulo"
                        {...register("title")}
                        className={`w-full p-2 border rounded mb-4 ${errors.title ? 'border-red-500' : ''}`}
                    />
                </div>
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

                {/* Descripción */}
                <div className="flex flex-col gap-2">
                    <label className="block">Descripción <span className="text-red-500">*</span></label>
                    <textarea
                        {...register("content")}
                        placeholder="Descripción"
                        className={`w-full p-2 border rounded mb-4 ${errors.content ? 'border-red-500' : ''}`}
                    />
                </div>
                {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}

                {/* Contacto */}
                <div className="flex flex-col gap-2">
                    <label className="block">Número de contacto <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        placeholder="0000123456"
                        {...register("contactNumber")}
                        className={`w-full p-2 border rounded mb-4 ${errors.contactNumber ? 'border-red-500' : ''}`}
                    />
                </div>
                {errors.contactNumber && <p className="text-red-500 text-sm">{errors.contactNumber.message}</p>}

                {/* Mapa */}
                <div
                    className={`h-full relative transition-opacity duration-300 ${isModalOpen ? "pointer-events-none opacity-50" : ""}`}
                >
                    <MapWithNoSSR position={position} setPosition={handlePositionChange} />
                </div>
                {errors.locationCoordinates && <p className="text-red-500">{errors.locationCoordinates.message}</p>}

                <div className="flex justify-between items-center mt-6 gap-10">
                    <Button
                        type="button"
                        variant="danger"
                        size="md"
                        className="rounded opacity-0"
                        disabled={loading}
                    >
                        Eliminar publicación
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
                            {loading ? "Creando..." : "Crear publicación"}
                        </Button>
                    </div>
                </div>
            </form>

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
    );
}