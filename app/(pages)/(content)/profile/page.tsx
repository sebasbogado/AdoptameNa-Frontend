'use client';

import Button from '@/components/buttons/Button';
import EditButton from '@/components/buttons/EditButton';
import MenuButton from '@/components/buttons/MenuButton';
import Banners from '@components/banners';
import { useCallback, useEffect, useState } from 'react';
import Footer from '@/components/footer';
import Section from '@/components/Section';

import { User } from '@/types/users';
import { getPosts } from '@/utils/posts.http';
import { getPets } from '@/utils/pets.http';
import { getUser } from '@/utils/users.http';
import { getUserProfile } from '@/utils/userProfile.http';
import { UserProfile } from '@/types/userProfile';
import { Post } from '@/types/posts';
import { Pet } from '@/types/pets';




export default function Page() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<Post[]>([]);
    const [userData, setUserData] = useState<UserProfile | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            try {

                const token = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IlJPTEVfdXNlciIsInN1YiI6Im1hcmlhZ3JhY2llbGFlc3F1aXZlbGZlcm5hbmRlekBnbWFpbC5jb20iLCJpYXQiOjE3NDExNDg1NzgsImV4cCI6MTc0NDc0ODU3OH0.OhB5Q_e8tc8ywVZV4UBCDEqHeG6RqUvB45SU_MnQAGk';

                // Obtener Posts
                const postParams = { keyword: "7" };
                const postData = await getPosts(token, postParams);

                if (Array.isArray(postData)) {
                    setPosts(postData);
                } else {
                    console.error("La respuesta no contiene un array de posts:", postData);
                    setPosts([]);
                }
                const userId = "7";

                const userData = await getUserProfile(userId, token);
                if (userData) {
                    setUserData(userData);
                } else {
                    console.error("No se pudo obtener el usuario");
                    setUserData(null);
                }

                const petData = await getPets(userId, token);

                if (Array.isArray(petData)) {
                    setPets(petData);
                } else {
                    console.error("La respuesta no contiene un array de pets:", petData);
                    setPets([]);
                }

            } catch (error) {
                console.error("Error al obtener los posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    const user: User = {
        name: 'Jorge Daniel Figueredo Amarilla',
        description:
            'Miembro de MymbaUni, en mis ratos libres me gusta rescatar gatitos y participar de campañas de recaudación de fondos.',
    };
    const images = ['profile/slider/img-slider-1.png'];

    return (
        <div className="w-full font-roboto">
            {/* Banner */}
            <Banners images={images} />

            {/* User Info */}
            <div className="relative  p-8 left-1/3 transform -translate-x-1/2 bg-white shadow-lg rounded-xl p-5  font-roboto z-40 p-6 bg-white shadow-lg rounded-lg mt-[-50px]  w-[55vw]">
                <h1 className="text-5xl font-black">{userData?.fullName}</h1>
                <p className="text-foreground text-gray-700 mt-4 text-3xl">{`${posts.length} Publicaciones`}</p>
                <p className="mt-2 text-foreground text-gray-700 mt-8 text-3xl">{user.description}</p>
            </div>
            {/* Action Buttons */}
            <div className=" relative md:top-[-20rem]  lg:top-[-12rem]  flex justify-end gap-2 items-center ">
                <EditButton size="lg" />
                <Button variant="cta" size="lg">Contactar</Button>
                <MenuButton size="lg" />
            </div>
            {/* Pets Section */}
            <Section title="Mis Mascotas" postType='blog' path='#' items={pets} loading={loading} error={error} />


            {/* Posts Section */}
            <Section title={`Publicaciones de ${userData?.fullName.split(' ')[0]}`} postType='adoption' path='#' items={posts} loading={loading} error={error} />
            {/* Footer */}
            <Footer />
        </div>
    );
}
