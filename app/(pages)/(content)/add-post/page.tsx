"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getPostType } from "@/utils/post-type.http";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { postPosts } from "@/utils/posts.http";
import { PostType } from "@/types/post-type";
import { Post } from "@/types/post";

interface FormErrors {
    idPostType?: string;
    title?: string;
    content?: string;
    locationCoordinates?: string;
    contactNumber?: string;
}

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
        publicationDate: new Date().toISOString()
    });

    {/* Realizando la autenticación para ingresar a crear publicación */ }
    useEffect(() => {
        if (!authLoading && !authToken) {
            router.push("/auth/login");
        }
    }, [authToken, authLoading, router]);

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

    {/* Función para enviar la publicación */ }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

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


        const payload = {
            ...formData,
            idPostType: Number(formData.idPostType),
            idUser: user ? Number(user.id) : 0,
        };

        try {
            await postPosts(payload as Post, authToken);
            setSuccessMessage("¡Publicación creada exitosamente!");

            setTimeout(() => {
                setFormData({
                    id: 0,
                    idUser: user ? Number(user.id) : 0,
                    title: "",
                    content: "",
                    idPostType: 0,
                    locationCoordinates: "",
                    contactNumber: "",
                    status: "activo",
                    sharedCounter: 0,
                    publicationDate: new Date().toISOString()
                });
                setSuccessMessage(null);
            }, 2000);
        } catch (error: any) {
            setError(error.message || "Error al crear la publicación");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <div className="flex gap-2 mb-4">
                <Image src="/adopcion.jpg" alt="Preview" width={100} height={100} className="rounded-lg" />
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

                {/* Ubicación */}
                <label className="block text-sm font-medium">
                    Ubicación <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="locationCoordinates"
                    value={formData.locationCoordinates}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded mb-4 ${formErrors.locationCoordinates ? 'border-red-500' : ''}`}
                />
                {formErrors.locationCoordinates && (
                    <p className="text-red-500 text-sm mb-4">{formErrors.locationCoordinates}</p>
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

                <div className="flex justify-between items-center mt-6 gap-10">
                    {/* Botón eliminar a la izquierda */}
                    <button
                        type="button"
                        className="bg-red-600 text-white px-6 py-2 rounded opacity-0"
                        disabled={loading}
                    >
                        Eliminar publicación
                    </button>

                    {/* Contenedor de cancelar y confirmar a la derecha */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            className="border px-6 py-2 rounded"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-purple-600 text-white px-6 py-2 rounded disabled:bg-purple-400"
                            disabled={loading}
                        >
                            {loading ? "Creando..." : "Crear publicación"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}