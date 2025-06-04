import { useEffect, useState } from "react";
import Button from "../buttons/button";
import ReportButton from "../buttons/report-button";
import SendButton from "../buttons/send-button";
import { Alert } from "@material-tailwind/react";
import FavoriteButton from "../buttons/favorite-button";
import { Check, X } from "lucide-react";
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
import { useParams, useRouter } from "next/navigation";
import { AdoptionFormData } from "@/types/schemas/adoption-schema";
import ChangeStatusModal from "@/components/change-status-modal";
import { PetStatus } from "@/types/pet-status";

interface PostButtonsProps {
    postId: string | undefined;
    isPet?: boolean;
    onShare?: () => void;
    postIdUser?: number; //id user owner
    sizeButton?: "xs" | "sm" | "md" | "lg";
    petStatus?: PetStatus;
}

const PostButtons = ({ isPet = false, postId, onShare, postIdUser, sizeButton, petStatus }: PostButtonsProps) => {
    const { authToken, user } = useAuth();
    const [copied, setCopied] = useState(false);
    const router = useRouter();

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

    const [menuOpen, setMenuOpen] = useState(false);
    const [openChangeStatusModal, setOpenChangeStatusModal] = useState(false);

    const isAdoptable = isPet && petStatus?.id === 4; //4 es el id de En Adopcion

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

    const handleConfirmAdoption = async (data: AdoptionFormData) => {

        const requestData: AdoptionRequest = {
            petId: Number(postId),
            fullName: data.fullname,
            email: data.currentEmail,
            phone: data.phone,
        };

        try {
            const result = await postAdoption(requestData);
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
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-2 sm:px-4 md:px-0 md:pr-4 lg:pr-12 relative mt-4 sm:mt-0"> {/* Añadido mt-4 sm:mt-0 para cuando está debajo del PostHeader en mobile */}
            {isAdoptable && !isMyPets && (
                <Button variant="cta" onClick={handleAdoptionClick} className="px-8">
                    Adoptar
                </Button>
            )}

            {!isEditing && (
                <ReportButton size={sizeButton} idEntity={postId} isPet={isPet} />
            )}
            {isEditing && (
                <div className="relative inline-block text-left">
                    <EditButton
                        size={sizeButton}
                        isEditing={false}
                        id="edit-button"
                        onClick={() => {
                            if (isPet) {
                                setMenuOpen(!menuOpen);
                            } else {
                                router.push(`/edit-post/${postId}`);
                            }
                        }}
                    />

                    {menuOpen && isPet && (
                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                            <div className="py-1">
                                {/* Opción 1: Editar Mascota */}
                                <Link
                                    href={`/edit-pets/${postId}`}
                                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Editar Mascota
                                </Link>
                                {/* Opción 2: Cambiar Estado */}
                                <button
                                    type="button"
                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        setOpenChangeStatusModal(true);
                                    }}
                                >
                                    Cambiar Estado
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Adoption Modal */}
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
                <SendButton size={sizeButton} onClick={handleShare} disabled={copied} />
                {copied && (
                    <Alert
                        open={true}
                        color="gray"
                        animate={{
                            mount: { y: 0 },
                            unmount: { y: -100 },
                        }}
                        icon={<Check className="h-5 w-5" />}
                        className="fixed top-4 right-4 left-4 sm:left-auto sm:w-72 shadow-lg z-[10001]"
                        onClose={() => setCopied(false)}
                    >
                        <p className="text-sm">¡Enlace copiado al portapapeles!</p>
                    </Alert>
                )}
            </div>


            <div className="relative"> {/* Contenedor para FavoriteButton y sus alertas */}
                {!isPet && (
                    <FavoriteButton
                        variant={isFavorite ? "active" : "desactivated"}
                        size="xl"
                        className="relative shadow-md 
                            top-[-20px] right-1
                            sm:top-[-120px] sm:left-[20px] 
                            md:top-[-60px] md:left-[40px]"
                        onClick={handleFavoriteClick}
                    />
                )}
                {successMessage && (
                    <Alert
                        open={true}
                        color="green"
                        animate={{
                            mount: { y: 0 },
                            unmount: { y: -100 },
                        }}
                        icon={<Check className="h-5 w-5" />}
                        onClose={() => setSuccessMessage("")}
                        className="fixed top-4 right-4 left-4 sm:left-auto sm:w-72 shadow-lg z-[10001]"
                    >
                        <p className="text-sm">{successMessage}</p>
                    </Alert>
                )}
                {errorMessage && (
                    <Alert
                        open={true}
                        color="red"
                        animate={{
                            mount: { y: 0 },
                            unmount: { y: -100 },
                        }}
                        icon={<X className="h-5 w-5" />}
                        onClose={() => setErrorMessage("")}
                        className="fixed top-4 right-4 left-4 sm:left-auto sm:w-72 shadow-lg z-[10001]"
                    >
                        <p className="text-sm">{errorMessage}</p>
                    </Alert>
                )}
            </div>

            {openChangeStatusModal && (
                <ChangeStatusModal
                    isOpen={openChangeStatusModal}
                    onClose={() => setOpenChangeStatusModal(false)}
                    petId={Number(postId)}
                />
            )}
        </div>
    );
};

export default PostButtons;