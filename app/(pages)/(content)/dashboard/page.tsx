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
import { Pet } from '@/types/pet'
import { getPets } from '@/utils/pets.http'
import { PET_STATUS } from '@/types/constants'

type FetchContentDataParams = {
    setPets: React.Dispatch<React.SetStateAction<Pet[]>>;
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setError: React.Dispatch<React.SetStateAction<boolean>>;
};


const fetchContentData = async ({ setPets, setPosts, setLoading, setError }: FetchContentDataParams) => {

    try {
        const queryParam = {
            size: 50,
        }
        const postData = await getPosts(queryParam);
        const petData = await getPets(queryParam);
        setPets(Array.isArray(petData) ? petData.reverse() : []);
        setPosts(Array.isArray(postData) ? postData.reverse() : []);
    } catch (err) {
        console.error("Error al cargar contenido:", err);
        setError(true);
    } finally {
        setLoading(false);
    }
};

export default function Page() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    useEffect(() => {
        fetchContentData({ setPets, setPosts, setLoading, setError });
    }, []);




    const bannerImages = ["banner1.png", "banner2.png", "banner3.png", "banner4.png"]
    return (
        <div className='flex flex-col gap-3'>
            <Banners images={bannerImages} />

            <Section
                title='En adopcion'
                path='adoption'
                postTypeName="Adopcion"
                petStatusId={PET_STATUS.ADOPTION}
                items={pets}
                loading={loading}
                error={error}
                itemType='pet'>
            </Section>


            {/* Sección de Desaparecidos */}
            <Section
                title='Extraviados'
                path='missing'
                postTypeName="Extraviados"
                petStatusId={PET_STATUS.MISSING}
                items={pets}
                loading={loading}
                error={error}
                filterByType={true}
                itemType='pet'>
            </Section>

            {/* Sección de Voluntariado */}
            <Section
                title='Voluntariado'
                itemType='post' filterByType={true}
                path='volunteering'
                postTypeName="Voluntariado"
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
                postTypeName="Blog"
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
                postTypeName="Marketplace"
                items={posts}
                loading={loading}
                error={error}>

            </Section>
            <Link href="/add-post">
                <div className="fixed bottom-5 right-5">
                    <button className="group flex items-center gap-2 bg-[#FFAE34] text-white px-4 py-2 rounded-full shadow-lg hover:px-6 transition-all duration-500">
                        <span className="text-lg transition-all duration-500 group-hover:hidden">+</span>
                        <span className="hidden group-hover:inline transition-all duration-500">+ Crear publicación</span>
                    </button>
                </div>
            </Link>
        </div>
    )
}