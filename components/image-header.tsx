'use client';

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import EditButton from "./buttons/edit-button";
import { postMedia } from "@/utils/media.http";
import { Alert, Carousel, Tooltip } from "@material-tailwind/react";
import { updateUserProfile } from "@/utils/user-profile-client";
import { MediaDTO, UserProfile } from "@/types/user-profile";
import { ChevronLeft, ChevronRight, ImagePlusIcon, X } from "lucide-react";
import Image from "next/image";
import clsx from "clsx";

const notFoundSrc = "/logo.png"; // Imagen por defecto

const HeaderImage = ({
    isEditEnabled,
    userProfile,
    medias,
    setMedias,
}: {
    isEditEnabled: boolean;
    userProfile: UserProfile | null;
    medias: MediaDTO[];
    setMedias: React.Dispatch<React.SetStateAction<MediaDTO[]>>;
}) => {
    const { authToken, user, loading: authLoading } = useAuth();
    const [isHovered, setIsHovered] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editionMode, setEditionMode] = useState<boolean>(false);
    const [images, setImages] = useState<{ url: string; isVertical: boolean; id: number }[]>([]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!user) throw new Error("No se encontró usuario");
        if (!authToken) throw new Error("El token de autenticación es requerido");

        const files = e.target.files;
        if (!files) return;

        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        const maxSize = 5 * 1024 * 1024;

        // Filtrar archivos no permitidos o demasiado grandes
        const validFiles = Array.from(files).filter((file) =>
            allowedTypes.includes(file.type) && file.size <= maxSize
        );

        if (validFiles.length !== files.length) {
            setError("Algunos archivos son inválidos o demasiado grandes.");
            return;
        }

        // Subir todas las imágenes válidas
        const formData = new FormData();
        validFiles.forEach((file) => formData.append("file", file));

        try {
            // Subir todas las imágenes a la vez
            const responses = await Promise.all(
                validFiles.map((file) => postMedia(formData, authToken))  // Suponiendo que postMedia acepta múltiples archivos
            );

            // Añadir las imágenes al estado
            const newMedias = responses.map((resp: MediaDTO) => resp);
            setMedias([...medias, ...newMedias]);

            // Actualizar el perfil del usuario con los nuevos mediaIds
            await updateUserProfile(user?.id, {
                ...userProfile,
                mediaIds: [...(medias.map(media => media.id)), ...newMedias.map((media) => media.id)],
            }, authToken);
        } catch (error) {
            setError("Hubo un error al subir las imágenes.");
        }
    };

    const handleDelete = async (imageId: number) => {
        if (!user || !authToken) return;

        try {
            // Filtrar la imagen eliminada de las listas de medias e imágenes
            const updatedMedias = medias.filter((media) => media.id !== imageId);

            // Actualizar el estado de medias
            setMedias(updatedMedias);

            // Actualizar el perfil del usuario (mediaIds)
            await updateUserProfile(user?.id, {
                ...userProfile,
                mediaIds: updatedMedias.map((media) => media.id),
            }, authToken);
        } catch (error) {
            setError("Hubo un error al actualizar las imágenes.");
        }
    };


    const checkOrientation = async (medias: MediaDTO[]) => {
        const processedImages = medias.map((media) => {
            return {
                ...media,
                isVertical: false
            };
        })

        setImages(processedImages);
    };

    useEffect(() => {
        checkOrientation(medias);
    }, [medias]);

    const isAuthenticated = !!authToken && !authLoading && !!user?.id;
    const canEdit = isEditEnabled && isAuthenticated;

    return (
        <div className="relative flex flex-col">
            <div
                className="group relative w-full flex justify-center"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Carousel key={images.length}
                    className="rounded-xl overflow-hidden h-[400px] relative w-4/5"
                    loop
                    autoplay
                    autoplayDelay={10000}
                    placeholder="Imagen del Banner"
                    prevArrow={({ handlePrev }) => (
                        <button
                            onClick={handlePrev}
                            className="!absolute top-2/4 left-4 -translate-y-2/4 rounded-full p-2 bg-black/30 hover:bg-black/50 transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6 text-white" /> 
                        </button>
                    )}
                    nextArrow={({ handleNext }) => (
                        <button
                            onClick={handleNext}
                            className="!absolute top-2/4 right-4 -translate-y-2/4 rounded-full p-2 bg-black/30 hover:bg-black/50 transition-colors"
                        >
                            <ChevronRight className="w-6 h-6 text-white" /> 
                        </button>
                    )}
                >
                    {images.length === 0
                        ? <img src={notFoundSrc} alt="Imagen por defecto" className="h-full w-full object-cover" />
                        : images.map((image, index) => (
                            <div key={index} className="relative w-full h-full">
                                <img
                                    src={image.url}
                                    alt={`Imagen ${index + 1}`}
                                    className={`h-full w-full ${image.isVertical ? 'object-contain' : 'object-cover'}`}
                                />
                            </div>
                        ))
                    }
                </Carousel>

                {canEdit && (
                    <>
                        <EditButton
                            isEditing={editionMode}
                            onClick={() => setEditionMode(!editionMode)}
                            className={clsx("absolute top-4 right-[12.5%] z-20 transition hover:scale-110", editionMode ? "" : "invisible group-hover:visible")}
                        />
                        <input
                            type="file"
                            id="fileInput"
                            className="hidden"
                            accept="image/*"
                            onChange={handleUpload}
                            multiple
                        />
                    </>
                )}

                {error && (
                    <Alert
                        color="red"
                        className="fixed top-4 right-4 w-72 shadow-lg z-[60]"
                        onClose={() => setError(null)}
                    >
                        {error}
                    </Alert>
                )}
            </div>

            {canEdit && editionMode && (
                <div className="absolute z-50 flex gap-3 p-4">
                    {images.map((image, index) => (
                        <div key={index} className="h-24 w-24 border border-gray-300 rounded-md relative">
                            <Image
                                src={image.url}
                                alt={`Imagen ${index + 1}`}
                                width={96}
                                height={96}
                                className="object-cover w-full h-full rounded-lg"
                            />
                            <span
                                className="absolute -top-1 -right-1 bg-red-600 h-4 w-4 rounded-full flex justify-center items-center cursor-pointer"
                                onClick={() => handleDelete(image.id)}
                            >
                                <X className="h-3 w-3 text-white" />
                            </span>
                        </div>
                    ))}
                    <Tooltip content="Agregar una imagen">
                        <label
                            htmlFor="fileInput"
                            className="flex flex-col items-center justify-center w-24 h-24 rounded-md border-2 border-dashed border-gray-300 bg-gray-100 cursor-pointer"
                        >
                            <ImagePlusIcon className="h-8 w-8 text-gray-500" />
                        </label>
                    </Tooltip>
                </div>
            )}
        </div>
    );
};

export default HeaderImage;