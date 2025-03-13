'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAuth } from '@/contexts/authContext';
import { getFavorites } from '@/utils/favorites-posts.http';
import Banners from '@/components/banners';
import PetCard from '@/components/petCard/pet-card';

export default function Page() {
    const { authToken, user, loading: authLoading } = useAuth();
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !authToken) {
            console.log("authLoading", authLoading);
            console.log("authToken", authToken);
            router.push("/auth/login");
        }

    }, [authToken, authLoading, router]);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                if (!authToken) return;
                const data = await getFavorites(authToken);
                console.log("data", data);
                setFavorites(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (authToken) {
            fetchFavorites();
        }
    }, [authToken]);

    if (loading) return <p>Cargando favoritos...</p>;
    if (error) return <p>Error: {error}</p>;


    const bannerImages = ["../banner1.png", "../banner2.png", "../banner3.png", "../banner4.png"]
    return (
        <div className='flex flex-col gap-3'>
            <Banners images={bannerImages} />
            <h1>Favoritos</h1>
            {favorites.length > 0 ? (
                favorites.map((fav) => (
                    <PetCard key={fav.post.id} post={fav.post} />
                ))
            ) : (
                <p className="text-center col-span-full">No tienes publicaciones favoritas.</p>
            )}
        </div>
    );
}