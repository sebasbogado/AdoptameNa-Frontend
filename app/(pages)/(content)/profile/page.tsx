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
import { MediaDTO, UpdateUserProfile, UserProfile } from '@/types/user-profile';
import { Post } from '@/types/post';
import { Pet } from '@/types/pet';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Mail, Phone, SplineIcon } from 'lucide-react';
import Loading from '@/app/loading';
import { Detail } from '@/components/profile/detail-form';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { profileEditSchema, profileSchema } from '@/validations/user-profile';
import { DropdownMenuButtons } from '@/components/profile/dropdown-buttons';
import PostLocationMap from '@/components/post/post-location-map';
import ImageHeader from '@/components/image-header';
import HeaderImage from '@/components/image-header';

const getUserProfileData = async (
    setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setErrors: React.Dispatch<React.SetStateAction<{ pets: boolean; posts: boolean; userProfile: boolean }>>,
    userId: string,
) => {
    try {
        // Cargar perfil de usuario
        const profile = await getUserProfile(userId);
        setUserProfile(profile);

    } catch (err) {
        console.error("Error al cargar el perfil:", err);
        setErrors(prev => ({ ...prev, userProfile: true }));
    } finally {
        setLoading(false);
    }
};

const getPostsData = async (
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setErrors: React.Dispatch<React.SetStateAction<{ pets: boolean; posts: boolean; userProfile: boolean }>>,
    userId: string,
) => {


    try {
        // Cargar posts del usuario
        const postParams = { user: userId }; // Usamos el ID del usuario actual
        const postData = await getPosts(postParams);
        setPosts(Array.isArray(postData) ? postData : []);
    } catch (err) {
        console.error("Error al cargar posts:", err);
        setErrors(prev => ({ ...prev, posts: true }));
    } finally {
        setLoading(false);
    }
};
const getPetsData = async (
    setPets: React.Dispatch<React.SetStateAction<Pet[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setErrors: React.Dispatch<React.SetStateAction<{ pets: boolean; posts: boolean; userProfile: boolean }>>,
    userId: string,
) => {


    try {
        const petData = await getPetsByUserId(userId);
        setPets(Array.isArray(petData) ? petData : []);
    } catch (err) {
        console.error("Error al cargar posts:", err);
        setErrors(prev => ({ ...prev, pets: true }));
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
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false)
    const [tempUserProfile, setTempUserProfile] = useState<UserProfile | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [isOpen, setIsOpen] = useState(false)
    const [errors, setErrors] = useState({
        pets: false,
        posts: false,
        userProfile: false
    });

    const [medias, setMedias] = useState<MediaDTO[]>([])

    const updateProfile = async (profileToUpdate: UpdateUserProfile) => {
        if (authLoading || !authToken || !user?.id) return;
        if (!validateProfile(profileToUpdate)) {
            setIsEditing(true)
            return
        }



        setProfileLoading(true);
        setErrors(prev => ({ ...prev, userProfile: false }));

        try {
            const updatedProfile = await updateUserProfile(user.id, profileToUpdate, authToken);
            setUserProfile(updatedProfile); // Actualizamos el estado después de recibir la respuesta
        } catch (err) {
            console.error("Error al actualizar el perfil:", err);
            setErrors(prev => ({ ...prev, userProfile: true }));

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

        getUserProfileData(
            setUserProfile,
            setProfileLoading,
            setErrors,
            user.id
        );
    }, [authToken, authLoading, user?.id]);

    useEffect(() => {
        if (authLoading || !authToken || !user?.id) return;
        setLoading(true);
        setErrors(prev => ({ ...prev, pets: false }));
        getPetsData(setPets, setLoading, setErrors, user.id);

    }, [authToken, authLoading, user?.id]);

    useEffect(() => {
        if (authLoading || !authToken || !user?.id) return;
        console.log("authLoading", authLoading);
        getPostsData(setPosts, setLoading, setErrors, user.id);
    }, [authToken, authLoading, user?.id]);

    const handleContactClick = () => {

        const destinatario = userProfile?.email;
        const asunto = "Consulta desde Adoptamena";
        const mensaje = "Hola, tengo una consulta sobre...";


        const mailtoUrl = `mailto:${destinatario}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(mensaje)}`;


        window.location.href = mailtoUrl;
    };


    const validateProfile = (profileData: UpdateUserProfile) => {
        const result = profileEditSchema.safeParse(profileData);
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

    useEffect(() => {
        userProfile && setMedias(userProfile.media ?? [])
    }, [userProfile?.media])


    if (authLoading || loading) {
        return <Loading />;
    }
    if (!user) return;
    return (
        <div className="w-full font-roboto">
            {/* Banner */}
            
            <HeaderImage 
                isEditEnabled={true} 
                userProfile={userProfile}
                medias={medias}
                setMedias={setMedias}
            />
            
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
            <div className="bg-white rounded-t-[60px] -mt-12 relative z-50 shadow-2xl shadow-gray-800">
                <div className="grid grid-cols-1 gap-4 p-6">

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
                            <MenuButton size="lg" />
               
                        )}
                    </div>
                    <div className='w-[40vw] mt-[-70px] '>
                    <PostLocationMap location={userProfile?.addressCoordinates ?? undefined} />

                    </div>

                    {/* Pets Section */}
                    <Section
                        title="Mis Mascotas"
                        itemType="pet"
                        path={`/profile/my-pets/${user.id}`}
                        items={pets}
                        loading={loading}
                        error={errors.pets}
                        filterByType={false}
                    />

                    {/* Posts Section (Con filtrado) */}
                    <Section
                        title={`Publicaciones de ${user?.fullName.split(' ')[0]}`}
                        itemType="post"
                        postTypeName="Adopcion"
                        path={`/profile/my-posts/${user.id}`}
                        items={posts}
                        loading={loading}
                        error={errors.posts}
                        filterByType={false}
                    />
                </div>
            </div>
        </div>
    );
}
