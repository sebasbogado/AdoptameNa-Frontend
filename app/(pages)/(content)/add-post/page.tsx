"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { FormData as FormDataPost } from "@/components/post/form-data";
import { MAX_TAGS, MAX_IMAGES, MAX_BLOG_IMAGES } from "@/validations/post-schema";
import { allowedImageTypes, blogFileSchema, fileSchema } from "@/utils/file-schema";
import { ChevronLeftIcon } from "lucide-react";
import Loading from "@/app/loading";
import { usePostForm } from "@/hooks/use-post-form";

export default function Page() {
    const { authToken, user, loading: authLoading } = useAuth();
    const [errorMessage, setErrorMessage] = useState("");
    const [saveLoading, setSaveLoading] = useState<boolean>(false);
    const [precautionMessage, setPrecautionMessage] = useState("");

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        control,
        trigger,
        errors,
        watchedPostTypeId,
        selectedImages,

        handleEditorImageUpload,
        handleRemoveImage,
        currentImageIndex,
        setCurrentImageIndex,
        handleImageUpload,
    } = usePostForm(setSaveLoading, setErrorMessage, setPrecautionMessage, authToken);
    const [loading, setLoading] = useState<boolean>(true);
    const [successMessage, setSuccessMessage] = useState("");
    const [postTypes, setPostTypes] = useState<PostType[]>([]);
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTags, setSelectedTags] = useState<Tags[]>([]);
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [validatedData, setValidatedData] = useState<PostFormValues | null>(null);
    const [tags, setTags] = useState<Tags[]>([]);
    const handlePositionChange = useCallback((newPosition: [number, number] | null) => {
        setPosition(newPosition);
        if (newPosition) {
            setValue("locationCoordinates", newPosition, { shouldValidate: true, shouldDirty: true });
        }
    }, [setValue]);

    useEffect(() => {
        if (!authLoading && !authToken) {
            sessionStorage.setItem("redirectTo", window.location.pathname);
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

        const generalTags = tags.filter(tag => tag.postTypeId === null);

        let specificTags: Tags[] = [];
        if (watchedPostTypeId === POST_TYPEID.BLOG || watchedPostTypeId === POST_TYPEID.VOLUNTEERING) {
            specificTags = tags.filter(tag => tag.postTypeId === watchedPostTypeId);
        }

        return [...generalTags, ...specificTags];

    }, [tags, watchedPostTypeId]);

    useEffect(() => {
        const validSelectedTags = selectedTags.filter(selectedTag =>
            filteredTags.some(filteredTag => filteredTag.id === selectedTag.id)
        );

        if (validSelectedTags.length !== selectedTags.length) {
            setSelectedTags(validSelectedTags);
            setValue("tagIds", validSelectedTags.map(tag => tag.id), { shouldValidate: true });
        }
    }, [filteredTags, setValue]);

    const openConfirmationModal = (data: PostFormValues) => {
        setValidatedData(data);
        setIsModalOpen(true);
    };

    const onSubmit = (data: PostFormValues) => {
        openConfirmationModal(data);
    };

    const confirmSubmit = async () => {
        if (!authToken || !user?.id || !validatedData) {
            setPrecautionMessage("Faltan completar datos para crear producto!");
            return;
        }
        setIsModalOpen(false);
        setSaveLoading(true);
        const updatedFormData: CreatePost = {
            userId: Number(user?.id),
            title: validatedData.title,
            content: validatedData.content,
            tagIds: validatedData.tagIds || [],
            postTypeId: validatedData.postTypeId,
            locationCoordinates: validatedData.locationCoordinates?.join(",") || "",
            mediaIds: validatedData.mediaIds || [],
            blogImages: validatedData.blogImages || [],
            hasSensitiveImages: validatedData.hasSensitiveImages

        };
        if (validatedData.contactNumber && validatedData.contactNumber.trim() !== "") {
            updatedFormData.contactNumber = validatedData.contactNumber;
        }
        if (!authToken) {
            setErrorMessage("No se pudo obtener el token de authenticación!");
            setLoading(false);
            return;
        }

        try {
            const response = await createPost(updatedFormData, authToken);
            if (response && response.id) {
                setSuccessMessage("Post creado exitosamente.")

                if (validatedData.postTypeId === POST_TYPEID.BLOG) {
                    router.push(`/blog/${response.id}`);
                } else {
                    router.push(`/posts/${response.id}`);
                }
            } else {
                setErrorMessage("Se ha producido un error. Inténtelo de nuevo!")
                router.push("/dashboard");
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


    const wrappedHandleRemoveImage = (index: number) =>
        handleRemoveImage(index, deleteMedia);

    const wrappedHandleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) =>
        handleImageUpload(e, watchedPostTypeId);
       if (authLoading || loading) {
        return <Loading />;
    }
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
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-bold text-text-primary">Nueva publicación</h1>
                </div>
               <NewBanner
                medias={
                    watchedPostTypeId === POST_TYPEID.BLOG
                    ? selectedImages.slice(0, 1)
                    : selectedImages
                }
                />
                <UploadImages
                    selectedImages={selectedImages}
                    currentImageIndex={currentImageIndex}
                    setCurrentImageIndex={setCurrentImageIndex}
                    handleRemoveImage={wrappedHandleRemoveImage}
                    handleImageUpload={wrappedHandleImageUpload}
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
                    control={control}
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
        </div>
    );

}