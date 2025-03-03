'use client';

import Button from '@/components/buttons/Button';
import EditButton from '@/components/buttons/EditButton';
import MenuButton from '@/components/buttons/MenuButton';
import Banners from '@components/banners';
import { useCallback, useEffect, useState } from 'react';
import Footer from '@/components/footer';
import Section from '@/components/Section';

import { Post } from '@/types/posts';
import { User } from '@/types/users';
import { Pet } from '@/types/pets';


export default function Page() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const getData = useCallback(async () => {
        try {
            const [postsResponse, petsResponse] = await Promise.all([
                fetch("https://apimocha.com/mariapi/posts"),
                fetch("https://apimocha.com/mariapi/pets")
            ]);

            if (!postsResponse.ok || !petsResponse.ok) {
                throw new Error("Error al obtener los datos");
            }

            const postsData: Post[] = await postsResponse.json();
            const petsData: Pet[] = await petsResponse.json();

            setPosts(postsData);
            setPets(petsData);
        } catch (error) {
            setError("No se pudieron cargar los datos");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getData();
    }, [getData]);

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
                <h1 className="text-5xl font-black">{user.name}</h1>
                <p className="text-foreground text-gray-700 mt-4 text-3xl">5 Publicaciones</p>
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
            <Section title={`Publicaciones de ${user.name.split(' ')[0]}`} postType='adoption' path='#'  items={posts} loading={loading} error={error} />
            {/* Footer */}
            <Footer />
        </div>
    );
}
