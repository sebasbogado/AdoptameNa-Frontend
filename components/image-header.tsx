import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context"; // Para verificar la autenticación
import { Button } from "@material-tailwind/react";
import EditButton from "./buttons/edit-button";

interface HeaderImageProps {
    image?: string; // La imagen actual de portada
    isEditEnabled: boolean; // Prop que indica si el botón de edición está habilitado
}

const notFoundSrc = "/logo.png";

const HeaderImage: React.FC<HeaderImageProps> = ({ image, isEditEnabled }) => {
    const { authToken, user, loading: authLoading } = useAuth(); // Usamos la autenticación
    const [isHovered, setIsHovered] = useState(false); // Para manejar el estado del hover
    const [currentImage, setCurrentImage] = useState<string>(image || notFoundSrc); // Imagen en estado
    const [error, setError] = useState<string | null>(null); // Para manejar errores al subir imagen

    const [isVertical, setIsVertical] = useState<boolean | null>(null);

    useEffect(() => {
        const img = new Image();
        img.src = currentImage;
        img.onload = () => {
            setIsVertical(img.height > img.width);
        };
    }, [currentImage]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];



            // Simula la subida de la imagen (en este caso, usamos URL.createObjectURL solo como ejemplo)
            const reader = new FileReader();
            reader.onloadend = () => {
                setCurrentImage(reader.result as string); // Actualiza la imagen en el estado
            };
            reader.readAsDataURL(file);
        }
    };

    // Verificar si el usuario está autenticado
    const isAuthenticated = !!authToken && !authLoading && user?.id;

    // Si el botón de edición no está habilitado, no mostramos el botón de "Cambiar portada"
    const canEdit = isEditEnabled && isAuthenticated;

    return (
        <div 
            className="relative w-full flex justify-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Contenedor de imagen con fondo blur si es vertical */}
            <div className="relative h-96 w-4/5 rounded-lg overflow-hidden flex items-center justify-center">
                {/* Fondo blur solo si la imagen es vertical */}
                {isVertical && (
                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            backgroundImage: `url(${currentImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            filter: "blur(20px)",
                            transform: "scale(1.1)", // evita bordes visibles por el blur
                        }}
                    />
                )}
    
                {/* Imagen principal */}
                {isVertical !== null && (
                    <img
                        className={`
                            ${isVertical ? "h-full w-auto" : "w-full h-auto"}
                            object-contain transition-all duration-300 relative z-10
                        `}
                        src={currentImage}
                        alt="Imagen de portada"
                    />
                )}
            </div>
    
            {/* Botón editar */}
            {isHovered && canEdit && (
                <EditButton
                    isEditing={false}
                    onClick={() => document.getElementById('fileInput')?.click()}
                    className="absolute top-4 right-[12.5%] hover: transition duration-300 z-20"
                />
            )}
    
            {/* Input oculto */}
            {canEdit && (
                <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                />
            )}
    
            {/* Mensaje de error */}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
    );
    
};

export default HeaderImage;
