import { useState } from "react";
import Button from "../buttons/button";
import ReportButton from "../buttons/report-button";
import SendButton from "../buttons/send-button";
import { Alert } from "@material-tailwind/react";
import FavoriteButton from "../buttons/favorite-button";
import { useAuth } from "@/contexts/auth-context";
import { sharePost } from "@/utils/posts.http";
import { useFavorites } from "@/contexts/favorites-context";
import { Favorites } from "@/types/favorites";
import { addFavorite, deleteFavorite } from "@/utils/favorites-posts.http";

interface PostButtonsProps {
    postId: string | undefined;
    isPet?: boolean;
}
const PostButtons = ({ isPet = false, postId }: PostButtonsProps) => {
    const { authToken } = useAuth();
    const [copied, setCopied] = useState(false);

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { favorites, fetchFavorites } = useFavorites(); // Usamos el contexto
    const isFavorite = favorites.some((fav: Favorites) => String(fav.postId) === String(postId));

    const handleShare = async () => {
        if (!postId) return;

        if (authToken && isPet === false) {
            await sharePost(postId, authToken);
        }
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 3000);
        } catch (error) {
            console.error("Error al copiar al portapapeles:", error);
        }
    }

    const handleFavoriteClick = async () => {
        if (!authToken) {
            setErrorMessage("¡Necesitas estar logeado para agregar a favoritos!");
            return;
        }

        try {
            if (isFavorite) {
                const favorite = favorites.find((fav: Favorites) => String(fav.postId) === String(postId));
                await deleteFavorite(favorite.id, authToken);
                setSuccessMessage("Publicación eliminada de favoritos");
            } else {
                await addFavorite(Number(postId), authToken);
                setSuccessMessage("Publicación añadida a favoritos");
            }
            await fetchFavorites();
        } catch (error) {
            console.error("Error al actualizar favorito", error);
        }
    };

    return (
        <div className="m-4 gap-3 flex justify-end h-12 relative pr-12">
            {
                isPet && (
                    <Button variant="cta" size="lg">Adoptar</Button>

                )
            }

            <div className="relative">
                <SendButton size="lg" onClick={handleShare} disabled={copied} />
                {copied && (
                    <Alert color="gray" className=" absolute top-[-100px] left-1/2 transform -translate-x-1/2 mb-2 w-52 p-2">
                        ¡Enlace copiado al portapapeles!
                    </Alert>
                )}
            </div>

            <ReportButton size="lg" />

            <div className="relative">
                <FavoriteButton variant={isFavorite ? "active" : "desactivated"} size="xl" className="relative top-[-60px] shadow-md left-[40px]" onClick={handleFavoriteClick} />
                {successMessage && (
                    <Alert color="green" className=" absolute top-[-100px] left-1/2 transform -translate-x-1/2 mb-2 w-52 p-2">
                        ¡Añadido a favoritos!
                    </Alert>
                )}
                {errorMessage && (
                    <Alert color="red" className=" absolute top-[-100px] left-1/2 transform -translate-x-1/2 mb-2 w-52 p-2">
                        {errorMessage}
                    </Alert>
                )}
            </div>
        </div>
    );
};

export default PostButtons;