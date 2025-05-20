"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
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
import {FormData as FormDataPost} from "@/components/post/form-data";
import { MAX_TAGS } from "@/validations/post-schema";


export default function Page() {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        control,
        formState: { errors, isSubmitting },
        trigger,
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
            <UploadImages 
                selectedImages={selectedImages}
                currentImageIndex={currentImageIndex}
                setCurrentImageIndex={setCurrentImageIndex}
                handleRemoveImage={handleRemoveImage}
                handleImageUpload={handleImageUpload}
                MAX_IMAGES={MAX_IMAGES}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
                precautionMessage={precautionMessage}
                setPrecautionMessage={setPrecautionMessage}
                successMessage={successMessage}
                setSuccessMessage={setSuccessMessage}
            />

           <FormDataPost
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
                loading={loading}
                handleCancel={handleCancel}
                handlePositionChange={handlePositionChange}
                closeModal={closeModal}
                confirmSubmit={confirmSubmit}
                MAX_IMAGES={MAX_IMAGES}
                MAX_TAGS={MAX_TAGS}
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
);

}