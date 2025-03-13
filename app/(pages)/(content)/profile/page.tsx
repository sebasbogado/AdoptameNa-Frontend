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
import { getUserProfile } from '@/utils/user-profile-client';
import { UserProfile } from '@/types/user-profile';
import { Post } from '@/types/post';
import { Pet } from '@/types/pet';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import { SplineIcon } from 'lucide-react';
import Loading from '@/app/loading';
import { Detail } from '@/components/profile/detail-form';
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
        const fetchProfileData = async () => {
            if (authLoading || !authToken || !user?.id) return;

            setLoading(true);
            setError(null);

            try {
                // Cargar perfil de usuario
                const profile = await getUserProfile(user.id, authToken);
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

        fetchProfileData();
    }, [authToken, authLoading, user?.id]);

    useEffect(() => {
        const fetchContentData = async () => {
            if (authLoading || !authToken || !user?.id) return;
            console.log("authLoading", authLoading);

            try {
                // Cargar posts del usuario
                const postParams = { user: user.id }; // Usamos el ID del usuario actual
                const postData = await getPosts(postParams);
                setPosts(Array.isArray(postData) ? postData : []);
            } catch (err) {
                console.error("Error al cargar posts:", err);
                setPostsError("No se pudieron cargar las publicaciones."); // 👈 Manejo de error separado
            }
            try {
                // Cargar mascotas del usuario
                const petData = await getPets(user.id); // Usamos el ID del usuario actual
                setPets(Array.isArray(petData) ? petData : []);
            } catch (err) {
                console.error("Error al cargar contenido:", err);
                setPetsError("No se pudieron cargar las mascotas."); // 👈 Manejo de error separado

            } finally {
                setLoading(false);
            }
        };
        fetchContentData();
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

    // Lógica para guardar los cambios
    const handleSaveButtonClick = () => {
        setUserProfile(modifiedProfileData); // Guardar cambios en el perfil
        setIsEditing(false); // Salir del modo de edición
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
                path='#'
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
                path='#'
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
