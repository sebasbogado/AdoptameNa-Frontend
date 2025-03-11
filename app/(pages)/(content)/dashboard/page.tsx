'use client'

import Banners from '@components/banners'

import Footer from '@/components/footer'
import { useEffect, useState } from 'react'
import { getPosts } from '@/utils/posts.http'
import { Post } from '@/types/post'

import Section from '@/components/section'

type FetchContentDataParams = {
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
};


const fetchContentData = async ({setPosts, setLoading, setError}: FetchContentDataParams) => { 

    try {
        const postData = await getPosts({});
        setPosts(Array.isArray(postData) ? postData : []);
    } catch (err) {
        console.error("Error al cargar contenido:", err);
        setError("No se pudo cargar el contenido del perfil");
    } finally {
        setLoading(false);
    }
};


export default function Page() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        fetchContentData({ setPosts, setLoading, setError });
    }, []);


  

    const bannerImages = ["banner1.png", "banner2.png", "banner3.png", "banner4.png"]
    return (
        <div className='flex flex-col gap-3'>
            <Banners images={bannerImages} />
            {/* Sección de Adopción 
                Los postTypeId seran numero magicos mientras se cambia en el back
            */}
            <Section title = 'En adopcion'  path='adoption' postType="adoption" items={posts} loading = {loading} error = {error}></Section>
               

            {/* Sección de Desaparecidos */}
            <Section title = 'Extraviados'  path='missing' postType="missing" items={posts} loading = {loading} error = {error}></Section>

            
            {/* Sección de Voluntariado */}
            <Section title = 'Voluntariado'  path='volunteering' postType="volunteering" items={posts} loading = {loading} error = {error}></Section>


            {/* Sección de Blogs */}
            <Section title = 'Blog'  path='blog' postType="blog" items={posts} loading = {loading} error = {error}></Section>

            {/* Marketplace */}
            <Section title = 'Tienda' path='marketplace' postType="marketplace" items={posts} loading = {loading} error = {error}></Section>
            <Footer />
        </div>
    )
}
