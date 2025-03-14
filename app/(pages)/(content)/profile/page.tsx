'use client';

import Button from '@/components/buttons/button';
import EditButton from '@/components/buttons/edit-button';
import MenuButton from '@/components/buttons/menu-button';
import Banners from '@/components/banners';
import { useEffect, useState } from 'react';
import Footer from '@/components/footer';
import { Section } from '@/components/section';

import { getPosts } from '@/utils/posts.http';
import { getPets } from '@/utils/pets.http';
import { getUserProfile, updateUserProfile } from '@/utils/user-profile-client';
import { UpdateUserProfile, UserProfile } from '@/types/user-profile';
import { Post } from '@/types/post';
import { Pet } from '@/types/pet';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import { SplineIcon } from 'lucide-react';
import Loading from '@/app/loading';
import { Detail } from '@/components/profile/detail-form';
const getUserProfileData = async (

    setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>,
    setInitialProfileData: React.Dispatch<React.SetStateAction<UserProfile | null>>,
    setModifiedProfileData: React.Dispatch<React.SetStateAction<UserProfile | null>>,

    setProfileLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
    userId: string,
) => {
          
    try {
        // Cargar perfil de usuario
        const profile = await getUserProfile(userId);
        setUserProfile(profile);
        setInitialProfileData(profile); // Guardar datos iniciales
        setModifiedProfileData(profile);
    } catch (err) {
        console.error("Error al cargar el perfil:", err);
        setError("No se pudo cargar la información del perfil");
    } finally {
        setProfileLoading(false);
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
        setPostsError("No se pudieron cargar las publicaciones."); // 👈 Manejo de error separado
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
        // Cargar posts del usuario
        const petData = await getPets(userId);
        setPets(Array.isArray(petData) ? petData : []);
    } catch (err) {
        console.error("Error al cargar posts:", err);
        setPetsError("No se pudieron cargar las publicaciones."); // 👈 Manejo de error separado
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

    const [initialProfileData, setInitialProfileData] = useState<UserProfile | null>(null);
    const [modifiedProfileData, setModifiedProfileData] = useState<UserProfile | null>(null);

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
            setInitialProfileData,  // ✅ Ahora está en el lugar correcto
            setModifiedProfileData, // ✅ También corregido
            setProfileLoading, 
            setError, 
            user.id
        );    }, [authToken, authLoading, user?.id]);

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

    if (authLoading) {
        return Loading();
    }

    if (!user) return;
    const handleEditButtonClick = () => {
        setIsEditing(!isEditing);
        if (isEditing) {
            // Si estamos saliendo del modo de edición, restaurar los datos sin guardar
            setModifiedProfileData(initialProfileData);

        }
    };
    const updateProfile = async () => {
        if (authLoading || !authToken || !user?.id) return;
    
        const { id, ...profileWithoutId } = modifiedProfileData || {};
    
        const profileToUpdate: UpdateUserProfile = {
            ...profileWithoutId,
            organizationName: modifiedProfileData?.organizationName ?? "",
            fullName: modifiedProfileData?.fullName ?? "",
            address: modifiedProfileData?.address ?? null,
            description: modifiedProfileData?.description ?? "",
            gender: modifiedProfileData?.gender ?? null,
            birthdate: modifiedProfileData?.birthdate ?? null,
            document: modifiedProfileData?.document ?? null,
            phoneNumber: modifiedProfileData?.phoneNumber ?? null,
            earnedPoints: modifiedProfileData?.earnedPoints ?? 0,
            addressCoordinates: modifiedProfileData?.addressCoordinates ?? null,
            bannerImages: modifiedProfileData?.bannerImages ?? [],
        };
    
        setProfileLoading(true); // Solo afecta el perfil
        setError(null);
    
        try {
            const updatedProfile = await updateUserProfile(user.id, profileToUpdate, authToken);
            setUserProfile(updatedProfile);
            setInitialProfileData(updatedProfile);
            setModifiedProfileData(updatedProfile);
        } catch (err) {
            console.error("Error al actualizar el perfil:", err);
            setError("No se pudo actualizar la información del perfil");
        } finally {
            setProfileLoading(false); // Asegurar que el perfil deja de estar en carga
        }
    };

    // Lógica para guardar los cambios
    const handleSaveButtonClick = () => {
        setIsEditing(false); // Salir del modo de edición
        updateProfile()
    };
    return (
        <div className="w-full font-roboto">
            {/* Banner */}
            <Banners images={userProfile?.bannerImages || ['/profile/slider/img-slider-1.png']} />

            {/* User Info */}
            <Detail
                user={user}
                posts={posts}
                userProfile={modifiedProfileData}
                setUserProfile={setModifiedProfileData} 
                isDisable={!isEditing}
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
                    <Button variant="cta" size="lg" onClick={handleSaveButtonClick}>
                        Guardar
                    </Button>
                )}   
                {!isEditing && (
                    <>
                    <Button variant="cta" size="lg">Contactar</Button>
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
                filterByType={false} //  No se filtran tipos de mascota
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
