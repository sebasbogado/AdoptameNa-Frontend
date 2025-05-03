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
import { getUserProfile } from "@/utils/user-profile.http";
import { AdoptionRequest } from "@/types/adoption-request";
import { postAdoption } from "@/utils/adoptions.http";
import { getPetsByUserId } from "@/utils/pets.http";
import { Pet } from "@/types/pet";
import { useParams } from "next/navigation";

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

    const [isMyPets, setIsMyPet] = useState(false);
    const params = useParams();
    const [petName, setPetName] = useState("");


    useEffect(() => {
        const checkIfPetIsMine = async () => {
          if (!user?.id || !params.id) return;
    
          try {
            const response = await getPetsByUserId({ userId: user.id });
            const myPets: Pet[] = response.data;
    
            const found = myPets.find(pet => String(pet.id) === String(params.id));
                if (found) {
                    setIsMyPet(true);
                    setPetName(found.name);
                } else {
                    setIsMyPet(false);
                }
          } catch (error) {
            console.error("Error al obtener mascotas del usuario", error);
          }
        };
    
        checkIfPetIsMine();
      }, [user?.id, params.id]);

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
    }, [user?.id]);

    const handleAdoptionClick = () => {
        setOpenAdoptionModal(true);
    };

    const handleConfirmAdoption = async (data: { fullname: string; currentEmail: string; phone: string; commitment: boolean }) => {
      
        const requestData: AdoptionRequest = {
          petId: Number(postId),
          fullName: data.fullname,
          email: data.currentEmail,
          phone: data.phone,
        };
      
        try {
          const result = await postAdoption(requestData);
          console.log("Solicitud de adopción enviada:", result);
          setSuccessMessage("¡Solicitud enviada correctamente!");
        } catch (error: any) {
          console.error("Error al enviar solicitud:", error.message);
          setErrorMessage(error.message);
        }
      
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
            {isPet && !isMyPets && <Button variant="cta" size="lg" onClick={handleAdoptionClick} >Adoptar</Button>}
            {isEditing && (
                <Link href={isPet ? `\/edit-pets/${postId}` : `\/edit-post/${postId}`}>
                    <EditButton size="lg" isEditing={false} />
                </Link>
            )}
            
            {openAdoptionModal && (
                <AdoptionModal
                isOpen={openAdoptionModal}
                title={`Solicitud para adoptar a ${petName}`}
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