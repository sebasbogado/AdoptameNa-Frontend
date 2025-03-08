'use client';

import Button from '@/components/buttons/Button';
import EditButton from '@/components/buttons/EditButton';
import MenuButton from '@/components/buttons/MenuButton';
import Banners from '@components/banners';
import { useEffect, useState } from 'react';
import Footer from '@/components/footer';
import Section from '@/components/Section';

import { getPosts } from '@/utils/posts.http';
import { getPets } from '@/utils/pets.http';
import { getUserProfile } from '@/utils/userProfile.http';
import { UserProfile } from '@/types/userProfile';
import { Post } from '@/types/posts';
import { Pet } from '@/types/pets';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import { SplineIcon } from 'lucide-react';
import Loading from '@/app/loading';

export default function ProfilePage() {
    const { authToken, user, loading: authLoading } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [profileLoading, setProfileLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const router = useRouter();

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
                const postParams = { userId: user.id }; // Usamos el ID del usuario actual
                const postData = await getPosts(authToken, postParams);
                setPosts(Array.isArray(postData) ? postData : []);

                // Cargar mascotas del usuario
                const petData = await getPets(user.id, authToken); // Usamos el ID del usuario actual
                setPets(Array.isArray(petData) ? petData : []);
            } catch (err) {
                console.error("Error al cargar contenido:", err);
                setError("No se pudo cargar el contenido del perfil");
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

    return (
        <div className="w-full font-roboto">
            {/* Banner */}
            <Banners images={userProfile?.bannerImages || ['/profile/slider/img-slider-1.png']} />

            {/* User Info */}
            <div className="relative  p-8 left-1/3 transform -translate-x-1/2 bg-white shadow-lg rounded-xl p-5  font-roboto z-40 p-6 bg-white shadow-lg rounded-lg mt-[-50px]  w-[55vw]">
                <h1 className="text-5xl font-black">{user?.fullName}</h1>
                <p className="text-foreground text-gray-700 mt-4 text-3xl">{`${posts.length} Publicaciones`}</p>
                <p className="mt-2 text-foreground text-gray-700 mt-8 text-3xl">{userProfile?.description || 'Sin descripción'}</p>
            </div>
            {/* Action Buttons */}
            <div className=" relative md:top-[-20rem]  lg:top-[-12rem]  flex justify-end gap-2 items-center ">
                <EditButton size="lg" id='edit-button' />
                <Button variant="cta" size="lg">Contactar</Button>
                <MenuButton size="lg" />
            </div>
            {/* Pets Section */}
            <Section title="Mis Mascotas" postType='blog' path='#' items={pets} loading={loading} error={error} />


            {/* Posts Section */}
            <Section title={`Publicaciones de ${user?.fullName.split(' ')[0]}`} postType='adoption' path='#' items={posts} loading={loading} error={error} />
            {/* Footer */}
            <Footer />
        </div>
    );
}
