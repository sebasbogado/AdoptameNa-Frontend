'use client';

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import EditButton from "./buttons/edit-button";
import { postMedia } from "@/utils/media.http";
import { updateProfileMedia } from "@/utils/profile-media.http";
import { Alert } from "@material-tailwind/react";
import { updateUserProfile } from "@/utils/user-profile-client";
import { MediaDTO, UserProfile } from "@/types/user-profile";

interface HeaderImageProps {
    image?: string; // Imagen actual (puede venir del perfil)
    isEditEnabled: boolean;
}

const notFoundSrc = "/logo.png";

const HeaderImage = ({ isEditEnabled, userProfile }: { isEditEnabled: boolean, userProfile: UserProfile | null }) => {
    const { authToken, user, loading: authLoading } = useAuth();
    const [isHovered, setIsHovered] = useState(false);
    const [currentImage, setCurrentImage] = useState<string>(userProfile?.media?.[0]?.url || notFoundSrc);
    const [error, setError] = useState<string | null>(null);
    const [isVertical, setIsVertical] = useState<boolean | null>(null);

    

    useEffect(() => {
        const img = new Image();
        img.src = currentImage;
        img.onload = () => {
            setIsVertical(img.height > img.width);
        };
    }, [currentImage]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!user) throw new Error("No se encontro usuario");
        if (!authToken)  throw new Error("El token de autenticación es requerido");
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        const maxSize = 5 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            setError("Formato no permitido. Solo se aceptan imágenes JPG, PNG o WEBP.");
            return;
        }

        if (file.size > maxSize) {
            setError("El archivo es demasiado grande. Tamaño máximo: 5MB.");
            return;
        }
        if (!e.target.files || e.target.files.length === 0) return;
        const selected = e.target.files[0];
        const formData = new FormData();
        formData.append('file', selected);
        const resp: MediaDTO = await postMedia(formData, authToken);
        console.log("respuesta", resp)
        setCurrentImage(resp.url)
        const result = await updateUserProfile(user?.id, {
            ...userProfile,
            mediaIds: [resp.id]
        }, authToken)
        console.log("resultado", result)
        console.log("usuario", user)
    };



    const isAuthenticated = !!authToken && !authLoading && user?.id;
    const canEdit = isEditEnabled && isAuthenticated;

    return (
        <div
            className="relative w-full flex justify-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative h-96 w-4/5 rounded-lg overflow-hidden flex items-center justify-center">
                {isVertical && (
                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            backgroundImage: `url(${currentImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            filter: "blur(20px)",
                            transform: "scale(1.1)",
                        }}
                    />
                )}

                {isVertical !== null && (
                    <img
                        className={`
                            ${isVertical ? "h-full w-auto" : "w-full h-auto"}
                            object-contain transition-all duration-300 relative
                        `}
                        src={currentImage}
                        alt="Imagen de portada"
                    />
                )}
            </div>

            {isHovered && canEdit && (
                <EditButton
                    isEditing={false}
                    onClick={() => document.getElementById('fileInput')?.click()}
                    className="absolute top-4 right-[12.5%] hover: transition duration-300 z-20"
                />
            )}

            {canEdit && (
                <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    accept="image/*"
                    onChange={handleUpload}
                />
            )}

            {error && <Alert
                color="red"
                className="fixed top-4 right-4 w-72 shadow-lg z-[60]"
                onClose={() => setError(null)}
            >
                {error}
            </Alert>}
        </div>
    );
};

export default HeaderImage;
