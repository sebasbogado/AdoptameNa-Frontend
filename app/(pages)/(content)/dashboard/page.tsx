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
import { PET_STATUS, POST_TYPEID } from '@/types/constants'
import page from '../administration/settings/page'
import { set } from 'zod'

type FetchContentDataParams = {
    setAdoptionPets: React.Dispatch<React.SetStateAction<Pet[]>>;
    setMissingPets: React.Dispatch<React.SetStateAction<Pet[]>>;
    setVolunteeringPosts: React.Dispatch<React.SetStateAction<Post[]>>;
    setBlogPosts: React.Dispatch<React.SetStateAction<Post[]>>;
    setMarketplacePosts: React.Dispatch<React.SetStateAction<Post[]>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setError: React.Dispatch<React.SetStateAction<boolean>>;
};


const fetchContentData = async ({ setAdoptionPets, setMissingPets, setVolunteeringPosts, setBlogPosts, setMarketplacePosts, setLoading, setError }: FetchContentDataParams) => {
    const pageSize = 5;
    const pageNumber = 0;
    const sort = "id,desc";
    try {
        const petAdoptionData = await getPets({page: pageNumber, size: pageSize, sort: sort, petStatusId: PET_STATUS.ADOPTION});
        /*
            Modificar luego para esta url: /api/pets?page=0&size=5&petStatusId=1&petStatusId=2&sort=id,desc
        */
        const petMissingData = await getPets({page: pageNumber, size: pageSize, sort: sort, petStatusId: PET_STATUS.MISSING});
        const petFoundData = await getPets({page: pageNumber, size: pageSize, sort: sort, petStatusId: PET_STATUS.FOUND});
        const petData = [...petMissingData.data, ...petFoundData.data]
        const postVolunteeringData = await getPosts({ page: pageNumber, size: pageSize, sort: sort, postTypeId: POST_TYPEID.VOLUNTEERING });
        const postBlogData = await getPosts({ page: pageNumber, size: pageSize, sort: sort, postTypeId: POST_TYPEID.BLOG });
        const postMarketplaceData = await getPosts({ page: pageNumber, size: pageSize, sort: sort, postTypeId: POST_TYPEID.MARKETPLACE });

        setAdoptionPets(Array.isArray(petAdoptionData.data) ? petAdoptionData.data : []);
        setMissingPets(Array.isArray(petData) ? petData : []);
        setVolunteeringPosts(Array.isArray(postVolunteeringData.data) ? postVolunteeringData.data : []);
        setBlogPosts(Array.isArray(postBlogData.data) ? postBlogData.data : []);
        setMarketplacePosts(Array.isArray(postMarketplaceData.data) ? postMarketplaceData.data : []);
    } catch (err) {
        console.error("Error al cargar contenido:", err);
        setError(true);
    } finally {
        setLoading(false);
    }
};

export default function Page() {
    const [adoptionPets, setAdoptionPets] = useState<Pet[]>([]);
    const [missingPets, setMissingPets] = useState<Pet[]>([]);
    const [volunteeringPosts, setVolunteeringPosts] = useState<Post[]>([]);
    const [blogPosts, setBlogPosts] = useState<Post[]>([]);
    const [marketplacePosts, setMarketplacePosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    useEffect(() => {
        fetchContentData({ setVolunteeringPosts, setBlogPosts, setMarketplacePosts, setAdoptionPets, setMissingPets, setLoading, setError });
    }, []);

    const bannerImages = ["banner1.png", "banner2.png", "banner3.png", "banner4.png"]
    return (
        <div className='flex flex-col gap-3'>
            <Banners images={bannerImages} />

            <Section
                title='En adopcion'
                path='adoption'
                postTypeName="Adopcion"
                items={adoptionPets}
                loading={loading}
                error={error}
                itemType='pet'>
            </Section>


            {/* Sección de Desaparecidos */}
            <Section
                title='Extraviados'
                path='missing'
                postTypeName="Extraviados"
                items={missingPets}
                loading={loading}
                error={error}
                itemType='pet'>
            </Section>

            {/* Sección de Voluntariado */}
            <Section
                title='Voluntariado'
                itemType='post'
                path='volunteering'
                postTypeName="Voluntariado"
                items={volunteeringPosts}
                loading={loading}
                error={error}>
            </Section>


            {/* Sección de Blogs */}
            <Section
                title='Blog'
                path='blog'
                itemType='post'
                postTypeName="Blog"
                items={blogPosts}
                loading={loading}
                error={error}>
            </Section>

            {/* Marketplace */}
            <Section
                title='Tienda'
                path='marketplace'
                itemType='post'
                postTypeName="Marketplace"
                items={marketplacePosts}
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