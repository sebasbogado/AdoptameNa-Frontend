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
    const [images, setImages] = useState<
        { url: string; isVertical: boolean; id: number }[]
    >([]);
    const maxImageLength = 5;

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!user) throw new Error("No se encontró usuario");
        if (!authToken) throw new Error("El token de autenticación es requerido");

        const files = e.target.files;
        if (!files) return;

        const attempting = files.length;
        if (medias.length + attempting > maxImageLength) {
            setError(`Solo se pueden subir hasta ${maxImageLength} imágenes de portada`);
            return;
        }

        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        const maxSize = 5 * 1024 * 1024;

        const validFiles = Array.from(files).filter(
            (file) => allowedTypes.includes(file.type) && file.size <= maxSize
        );

        if (validFiles.length !== files.length) {
            setError("Archivo no válido. Usa JPG, PNG o WEBP de hasta 5 MB.");
            return;
        }

        try {
            const responses = await Promise.all(
                validFiles.map((file) => {
                    const formData = new FormData();
                    formData.append("file", file);
                    return postMedia(formData, authToken);
                })
            );

            const newMedias = responses as MediaDTO[];
            setMedias((prev) => [...prev, ...newMedias]);

            const allMediaIds = [
                ...medias.map((m) => m.id),
                ...newMedias.map((m) => m.id),
            ];
            await updateUserProfile(
                user.id,
                { ...userProfile, mediaIds: allMediaIds },
                authToken
            );
        } catch (err) {
            console.error(err);
            setError("Hubo un error al subir las imágenes.");
        }
    };

    const handleDelete = async (imageId: number) => {
        if (!user || !authToken) return;
        try {
            const updatedMedias = medias.filter((media) => media.id !== imageId);
            setMedias(updatedMedias);
            await updateUserProfile(
                user.id,
                { ...userProfile, mediaIds: updatedMedias.map((m) => m.id) },
                authToken
            );
        } catch (error) {
            setError("Hubo un error al actualizar las imágenes.");
        }
    };

    const checkOrientation = async (medias: MediaDTO[]) => {
        const promises = medias.map(
            (media) =>
                new Promise<{ id: number; url: string; isVertical: boolean }>(
                    (resolve) => {
                        const img = new window.Image();
                        img.src = media.url;
                        img.onload = () => {
                            const isVertical = img.naturalHeight >= img.naturalWidth;
                            resolve({ id: media.id, url: media.url, isVertical });
                        };
                        img.onerror = () =>
                            resolve({ id: media.id, url: media.url, isVertical: false });
                    }
                )
        );
        const processed = await Promise.all(promises);
        setImages(processed);
    };

    useEffect(() => {
        checkOrientation(medias);
    }, [medias]);

    const isAuthenticated = !!authToken && !authLoading && !!user?.id;
    const canEdit = isEditEnabled && isAuthenticated;

    const showArrows = images.length > 1 && !editionMode;

    return (
        <div className="relative flex flex-col">
            <div
                className="group relative w-full flex justify-center"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Carousel
                    key={images.length}
                    className="rounded-xl overflow-hidden h-[400px] relative w-4/5"
                    loop
                    autoplay
                    autoplayDelay={10000}
                    placeholder="Imagen del Banner"
                    prevArrow={({ handlePrev }) =>
                        showArrows ? (
                            <button
                                onClick={handlePrev}
                                className="!absolute top-2/4 left-4 -translate-y-2/4 rounded-full p-2 z-20 bg-black/30 hover:bg-black/50 transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6 text-white" />
                            </button>
                        ) : null
                    }
                    nextArrow={({ handleNext }) =>
                        showArrows ? (
                            <button
                                onClick={handleNext}
                                className="!absolute top-2/4 right-4 -translate-y-2/4 rounded-full p-2 z-20 bg-black/30 hover:bg-black/50 transition-colors"
                            >
                                <ChevronRight className="w-6 h-6 text-white" />
                            </button>
                        ) : null
                    }
                >
                    {images.length === 0 ? (
                        <Image
                            src={notFoundSrc}
                            alt="Imagen por defecto"
                            className="h-full w-full object-cover"
                            width={1000}
                            height={1000}
                        />
                    ) : (
                        images.map((image, index) => (
                            <div
                                key={index}
                                className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black/5"
                            >
                                {image.isVertical && (
                                    <div
                                        className="absolute inset-0 bg-center bg-cover filter blur-lg scale-110"
                                        style={{ backgroundImage: `url(${image.url})` }}
                                    />
                                )}
                                <Image
                                    src={image.url}
                                    alt={`Imagen ${index + 1}`}
                                    className={`relative z-10 h-full w-full ${image.isVertical ? "object-contain" : "object-cover"
                                        }`}
                                    width={1000}
                                    height={1000}
                                />
                            </div>
                        ))
                    )}
                </Carousel>

                {canEdit && (
                    <>
                        <EditButton
                            isEditing={editionMode}
                            onClick={() => setEditionMode(!editionMode)}
                            className={clsx(
                                "absolute top-4 right-[12.5%] z-20 transition hover:scale-110",
                                editionMode ? "" : "invisible group-hover:visible"
                            )}
                        />
                        <input
                            type="file"
                            id="fileInput"
                            className="hidden"
                            accept="image/*"
                            onChange={handleUpload}
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
                <div className="absolute inset-x-0 bottom-24 z-50 flex justify-center gap-3 p-4">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className="h-24 w-24 border border-gray-300 rounded-md relative"
                        >
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
                            className={clsx(
                                "flex flex-col items-center justify-center w-24 h-24 rounded-md border-2 border-dashed border-gray-300 bg-gray-100 cursor-pointer",
                                images.length >= maxImageLength && "hidden"
                            )}
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
