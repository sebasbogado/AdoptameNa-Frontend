import { useEffect, useState } from "react";
import Button from "../buttons/button";
import ReportButton from "../buttons/report-button";
import SendButton from "../buttons/send-button";
import { Alert } from "@material-tailwind/react";
import FavoriteButton from "../buttons/favorite-button";
import { useAuth } from "@/contexts/auth-context";
import { useFavorites } from "@/contexts/favorites-context";
import { Favorites } from "@/types/favorites";
import { addFavorite, deleteFavorite } from "@/utils/favorites-posts.http";
import EditButton from "../buttons/edit-button";
import Link from "next/link";
import AdoptionModal from "../adoption-modal";
import { UserProfile } from "@/types/user-profile";
import { getUserProfile } from "@/utils/user-profile-client";

interface PostButtonsProps {
    postId: string | undefined;
    isPet?: boolean;
    onShare?: () => void;
    postIdUser?: number; //id user owner
}

const PostButtons = ({ isPet = false, postId, onShare, postIdUser }: PostButtonsProps) => {
    const { authToken, user } = useAuth();
    const [copied, setCopied] = useState(false);

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { favorites, fetchFavorites } = useFavorites(); // Usamos el contexto
    const isFavorite = favorites.some((fav: Favorites) => String(fav.postId) === String(postId));
    const isEditing = user?.id === postIdUser;


    const [openAdoptionModal, setOpenAdoptionModal] = useState(false);

    const [userProfile, setUserProfile] = useState<UserProfile>();

    const getUserProfileData = async (userId: string) => {
        try {
            const profile = await getUserProfile(userId);
            console.log("Perfil recibido:", profile);
            setUserProfile(profile);
        } catch (err) {
            console.error("Error al cargar el perfil:", err);
        }
    };
    

    useEffect(() => {
        if (user?.id) {
            getUserProfileData(String(user.id));
        }
    }, [authToken, user?.id]);

    const handleAdoptionClick = () => {
        setOpenAdoptionModal(true);
    };

    const handleConfirmAdoption = (data: any) => {
        //Agregar id de mascota a donar
        console.log("datos para enviar al backend", data);
        setOpenAdoptionModal(false);
    };
    

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
            {isPet && <Button variant="cta" size="lg" onClick={handleAdoptionClick} >Adoptar</Button>}
            {isEditing && (
                <Link href={isPet ? `\/edit-pets/${postId}` : `\/edit-post/${postId}`}>
                    <EditButton size="lg" isEditing={false} />
                </Link>
            )}
            
            {openAdoptionModal && (
                <AdoptionModal
                isOpen={openAdoptionModal}
                onClose={() => setOpenAdoptionModal(false)}
                onConfirm={handleConfirmAdoption}
                currentUser={userProfile?.fullName}
                email={user?.email ?? ""}
                telefono={userProfile?.phoneNumber ?? undefined}
              />
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