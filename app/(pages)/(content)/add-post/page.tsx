"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getPostType } from "@/utils/post-type.http";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { postPosts } from "@/utils/posts.http";
import { PostType } from "@/types/post-type";
import { Post } from "@/types/post";
import Button from "@/components/buttons/button";
import { ConfirmationModal } from "@/components/form/modal";
import { postMedia } from "@/utils/media.http";
import { MapProps } from "@/types/map-props";
import dynamic from "next/dynamic";
import Banners from "@/components/banners";
import { ImagePlus } from "lucide-react";

interface FormErrors {
    idPostType?: string;
    title?: string;
    content?: string;
    locationCoordinates?: string;
    contactNumber?: string;
}

const MapWithNoSSR = dynamic<MapProps>(
    () => import('@/components/ui/map'),
    { ssr: false }
);

export default function Page() {
    const { authToken, user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [postTypes, setPostTypes] = useState<PostType[]>([]);
    const router = useRouter();
    const [formData, setFormData] = useState<Partial<Post>>({
        idUser: user ? Number(user.id) : 0,
        title: "",
        content: "",
        idPostType: 0,
        locationCoordinates: "",
        contactNumber: "",
        status: "activo",
        sharedCounter: 0,
        urlPhoto: "",
        publicationDate: new Date().toISOString()
    });
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal
    const [selectedImages, setSelectedImages] = useState<any[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [position, setPosition] = useState<[number, number] | null>(null);

    {/* Realizando la autenticación para ingresar a crear publicación */ }
    useEffect(() => {
        if (!authLoading && !authToken) {
            router.push("/auth/login");
        }
    }, [authToken, authLoading, router]);

    useEffect(() => {
        
    })

    const fetchPostTypes = async () => {
        try {
            const data = await getPostType();
            setPostTypes(data);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    {/* Obtenemos los tipos de publicaciones existentes */ }
    useEffect(() => {
        if (authLoading || !authToken) return;
        fetchPostTypes();
    }, [authToken, authLoading]);


    {/* Función para manejar los cambios en los inputs */ }
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (formErrors[name as keyof FormErrors]) {
            setFormErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    {/* Validación de los campos */ }
    const validateForm = (): FormErrors => {
        const errors: FormErrors = {};

        if (!formData.idPostType || formData.idPostType === 0) {
            errors.idPostType = "Seleccione un tipo de publicación";
        }
        if (!formData.title?.trim()) {
            errors.title = "El título es requerido";
        } else if (formData.title.length < 3) {
            errors.title = "El título debe tener al menos 3 caracteres";
        }
        if (!formData.content?.trim()) {
            errors.content = "La descripción es requerida";
        } else if (formData.content.length < 10) {
            errors.content = "La descripción debe tener al menos 10 caracteres";
        }
        if (!formData.locationCoordinates?.trim()) {
            errors.locationCoordinates = "La ubicación es requerida";
        }
        if (!formData.contactNumber?.trim()) {
            errors.contactNumber = "El número de contacto es requerido";
        } else if (!/^\+?\d{9,15}$/.test(formData.contactNumber)) {
            errors.contactNumber = "Número inválido (9-15 dígitos)";
        }

        return errors;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsModalOpen(true); // Mostrar el modal en lugar de enviar directamente
    };

    const confirmSubmit = async () => {
        setIsModalOpen(false); // Cerrar el modal
        setLoading(true);

        console.log("mapa coodenadas position", `${position?.[0]}, ${position?.[1]}`)
        setFormData((prevFormData) => ({
            ...prevFormData, // Mantiene los valores actuales
            idPostType: Number(prevFormData.idPostType),
            idUser: user ? Number(user.id) : 0, // Usamos directamente user.id aquí
            locationCoordinates: `${position?.[0]}, ${position?.[1]}`
        }));

        console.log("formData", formData)
        console.log("locationCoordinates", formData.locationCoordinates)

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setFormErrors(validationErrors);
            setLoading(false);
            return;
        }

        if (!authToken) {
            setError("Usuario no autenticado");
            setLoading(false);
            return;
        }

        try {
            const response = await postPosts(formData as Post, authToken);
            if (response) {
                setSuccessMessage("¡Publicación creada exitosamente!");
                setFormData({
                    idUser: user ? Number(user.id) : 0,
                    title: "",
                    content: "",
                    idPostType: 0,
                    locationCoordinates: "",
                    contactNumber: "",
                    status: "activo",
                    sharedCounter: 0,
                    urlPhoto: "",
                    publicationDate: new Date().toISOString()
                });
                setCurrentImageIndex((prevIndex) => (prevIndex - 1 + selectedImages.length) % selectedImages.length);
                setSuccessMessage("Se ha creado correctamente la publicacion.");
                //router.push(`/post/${response.id}`); // Asumiendo que la respuesta incluye el ID
            } else {
                setError("Error al guardar publicación")
            }


        } catch (error: any) {
            setError(error.message || "Error al crear la publicación");
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false); // Cerrar el modal sin confirmar
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        router.push("/dashboard");
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append("file", file);

            if (!authToken) {
                throw new Error("El token de autenticación es requerido");
            }

            try {
                const response = await postMedia(formData, authToken);
                setFormData((prevFormData) => ({
                    ...prevFormData, // Mantiene los valores actuales
                    urlPhoto: response.url  
                }));
                console.log("Respuesta de postMedia:", response);
                if (response) {
                    setSelectedImages([...selectedImages, { file, url_API: response.url, url: URL.createObjectURL(file) }]);
                }
            } catch (error) {
                console.error("Error al subir la imagen", error);
            }
        }
    };

    const arrayImages = selectedImages?.map(image => image?.url_API) || [];
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
                            className={`object-cover rounded-md transition-all duration-200 hover:scale-110 ${index === currentImageIndex ? 'border-2 border-blue-500' : ''
                                }`}
                            onClick={() => setCurrentImageIndex(index)}
                        />
                    </div>
                ))}

                <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden object-cover rounded-md transition-all duration-200 hover:scale-110"
                    id="fileInput"
                    onChange={handleImageUpload}
                />
                <label
                    htmlFor="fileInput"
                    className="cursor-pointer flex items-center justify-center w-24 h-24 rounded-lg border-2 border-blue-500 hover:border-blue-700 transition bg-white"
                >
                    <ImagePlus size={20} className="text-blue-500" />
                </label>
            </div>

            {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
            {successMessage && (
                <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{successMessage}</div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Tipo de publicación */}
                <label className="block text-sm font-medium">
                    Tipo de publicación <span className="text-red-500">*</span>
                </label>
                <select
                    name="idPostType"
                    value={formData.idPostType}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded mb-4 ${formErrors.idPostType ? 'border-red-500' : ''}`}
                >
                    <option value={0}>Seleccione un tipo</option>
                    {postTypes.map((type) => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                </select>
                {formErrors.idPostType && (
                    <p className="text-red-500 text-sm mb-4">{formErrors.idPostType}</p>
                )}

                {/* Título */}
                <label className="block text-sm font-medium">
                    Título <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded mb-4 ${formErrors.title ? 'border-red-500' : ''}`}
                />
                {formErrors.title && (
                    <p className="text-red-500 text-sm mb-4">{formErrors.title}</p>
                )}

                {/* Descripción */}
                <label className="block text-sm font-medium">
                    Descripción <span className="text-red-500">*</span>
                </label>
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded mb-4 ${formErrors.content ? 'border-red-500' : ''}`}
                />
                {formErrors.content && (
                    <p className="text-red-500 text-sm mb-4">{formErrors.content}</p>
                )}

                {/* Contacto */}
                <label className="block text-sm font-medium">
                    Número de contacto <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded mb-4 ${formErrors.contactNumber ? 'border-red-500' : ''}`}
                />
                {formErrors.contactNumber && (
                    <p className="text-red-500 text-sm mb-4">{formErrors.contactNumber}</p>
                )}

                {/* Mapa */}
                <div
                    className={`h-full relative transition-opacity duration-300 ${isModalOpen ? "pointer-events-none opacity-50" : ""
                        }`}
                >
                    <MapWithNoSSR position={position} setPosition={setPosition} />
                </div>
                {formErrors.locationCoordinates && (
                    <p className="text-red-500 text-sm mb-4">{formErrors.locationCoordinates}</p>
                )}

                <div className="flex justify-between items-center mt-6 gap-10">
                    {/* Botón eliminar a la izquierda */}
                    <Button
                        type="button"
                        variant="danger"
                        size="md"
                        className="rounded opacity-0"
                        disabled={loading}
                    >
                        Eliminar publicación
                    </Button>

                    {/* Contenedor de cancelar y confirmar a la derecha */}
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

            {/* Modal confirmacion de creación*/}
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