"use client"

import Loading from "@/app/loading";
import Image from "next/image";
import { useAuth } from "@/contexts/authContext";
import { Post } from "@/types/post";
import { PostType } from "@/types/post-type";
import { getPostsType } from "@/utils/post-type.http";
import { deletePost, getPost, updatePost } from "@/utils/posts.http";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/buttons/button";
import { ConfirmationModal } from "@/components/form/modal";
import NotFound from "@/app/not-found";

interface FormErrors {
    idPostType?: string;
    title?: string;
    content?: string;
    locationCoordinates?: string;
    contactNumber?: string;
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
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal para confirmar cambios
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Modal para eliminar

    useEffect(() => {
        if (!authLoading && !authToken) {
            console.log("authLoading", authLoading);
            console.log("authToken", authToken);
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

    useEffect(() => {
        const fetchPost = async () => {
            if (authLoading || !authToken || !user?.id) return;

            try {
                const postData = await getPost(String(postId));
                setFormData(postData)
                setPost(postData); // Estado asíncrono, aún NO refleja el cambio aquí
            } catch (err) {
                console.error("Error al cargar posts:", err);
                setPostError("No se pudieron cargar las publicaciones.");
                return NotFound();
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
        fetchPostTypes();
    }, [authToken, authLoading, user?.id, postId]); // Agregar postId a las dependencias

    // Nuevo useEffect para validar permisos después de que post cambie
    useEffect(() => {
        if (!post || !user?.id) return;
        if ((postError !== null) || (String(post.idUser) !== String(user.id))) {
            router.push("/");
        }

    }, [post, user?.id]); // Se ejecuta cuando post o user.id cambian

    if (authLoading) return Loading();
    if (loading) return Loading();
    if (postError !== null) return NotFound();

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
        e.preventDefault();
        setIsEditModalOpen(true); // Mostrar modal de confirmación de cambios
    };

    const confirmEdit = async () => {
        setIsEditModalOpen(false); // Cerrar el modal
        if (!post || !authToken) return;

        const payload = {
            ...formData,
            idPostType: Number(formData.idPostType),
            idUser: user ? Number(user.id) : 0,
        };

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setFormErrors(validationErrors);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            await updatePost(String(post.id), payload as Post, authToken);
            setSuccessMessage('¡Publicación actualizada con éxito!');
            setTimeout(() => router.push(`/post/${post.id}`), 1500); // Redirige después de mostrar el mensaje
        } catch (error) {
            console.error('Error al actualizar la publicación', error);
            setError('Hubo un problema al actualizar la publicación.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        setIsDeleteModalOpen(true); // Mostrar modal de eliminación
    };

    const confirmDelete = async () => {
        setIsDeleteModalOpen(false); // Cerrar el modal
        if (!post?.id || !authToken) {
            console.error('Falta el ID de la publicación o el token');
            return;
        }

        setLoading(true);
        try {
            await deletePost(String(post.id), authToken);
            setSuccessMessage('Publicación eliminada con éxito');
            setTimeout(() => router.push('/dashboard'), 1500); // Redirige después de mostrar el mensaje
        } catch (error) {
            console.error('Error al eliminar la publicación:', error);
            setError('Hubo un problema al eliminar la publicación.');
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setIsEditModalOpen(false); // Cerrar modal de edición
        setIsDeleteModalOpen(false); // Cerrar modal de eliminación
    };

    // Función para manejar el clic en "Cancelar"
    const handleCancel = () => {
        console.log("desde el handle cancel", isDeleteModalOpen)
        console.log(isEditModalOpen)
        //router.push(`/post/${post.id}`); // Redirige a /post/{id}
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
                    <option value="">Seleccione un tipo</option>
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
                    <Button
                        type="button"
                        variant="danger"
                        size="md"
                        className="rounded hover:bg-red-700"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? 'Eliminando...' : 'Eliminar publicación'} {/* Texto dinámico */}
                    </Button>

                    {/* Contenedor de cancelar y confirmar a la derecha */}
                    <div className="flex gap-4">
                        <Button
                            type="button"
                            variant="tertiary"
                            size="md"
                            className="border rounded text-gray-700 hover:bg-gray-100"
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="cta"
                            size="md"
                            className="rounded hover:bg-purple-700"
                            onClick={confirmEdit}
                            disabled={loading}
                        >
                            {loading ? "Editando..." : "Confirmar cambios"}
                        </Button>
                    </div>
                </div>
            </form>
            {/* Modal de confirmación de cambios */}
            {isEditModalOpen &&
                <ConfirmationModal
                    isOpen={isEditModalOpen}
                    title="Confirmar cambios"
                    message="¿Estás seguro de que deseas guardar los cambios en esta publicación?"
                    textConfirm="Confirmar cambios"
                    confirmVariant="cta"
                    onClose={closeModal}
                    onConfirm={confirmEdit}
                />}

            {/* Modal de confirmación de eliminación */}
            {isDeleteModalOpen &&
                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    title="Confirmar eliminación"
                    message="¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer."
                    textConfirm="Eliminar"
                    confirmVariant="danger"
                    onClose={closeModal}
                    onConfirm={confirmDelete}
                />}
        </div>
    );
}