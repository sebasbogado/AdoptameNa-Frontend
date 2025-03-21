'use client';

import Button from '@/components/buttons/button';
import EditButton from '@/components/buttons/edit-button';
import MenuButton from '@/components/buttons/menu-button';
import Banners from '@/components/banners';
import { useEffect, useState } from 'react';
import Footer from '@/components/footer';
import { Section } from '@/components/section';
import { ConfirmationModal } from "@/components/form/modal";

import { getPosts } from '@/utils/posts.http';
import { getPetsByUserId } from '@/utils/pets.http';
import { getUserProfile, updateUserProfile } from '@/utils/user-profile-client';
import { UpdateUserProfile, UserProfile } from '@/types/user-profile';
import { Post } from '@/types/post';
import { Pet } from '@/types/pet';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import { Mail, Phone, SplineIcon } from 'lucide-react';
import Loading from '@/app/loading';
import { Detail } from '@/components/profile/detail-form';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { profileSchema } from '@/validations/user-profile';
const getUserProfileData = async (

    setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
    userId: string,
) => {

    try {
        // Cargar perfil de usuario
        const profile = await getUserProfile(userId);
        setUserProfile(profile);

    } catch (err) {
        console.error("Error al cargar el perfil:", err);
        setError("No se pudo cargar la información del perfil");
    } finally {
        setLoading(false);
    }
};

