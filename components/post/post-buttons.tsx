import { useState } from "react";
import Button from "../buttons/button";
import ReportButton from "../buttons/report-button";
import SendButton from "../buttons/send-button";
import { Alert } from "@material-tailwind/react";
import FavoriteButton from "../buttons/favorite-button";
import { useAuth } from "@/contexts/auth-context";
import { useFavorites } from "@/contexts/favorites-context";
import { Favorites } from "@/types/favorites";
import { addFavorite, deleteFavorite } from "@/utils/favorites-posts.http";
import TrashButton from "../buttons/trash-button";
import EditButton from "../buttons/edit-button";
import { deletePost } from "@/utils/posts.http";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { deletePet } from "@/utils/pets.http";


interface PostButtonsProps {
    postId: string | undefined;
    isPet?: boolean;
    onShare?: () => void;
    postIdUser?: number;
}


const PostButtons = ({ isPet = false, postId, onShare, postIdUser }: PostButtonsProps) => {
    const pathname = usePathname();
    const { authToken, user } = useAuth();
    const isOwner = postIdUser === user?.id;
    const [copied, setCopied] = useState(false);
    const router = useRouter();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { favorites, fetchFavorites } = useFavorites(); // Usamos el contexto
    const isFavorite = favorites.some((fav: Favorites) => String(fav.postId) === String(postId));
    const isInPetsSection = pathname.includes('/pets');
    const isInPostsSection = pathname.includes('/posts');

    const handleShare = async () => {
        if (!postId) return;

        if (onShare && !isPet) {
            onShare();
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
    };

    const handleDeletePet = async () => {
        if (!authToken) {
            setErrorMessage("Debes estar logeado para eliminar una mascota.");
            return;
        }

        const confirmDelete = confirm("¿Estás seguro de que quieres eliminar esta mascota?");
        if (!confirmDelete) return;

        try {
            await deletePet(String(postId), authToken);
            setSuccessMessage("Mascota eliminada correctamente.");
            router.push("/profile");


        } catch (error) {
            console.error("Error al eliminar mascota:", error);
            setErrorMessage("Ocurrió un error al eliminar la mascota.");
        }
    };
    const handleDeletePost = async () => {
        if (!authToken) {
            setErrorMessage("Debes estar logeado para eliminar una publicación.");
            return;
        }

        const confirmDelete = confirm("¿Estás seguro de que quieres eliminar esta publicación?");
        if (!confirmDelete) return;

        try {
            await deletePost(String(postId), authToken);
            setSuccessMessage("Publicación eliminada correctamente.");
            router.push("/profile");


        } catch (error) {
            console.error("Error al eliminar Publicación:", error);
            setErrorMessage("Ocurrió un error al eliminar la publicación.");
        }
    };
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
            {isPet && <Button variant="cta" size="lg">Adoptar</Button>}
            
            {isOwner && isInPetsSection && (
                <TrashButton size="lg" onClick={handleDeletePet} />
            )}

            {isOwner && isInPostsSection && (
                <TrashButton size="lg" onClick={handleDeletePost} />
            )}


            {isOwner && (
                <Link href={isPet ? `\/edit-pets/${postId}` : `\/edit-post/${postId}`}>
                    <EditButton size="lg" isEditing={false} />
                </Link>
            )}

            <div className="relative">
                <SendButton size="lg" onClick={handleShare} disabled={copied} />
                {copied && (
                    <Alert color="gray" className="absolute top-[-100px] left-1/2 transform -translate-x-1/2 mb-2 w-52 p-2">
                        ¡Enlace copiado al portapapeles!
                    </Alert>
                )}
            </div>

            <ReportButton size="lg" />

            <div className="relative">
                {!isPet &&
                    <FavoriteButton variant={isFavorite ? "active" : "desactivated"} size="xl" className="relative top-[-60px] shadow-md left-[40px]" onClick={handleFavoriteClick} />
                }
                {successMessage && (
                    <Alert
                        color="green"
                        onClose={() => setSuccessMessage("")}
                        className="fixed bottom-4 right-0 m-5 z-50 w-80"
                    >
                        {successMessage}
                    </Alert>
                )}
                {errorMessage && (
                    <Alert
                        color="red"
                        onClose={() => setErrorMessage("")}
                        className="fixed bottom-4 right-0 m-5 z-50 w-80"
                    >
                        {errorMessage}
                    </Alert>
                )}
            </div>
        </div>
    );
};

export default PostButtons;