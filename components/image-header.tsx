'use client';

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import EditButton from "./buttons/edit-button";
import { postMedia } from "@/utils/media.http";
import { updateProfileMedia } from "@/utils/profile-media.http"; 

interface HeaderImageProps {
    image?: string; // Imagen actual (puede venir del perfil)
    isEditEnabled: boolean;
}

const notFoundSrc = "/logo.png";

const HeaderImage: React.FC<HeaderImageProps> = ({ image, isEditEnabled }) => {
    const { authToken, user, loading: authLoading } = useAuth();
    const [isHovered, setIsHovered] = useState(false);
    const [currentImage, setCurrentImage] = useState<string>(image || notFoundSrc);
    const [error, setError] = useState<string | null>(null);
    const [isVertical, setIsVertical] = useState<boolean | null>(null);

    useEffect(() => {
        const img = new Image();
        img.src = currentImage;
        img.onload = () => {
            setIsVertical(img.height > img.width);
        };
    }, [currentImage]);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];

            // Validación: tamaño máximo 1MB
            if (file.size > 5 * 1024 * 1024) {
                setError("El archivo es demasiado grande. Tamaño máximo: 1MB.");
                return;
            }

            const fileData = new FormData();
            fileData.append("file", file);

            try {
                if (!authToken) throw new Error("Usuario no autenticado");

                // 1. Subir imagen
                const response = await postMedia(fileData, authToken);
                const { url, mimeType } = response;

                // 2. Actualizar imagen en la vista
                setCurrentImage(url);
                setError(null);

                // 3. Guardar imagen en perfil
                await updateProfileMedia( url, mimeType, authToken);

            } catch (err) {
                console.error("Error al subir o guardar la imagen:", err);
                setError("Hubo un error al subir o guardar la imagen.");
            }
        }
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
                    onChange={handleImageChange}
                />
            )}

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
    );
};

export default HeaderImage;
