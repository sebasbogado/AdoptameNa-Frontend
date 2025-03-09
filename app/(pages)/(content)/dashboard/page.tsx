'use client'

import Banners from '@components/banners'
import PetCard from '@/components/petCard/pet-card'
import Title from '@/components/title'
import Footer from '@/components/footer'
import getPost from "@utils/post-client";
import { useEffect, useState } from 'react'
import { Pet } from '@/types/pet'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/authContext'
import { getPosts } from '@/utils/posts.http'
import { Post } from '@/types/post'
import { getPostType } from '@/utils/post-type-client'
import Section from '@/components/section'



export default function Page() {
    const { authToken, user, loading: authLoading } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [profileLoading, setProfileLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [postType, setPostType] = useState<string>('');
    useEffect(() => {
        if (!authLoading && !authToken) {
            console.log("authLoading", authLoading);
            console.log("authToken", authToken);
            router.push("/auth/login");
        }

    }, [authToken, authLoading, router]);
    
     useEffect(() => {
        const fetchContentData = async () => {
            if (authLoading || !authToken || !user?.id) return;
            console.log("authLoading", authLoading);

            try {
                // Cargar posts del usuario
                const postParams = { user: user.id }; // Usamos el ID del usuario actual
                const postData = await getPosts(authToken, postParams);
                setPosts(Array.isArray(postData) ? postData : []);
            } catch (err) {
                console.error("Error al cargar contenido:", err);
                setError("No se pudo cargar el contenido del perfil");

            } finally {
                setLoading(false);
            }
        };
        fetchContentData();
    }, [authToken, authLoading, user?.id]);

  

    const bannerImages = ["banner1.png", "banner2.png", "banner3.png", "banner4.png"]
    return (
        <div className='flex flex-col gap-3'>
            <Banners images={bannerImages} />
            {/* Sección de Adopción 
                Los postTypeId seran numero magicos mientras se cambia en el back
            */}
            <Section title = 'En adopcion' postTypeId={3} path='adoption' postType="adoption" items={posts} loading = {loading} error = {error}></Section>
               

            {/* Sección de Desaparecidos */}
            <Section title = 'Extraviados' postTypeId={1} path='missing' postType="missing" items={posts} loading = {loading} error = {error}></Section>

            
            {/* Sección de Voluntariado */}
            <Section title = 'Voluntariado' postTypeId={2} path='volunteering' postType="volunteering" items={posts} loading = {loading} error = {error}></Section>


            {/* Sección de Blogs */}
            <Section title = 'Blog' postTypeId={3} path='blog' postType="blog" items={posts} loading = {loading} error = {error}></Section>

            {/* Marketplace */}
            <Section title = 'Tienda' postTypeId={2} path='marketplace' postType="marketplace" items={posts} loading = {loading} error = {error}></Section>
            <Footer />
        </div>
    )
}
