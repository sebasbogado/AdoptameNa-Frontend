'use client';

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
import MenuButton from "../buttons/menu-button";
import { getPetsByUserId } from "@/utils/pets.http";
import { Pet } from "@/types/pet";
import { useParams } from "next/navigation";
import TransferModal from "../transfer-modal";
import { RefreshCcw } from "lucide-react";

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

    const [isMyPets, setIsMyPet] = useState(false);
    const params = useParams();

    const petId = Number(params.id);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [openTransferModal, setOpenTransferModal] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    const handleTransferClick = () => {
        setOpenTransferModal(true);
        setIsMenuOpen(false)
    };
    
    const handleConfirmTransfer = () => {
        //transferir mascota llamando al api
        console.log("Mascota transferida!");
        setOpenTransferModal(false); 
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

    useEffect(() => {
        const checkIfPetIsMine = async () => {
          if (!user?.id || !petId) return;
    
          try {
            const response = await getPetsByUserId({ userId: user.id });
            const myPets: Pet[] = response.data;
    
            const found = myPets.some(pet => pet.id === petId);
            setIsMyPet(found);
          } catch (error) {
            console.error("Error al obtener mascotas del usuario", error);
          }
        };
    
        checkIfPetIsMine();
      }, [user?.id, petId]);

    return (
        <div className="m-4 gap-3 flex justify-end h-12 relative pr-12">
            {isPet && <Button variant="cta" size="lg">Adoptar</Button>}
            {isEditing && (
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

            {openTransferModal && (
                <TransferModal
                    isOpen={openTransferModal}
                    onClose={() => setOpenTransferModal(false)}
                    onConfirm={handleConfirmTransfer}
              />
            )}

            {isMenuOpen && (
                <div className="absolute top-12 right-0 m-1 bg-white shadow-2xl p-4 rounded-xl border border-gray-100 transition-all duration-200 ease-out z-50">
                    {/* Contenido del menú */}
                    <button 
                        className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 w-full text-left p-2 rounded"
                        onClick={handleTransferClick}
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Transferir mascota
                    </button>
                </div>
            )}
            
            {  isMyPets && 
                <MenuButton size="lg" onClick={toggleMenu} className="hover:bg-gray-100" />
            }

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