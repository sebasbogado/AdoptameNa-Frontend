"use client"

import Loading from "@/app/loading";
import Image from "next/image";
import { useAuth } from "@/contexts/authContext";
import { Post } from "@/types/post";
import { PostType } from "@/types/post-type";
import { getPostType } from "@/utils/post-type.http";
import { getPostById, updatePost } from "@/utils/posts.http";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface FormErrors {
    idPostType?: string;
    title?: string;
    content?: string;
    locationCoordinates?: string;
    contactNumber?: string;
}

const fetchContentData = async (
    setPost: React.Dispatch<React.SetStateAction<Post | null>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setPostError: React.Dispatch<React.SetStateAction<string | null>>,
    setFormData: React.Dispatch<React.SetStateAction<Partial<Post>>>, // Agregar setFormData
    postId: string
) => {
    try {
        // Cargar posts del usuario
        const postData = await getPostById(postId);
        setPost(postData);
        setFormData({
            title: postData.title || "",
            content: postData.content || "",
            idPostType: postData.idPostType || 0,
            locationCoordinates: postData.locationCoordinates || "",
            contactNumber: postData.contactNumber || "",
            status: postData.status || "",
            sharedCounter: postData.sharedCounter || 0,
            publicationDate: postData.publicationDate,
        });
    } catch (err) {
        console.error("Error al cargar posts:", err);
        setPostError("No se pudieron cargar las publicaciones.");
    } finally {
        setLoading(false);
    }
};

export default function Page() {
    const { postId } = useParams();
    const { authToken, user, loading: authLoading } = useAuth();
    const [post, setPost] = useState<Post | null>(null);
    const [postTypes, setPostTypes] = useState<PostType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [postsError, setPostsError] = useState<string | null>(null);
    const router = useRouter();

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [formData, setFormData] = useState<Partial<Post>>({
        idUser: user ? Number(user.id) : 0,
        title: "",
        content: "",
        idPostType: 0,
        locationCoordinates: "",
        contactNumber: "",
        status: "",
        sharedCounter: 0,
        publicationDate: undefined,
    });

    useEffect(() => {
        if (!authLoading && !authToken) {
            console.log("authLoading", authLoading);
            console.log("authToken", authToken);
            router.push("/auth/login");
        }

    }, [authToken, authLoading, router])

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

    useEffect(() => {
        if (authLoading || !authToken || !user?.id) return;
        console.log("authLoading", authLoading);
        console.log("URL params", postId);
        fetchContentData(setPost, setLoading, setError, setFormData, String(postId));
        fetchPostTypes();

    }, [authToken, authLoading, user?.id]);

    if (authLoading) {
        return Loading();
    }

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

    const handleSubmit = async (e: React.FormEvent) => {
        console.log(formData);
        // e.preventDefault();
        // if (!post || !authToken) return;
        // try {
        //     await updatePost(post.id.toString(), post, authToken);
        //     alert("¡Publicación actualizada!");
        //     router.push("/");
        // } catch (error) {
        //     console.error("Error al actualizar la publicación", error);
        //     setPostsError("Hubo un problema al actualizar la publicación.");
        // }
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
                        className="bg-red-600 text-white px-6 py-2 rounded"
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
                            {loading ? "Editando..." : "Confirmar cambios"}
                        </button>
                    </div>
                </div>
            </form>
        </div>

    );
}