"use client"

import Loading from "@/app/loading";
import { useAuth } from "@/contexts/auth-context";
import { Post, UpdatePost } from "@/types/post";
import { PostType } from "@/types/post-type";
import { getPostsType } from "@/utils/post-type.http";
import { deletePost, getPost, updatePost } from "@/utils/posts.http";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/buttons/button";
import { ConfirmationModal } from "@/components/form/modal";
import NotFound from "@/app/not-found";
import Banners from "@/components/banners";
import { MapProps } from "@/types/map-props";
import dynamic from "next/dynamic";
import { PostFormValues, postSchema } from "@/validations/post-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "@material-tailwind/react";
import Image from "next/image";
import { deleteMedia, postMedia } from "@/utils/media.http";
import { ImagePlus } from "lucide-react";

const MapWithNoSSR = dynamic<MapProps>(
    () => import('@/components/ui/map'),
    { ssr: false }
);

type SelectedImage = {
    id?: number | null;
    file: File | null;
    url_API: string;
    url: string;
};

export default function Page() {
    const { postId } = useParams();
    const { authToken, user, loading: authLoading } = useAuth();
    const [post, setPost] = useState<Post | null>(null);
    const [postTypes, setPostTypes] = useState<PostType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [postError, setPostError] = useState<string | null>(null);
    const router = useRouter();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
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
    const [formData, setFormData] = useState<PostFormValues>({
        idPostType: 0,
        title: "",
        content: "",
        locationCoordinates: [0, 0], // Array de coordenadas
        contactNumber: "",
        status: "activo", // Valor estático
        urlPhoto: "",
    });

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const MAX_IMAGES = 2; //Tam max de imagenes

    const handlePositionChange = (newPosition: [number, number]) => {
        setPosition(newPosition); // Actualiza el estado local
        setValue("locationCoordinates", newPosition); // Actualiza el formulario
    };

    useEffect(() => {
        if (!authLoading && !authToken) {
            router.push("/auth/login");
        }
    }, [authToken, authLoading, router])

    const fetchPostTypes = async () => {
        try {
            const data = await getPostsType();
            setPostTypes(data);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchPost = async () => {
        if (authLoading || !authToken || !user?.id) return;

        try {
            const postData = await getPost(String(postId));
            if (postData) {
                setPost(postData);

                const [lat, lng] = postData.locationCoordinates.split(',').map(Number);
                setPosition([lat, lng]);
                setValue("idPostType", postData.postType?.id || 0);
                setValue("title", postData.title || "");
                setValue("content", postData.content || "");
                setValue("contactNumber", postData.contactNumber || "");
                setValue("locationCoordinates", [lat, lng]);
                setValue("urlPhoto", postData.urlPhoto || "");

                if (postData.urlPhoto && postData.urlPhoto.trim() !== "") {
                    setSelectedImages([
                      {
                        file: null,
                        url_API: postData.urlPhoto,
                        url: postData.urlPhoto
                      }
                    ]);
                  } else {
                    setSelectedImages([]);
                  }
            }
        } catch (err) {
            console.error("Error al cargar posts:", err);
            setPostError("No se pudieron cargar las publicaciones.");
            return NotFound();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPost();
        fetchPostTypes();
    }, [authToken, authLoading, user?.id, postId]);

    useEffect(() => {
        if (!post || !user?.id) return;
        if ((postError !== null) || (String(post.idUser) !== String(user.id))) {
            router.push("/");
        }
    }, [post, user?.id]);

    if (authLoading) return Loading();
    if (loading) return Loading();
    if (postError !== null) return NotFound();

    const openConfirmationModalEdit = (data: PostFormValues) => {
        setFormData(data); // Guardamos los datos validados
        setIsEditModalOpen(true);
    };

    const handleSubmit = async () => {
        setIsEditModalOpen(false);
        if (!post || !authToken) return;

        const updatedFormData = {
            ...formData,
            idUser: user ? Number(user.id) : 0,
            locationCoordinates: position ? `${position[0]}, ${position[1]}` : ""
        };

        setLoading(true);
        try {
            await updatePost(String(post.id), updatedFormData as UpdatePost, authToken);
            setSuccessMessage('¡Publicación actualizada con éxito!');
            setTimeout(() => router.push(`/posts/${post.id}`), 3500);
        } catch (error) {
            console.error('Error al actualizar la publicación', error);
            setError('Hubo un problema al actualizar la publicación.');
        } finally {
            setLoading(false);
        }
    };

    const openConfirmationModalDelete = () => {
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        setIsDeleteModalOpen(false);
        if (!post?.id || !authToken) {
            console.error('Falta el ID de la publicación o el token');
            return;
        }

        setLoading(true);
        try {
            await deletePost(String(post.id), authToken);
            setSuccessMessage('Publicación eliminada con éxito');
            setTimeout(() => router.push('/dashboard'), 3500);

        } catch (error) {
            console.error('Error al eliminar la publicación:', error);
            setError('Hubo un problema al eliminar la publicación.');
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
    };

    const handleCancel = () => {
        if (!post) return
        router.push(`/posts/${post.id}`);
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
                setError("Solo puedes subir hasta 2 imágenes.");
                return;
            }
            // Verificar el tamaño del archivo (1MB)
            if (file.size > 1024 * 1024) {
                setError("El archivo es demasiado grande. Tamaño máximo: 1MB.");
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
                console.error("Error al subir la imagen", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleRemoveImage = async (index: number) => {
        const imageToRemove = selectedImages[index];

        if (!authToken) {
            setError("El token de autenticación es requerido");
            return;
        }

        try {
            setLoading(true);
            console.log("Eliminando imagen", imageToRemove);

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

        } catch (error) {
            console.error("Error al eliminar la imagen", error);
            setError("No se pudo eliminar la imagen. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    const arrayImages = selectedImages.length > 0 ? selectedImages.map(image => image.url_API) : ['../logo.png'];

    console.log("arrayImages", arrayImages);
    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <Banners images={arrayImages} />
            <div className="flex gap-2 mt-2 justify-center items-center">
                {selectedImages.map((src, index) => (
                    <div key={index} className="relative w-[95px] h-[95px] cursor-pointer">
                        {src.url_API && (
                            <>
                                <Image
                                    src={src.url_API}
                                    alt="post-image"
                                    fill
                                    className={`object-cover rounded-md ${index === currentImageIndex ? 'border-2 border-blue-500' : ''}`}
                                    onClick={() => setCurrentImageIndex(index)}
                                    unoptimized
                                />
                                {/* Botón de eliminación */}
                                <button
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white text-xs hover:bg-red-600 transition"
                                    title="Eliminar imagen"
                                >
                                    ✕
                                </button>
                            </>
                        )}


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

            {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
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

            <form onSubmit={zodHandleSubmit(openConfirmationModalEdit)}>
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
                    className={`h-full relative ${isEditModalOpen || isDeleteModalOpen ? "pointer-events-none opacity-50" : ""}`}
                >
                    <MapWithNoSSR position={position} setPosition={handlePositionChange} />
                </div>
                {errors.locationCoordinates && <p className="text-red-500">{errors.locationCoordinates.message}</p>}

                <div className="flex justify-between items-center mt-6 gap-10">
                    <Button
                        type="button"
                        variant="danger"
                        size="md"
                        className="rounded hover:bg-red-700"
                        onClick={openConfirmationModalDelete}
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
                    onConfirm={handleSubmit}
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
    );
}