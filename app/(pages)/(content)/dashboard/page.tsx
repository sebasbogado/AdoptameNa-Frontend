'use client'


import Banners from '@/components/banners'
import PetCard from '@/components/petCard/pet-card'
import Title from '@/components/title'
import Footer from '@/components/footer'
import { useEffect, useState } from 'react'
import { getPosts } from '@/utils/posts.http'
import { Post } from '@/types/post'


import { Section } from '@/components/section'
import Link from 'next/link'

type FetchContentDataParams = {
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
};


const fetchContentData = async ({ setPosts, setLoading, setError }: FetchContentDataParams) => {

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

            <Section
                title='En adopcion'
                path='adoption'
                postTypeName="adoption"
                items={posts}
                loading={loading}
                error={error}
                itemType='post'>
            </Section>


            {/* Sección de Desaparecidos */}
            <Section
                title='Extraviados'
                path='missing'
                postTypeName="missing"
                items={posts}
                loading={loading}
                error={error}
                filterByType={true}
                itemType='post'>

            </Section>

            {/* Sección de Voluntariado */}
            <Section
                title='Voluntariado'
                itemType='post' filterByType={true}
                path='volunteering'
                postTypeName="volunteering"
                items={posts}
                loading={loading}
                error={error}>
            </Section>


            {/* Sección de Blogs */}
            <Section
                title='Blog'
                path='blog'
                itemType='post'
                filterByType={true}
                postTypeName="blog"
                items={posts}
                loading={loading}
                error={error}>

            </Section>

            {/* Marketplace */}
            <Section
                title='Tienda'
                path='marketplace'
                itemType='post'
                filterByType={true}
                postTypeName="marketplace"
                items={posts}
                loading={loading}
                error={error}>

            </Section>
            <Link href="/add-post">
                <div className="fixed bottom-5 right-5">
                    <button className="group flex items-center gap-2 bg-[#FFAE34] text-white px-4 py-2 rounded-full shadow-lg hover:px-6 transition-all duration-500">
                        <span className="text-lg transition-all duration-500 group-hover:hidden">+</span>
                        <span className="hidden group-hover:inline transition-all duration-500">Crear publicación</span>
                    </button>
                </div>
            </Link>
            <Footer />
        </div>
    )
}
