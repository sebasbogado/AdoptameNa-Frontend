"use client";

import { useEffect, useState } from "react";
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
import Banners from "@/components/banners";
import { ImagePlus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, PostFormValues } from "@/validations/post-schema";
import { useForm } from "react-hook-form";
import { Alert } from "@material-tailwind/react";

const MapWithNoSSR = dynamic<MapProps>(
    () => import('@/components/ui/map'),
    { ssr: false }
);

export default function Page() {
    const {
        register,
        handleSubmit: zodHandleSubmit,  // Renombramos el handleSubmit de useForm
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<PostFormValues>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            idPostType: 0,
            title: "",
            content: "",
            locationCoordinates: [0, 0],
            contactNumber: "",
            urlPhoto: ""
        }
    });
    const { authToken, user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [precautionMessage, setPrecautionMessage] = useState("");
    const [postTypes, setPostTypes] = useState<PostType[]>([]);
    const router = useRouter();
    const [formData, setFormData] = useState<PostFormValues>({
        idPostType: 0,
        title: "",
        content: "",
        locationCoordinates: [0, 0], // Array de coordenadas
        contactNumber: "",
        status: "activo", // Valor estático
        urlPhoto: "",
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImages, setSelectedImages] = useState<any[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [position, setPosition] = useState<[number, number] | null>(null);
    const MAX_IMAGES = 1; //Tam max de imagenes

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
            if (imageToRemove?.id) {
                await deleteMedia(Number(imageToRemove.id), authToken);
            }

            // Eliminar del estado local
            const updatedImages = selectedImages.filter((_, i) => i !== index);
            setSelectedImages(updatedImages);

            // Si solo tienes una imagen en el formulario, también podrías limpiar el formData y el react-hook-form
            if (updatedImages.length === 0) {
                setValue("urlPhoto", "");
                setFormData(prev => ({ ...prev, urlPhoto: "" }));
            }

            setSuccessMessage("Imagen eliminada exitosamente.");
            setTimeout(() => setSuccessMessage(""), 3000); // Ocultar mensaje después de 3 segundos

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

    const fetchPostTypes = async () => {
        try {
            const data = await getPostsType();
            setPostTypes(data);
        } catch (error: any) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authLoading || !authToken) return;
        fetchPostTypes();
    }, [authToken, authLoading]);

    // Abre el modal cuando el formulario es válido
    const openConfirmationModal = (data: PostFormValues) => {
        setFormData(data); // Guardamos los datos validados
        setIsModalOpen(true);
    };

    const confirmSubmit = async () => {
        setIsModalOpen(false);
        setLoading(true);

        const updatedFormData = {
            ...formData, // ✅ Asegura que urlPhoto está presente
            idUser: user ? Number(user.id) : 0,
            locationCoordinates: formData.locationCoordinates?.join(",") || "", // Convertir a string
        };

        if (!authToken) {
            console.log("Usuario no autenticado");
            setLoading(false);
            return;
        }

        try {
            const response = await createPost(updatedFormData as CreatePost, authToken);
            if (response) {
                setFormData({
                    idPostType: 0,
                    title: "",
                    content: "",
                    locationCoordinates: [0, 0], // Array de coordenadas
                    contactNumber: "",
                    status: "activo", // Valor estático
                    urlPhoto: ""
                });
                //setCurrentImageIndex((prevIndex) => (prevIndex - 1 + selectedImages.length) % selectedImages.length);
                setSuccessMessage("¡Publicación creada exitosamente!");
                setTimeout(() => router.push(`/posts/${response.id}`), 3500);
            } else {
                setErrorMessage("Error al guardar publicación");
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

            // Verifica la cantidad de imagens que se pueden subir
            if (selectedImages.length >= 2) {
                setPrecautionMessage("Solo puedes subir hasta 2 imágenes.");
                return;
            }
            // Verificar el tamaño del archivo (1MB)
            if (file.size > 1024 * 1024) {
                setPrecautionMessage("El archivo es demasiado grande. Tamaño máximo: 1MB.");
                return;
            }

            try {
                setLoading(true);
                const response = await postMedia(fileData, authToken);

                if (response) {
                    const { id, url } = response;
                    setValue("urlPhoto", url); // Actualiza react-hook-form
                    setFormData(prev => ({ ...prev, urlPhoto: url })); // Sincroniza con formData
                    setSelectedImages(prevImages => [
                        ...prevImages,
                        {
                            id,
                            file,
                            url_API: url,
                            url: URL.createObjectURL(file)
                        }
                    ]);
                }
            } catch (error) {
                setErrorMessage("Error al subir la imagen. Intenta nuevamente.");
                console.error("Error al subir la imagen", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const arrayImages = selectedImages.map(image => image.url_API);

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <Banners images={arrayImages} />
            <div className="flex gap-2 mt-2 justify-center items-center">
                {selectedImages.map((src, index) => (
                    <div key={index} className="relative w-[95px] h-[95px] cursor-pointer">
                        <Image
                            src={src.url}
                            alt="pet"
                            fill
                            className={`object-cover rounded-md ${index === currentImageIndex ? 'border-2 border-blue-500' : ''}`}
                            onClick={() => setCurrentImageIndex(index)}
                        />
                        {/* Botón de eliminación */}
                        <button
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white text-xs hover:bg-red-600 transition"
                            title="Eliminar imagen"
                        >
                            ✕
                        </button>
                    </div>
                ))}
                <input
                    type="file"
                    accept="image/*"
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

            <form onSubmit={zodHandleSubmit(openConfirmationModal)}>
                {/* Tipo de publicación */}
                <select
                    {...register("idPostType", { valueAsNumber: true })}
                    className={`w-full p-2 border rounded mb-4 ${errors.idPostType ? 'border-red-500' : ''}`}
                >
                    <option value={0}>Seleccione un tipo</option>
                    {postTypes.map((type) => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                </select>
                {errors.idPostType && <p className="text-red-500 text-sm">{errors.idPostType.message}</p>}

                {/* Título */}
                <label className="block text-sm font-medium">Título <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    {...register("title")}
                    className={`w-full p-2 border rounded mb-4 ${errors.title ? 'border-red-500' : ''}`}
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

                {/* Descripción */}
                <label className="block text-sm font-medium">Descripción <span className="text-red-500">*</span></label>
                <textarea
                    {...register("content")}
                    className={`w-full p-2 border rounded mb-4 ${errors.content ? 'border-red-500' : ''}`}
                />
                {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}

                {/* Contacto */}
                <label className="block text-sm font-medium">Número de contacto <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    {...register("contactNumber")}
                    className={`w-full p-2 border rounded mb-4 ${errors.contactNumber ? 'border-red-500' : ''}`}
                />
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