const getPostsData = async (
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setPostsError: React.Dispatch<React.SetStateAction<string | null>>,
    userId: string,
) => {


    try {
        // Cargar posts del usuario
        const postParams = { user: userId }; // Usamos el ID del usuario actual
        const postData = await getPosts(postParams);
        setPosts(Array.isArray(postData) ? postData : []);
    } catch (err) {
        console.error("Error al cargar posts:", err);
        setPostsError("No se pudieron cargar las publicaciones.");
    } finally {
        setLoading(false);
    }
};
const getPetsData = async (
    setPets: React.Dispatch<React.SetStateAction<Pet[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setPetsError: React.Dispatch<React.SetStateAction<string | null>>,
    userId: string,
) => {


    try {
        const petData = await getPetsByUserId(userId);
        setPets(Array.isArray(petData) ? petData : []);
    } catch (err) {
        console.error("Error al cargar posts:", err);
        setPetsError("No se pudieron cargar las publicaciones.");
    } finally {
        setLoading(false);
    }
};

export default function ProfilePage() {
    const { authToken, user, loading: authLoading } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [profileLoading, setProfileLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false)
    const [postsError, setPostsError] = useState<string | null>(null);
    const [petsError, setPetsError] = useState<string | null>(null);
    const [tempUserProfile, setTempUserProfile] = useState<UserProfile | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [isOpen , setIsOpen] = useState(false)   

    const updateProfile = async (profileToUpdate: UpdateUserProfile) => {
        if (authLoading || !authToken || !user?.id) return;
        if (!validateProfile(profileToUpdate)) {
            setIsEditing(true)
            return
        }



        setProfileLoading(true);
        setError(null);

        try {
            const updatedProfile = await updateUserProfile(user.id, profileToUpdate, authToken);
            setUserProfile(updatedProfile); // Actualizamos el estado después de recibir la respuesta
        } catch (err) {
            console.error("Error al actualizar el perfil:", err);
            setError("No se pudo actualizar la información del perfil");
        } finally {
            setProfileLoading(false);
        }
    };


    const handleEditButtonClick = () => {

        if (!isEditing) {
            setTempUserProfile(userProfile); // Guardar valores originales
        }
        setValidationErrors({});
        setIsEditing(!isEditing);

    };


    const handleSaveButtonClick = () => {
        setIsOpen(true); // Abre el modal de confirmación
    };

    const handleConfirmSave = async () => {
        setIsOpen(false); // Cierra el modal
        setIsEditing(false);
        if (tempUserProfile) {
            await updateProfile(tempUserProfile);
        }
    };

    useEffect(() => {
        if (!authLoading && !authToken) {
            console.log("authLoading", authLoading);
            console.log("authToken", authToken);
            router.push("/auth/login");
        }

    }, [authToken, authLoading, router]);


    useEffect(() => {
        if (authLoading || !authToken || !user?.id) return;
        setLoading(true);
        setError(null);
        getUserProfileData(
            setUserProfile,
            setProfileLoading,
            setError,
            user.id
        );
    }, [authToken, authLoading, user?.id]);

    useEffect(() => {
        if (authLoading || !authToken || !user?.id) return;
        setLoading(true);
        setError(null);
        getPetsData(setPets, setLoading, setPetsError, user.id);

    }, [authToken, authLoading, user?.id]);

    useEffect(() => {
        if (authLoading || !authToken || !user?.id) return;
        console.log("authLoading", authLoading);
        getPostsData(setPosts, setLoading, setPostsError, user.id);
    }, [authToken, authLoading, user?.id]);

    const handleContactClick = () => {

        const destinatario = userProfile?.email;
        const asunto = "Consulta desde Adoptamena";
        const mensaje = "Hola, tengo una consulta sobre...";


        const mailtoUrl = `mailto:${destinatario}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(mensaje)}`;


        window.location.href = mailtoUrl;
    };

    const handleWhatsAppClick = () => {
        const phoneNumber = userProfile?.phoneNumber;
        const url = `https://wa.me/${phoneNumber}`;
        window.open(url, '_blank');  // Esto abrirá WhatsApp en una nueva pestaña
    };

    const validateProfile = (profileData: UpdateUserProfile) => {
        const result = profileSchema.safeParse(profileData);
        if (!result.success) {
            const errors: Record<string, string> = {};
            result.error.errors.forEach(err => {
                errors[err.path[0]] = err.message;
            });
            setValidationErrors(errors);
            return false;
        }
        setValidationErrors({});
        return true;
    };


    if (authLoading || loading) {
        return <Loading />;
    }
    if (!user) return;
    return (
        <div className="w-full font-roboto">
            {/* Banner */}
            <Banners images={userProfile?.bannerImages || ['/logo.png']} />
            {isOpen &&
                <ConfirmationModal
                    isOpen={isOpen}
                    title="Confirmar cambios"
                    message="¿Estás seguro de que deseas guardar los cambios?"
                    textConfirm="Confirmar cambios"
                    confirmVariant="cta"
                    onClose={() => setIsOpen(false)}
                    onConfirm={handleConfirmSave}
                />}
            {/* User Info */}
            <Detail
                posts={posts} user={user}
                userProfile={isEditing ? tempUserProfile : userProfile}
                setUserProfile={setTempUserProfile}
                isDisable={!isEditing}
                validationErrors={validationErrors}
            />
            {/* Action Buttons */}
            <div className=" relative md:top-[-20rem]  lg:top-[-12rem] mr-16  flex justify-end gap-2 items-center ">
                <EditButton
                    size="lg"
                    isEditing={isEditing}
                    id='edit-button'
                    onClick={handleEditButtonClick}
                />
                {isEditing && (
                    <>
                        <Button variant="cta" size="lg" onClick={handleSaveButtonClick}>
                            Guardar
                        </Button>
                    </>
                )}
                {!isEditing && (
                    <>

                        <DropdownMenu.Root>
                            {/* Botón para desplegar el menú */}
                            <DropdownMenu.Trigger asChild>
                                <Button
                                    variant="cta"
                                    size="lg"
                                >
                                    Contactar
                                </Button>
                            </DropdownMenu.Trigger>

                            {/* Contenido del menú desplegable */}
                            <DropdownMenu.Portal>
                                <DropdownMenu.Content
                                    className="min-w-[125px] bg-white rounded-md p-2 shadow-md space-y-2"
                                    sideOffset={5}
                                >
                                    {/* Agrega las opciones del menú aquí */}
                                    <DropdownMenu.Item>
                                        <button onClick={handleContactClick} className={`flex items-center gap-x-2 w-full px-3 py-2 rounded-md 
                                        ${!userProfile?.email || userProfile?.email === "No Disponible" ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200 hover:text-gray-800'}`}
                                            disabled={!userProfile?.email || userProfile?.email === "No Disponible"} >
                                            <Mail size={16} className="text-gray-500 items-center" />
                                            <span className="font-medium text-sm text-gray-800">Correo: </span>
                                            <span className="font-medium text-sm text-gray-500">{userProfile?.email || "No Disponible"}</span>
                                        </button>
                                    </DropdownMenu.Item>

                                    <DropdownMenu.Item>
                                        <button onClick={handleWhatsAppClick} className={`flex items-center gap-x-2 w-full px-3 py-2 rounded-md 
                                        ${!userProfile?.phoneNumber || userProfile?.phoneNumber === "No Disponible" ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200 hover:text-gray-800'}`}
                                            disabled={!userProfile?.phoneNumber || userProfile?.phoneNumber === "No Disponible"}>
                                            <Phone size={16} className="text-gray-500 items-center" />
                                            <span className="font-medium text-sm text-gray-800">WhatsApp: </span>
                                            <span className="font-medium text-sm text-gray-500">{userProfile?.phoneNumber || "No Disponible"}</span>
                                        </button>
                                    </DropdownMenu.Item>
                                </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                        </DropdownMenu.Root>

                        <MenuButton size="lg" />
                    </>

                )}
            </div>
            {/* Pets Section */}
            <Section
                title="Mis Mascotas"
                itemType="pet"
                path={`/profile/my-pets/${user.id}`}
                items={pets}
                loading={loading}
                error={petsError}
                filterByType={false}
            />

            {/* Posts Section (Con filtrado) */}
            <Section
                title={`Publicaciones de ${user?.fullName.split(' ')[0]}`}
                itemType="post"
                postTypeName="adoption"
                path={`/profile/my-posts/${user.id}`}
                items={posts}
                loading={loading}
                error={postsError}
                filterByType={false}
            />
            {/* Footer */}
            <Footer />
        </div>
    );
}
