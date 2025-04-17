// utils/profile-media.http.ts

import { postMedia, deleteMediaByUrl } from "./media.http";

export const updateProfileMedia = async (
    file: File,
    currentImageUrl: string | null,
    token: string
): Promise<{
    id: number;
    url: string;
    mimeType: string;
    userId: number;
    uploadDate: string;
}> => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        // 1. Subir nueva imagen
        const uploadedMedia = await postMedia(formData, token);

        // 2. Eliminar imagen anterior (si existe)
        if (currentImageUrl) {
            try {
                await deleteMediaByUrl(currentImageUrl, token);
            } catch (err) {
                console.warn("No se pudo eliminar la imagen anterior:", err);
                // No es fatal, puedes ignorarlo o notificar si quieres
            }
        }

        // 3. Retornar la nueva imagen cargada
        return uploadedMedia;
    } catch (err) {
        console.error("Error al actualizar imagen de perfil:", err);
        throw new Error("Error al actualizar la imagen de perfil");
    }
};
