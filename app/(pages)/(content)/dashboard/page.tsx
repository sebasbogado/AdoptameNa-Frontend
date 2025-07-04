'use client'

import { useEffect, useState } from 'react'
import { getPosts } from '@/utils/posts.http'
import { Post } from '@/types/post'
import { Section } from '@/components/section'
import { Pet } from '@/types/pet'
import { getPets, getPetsDashboard } from '@/utils/pets.http'
import { PET_STATUS, POST_TYPEID } from '@/types/constants'
import { getProducts } from '@/utils/products.http'
import { Product } from '@/types/product'
import FloatingActionButton from '@/components/buttons/create-publication-buttons'
import { getCrowdfundings } from '@/utils/crowfunding.http'
import { CrowdfundingStatus } from '@/types/crowdfunding'
import { Crowdfunding } from '@/types/crowfunding-type'

type FetchContentDataParams = {
    setAdoptionPets: React.Dispatch<React.SetStateAction<Pet[]>>;
    setMissingPets: React.Dispatch<React.SetStateAction<Pet[]>>;
    setVolunteeringPosts: React.Dispatch<React.SetStateAction<Post[]>>;
    setBlogPosts: React.Dispatch<React.SetStateAction<Post[]>>;
    setMarketplacePosts: React.Dispatch<React.SetStateAction<Product[]>>;
    setCrowdfundingPosts: React.Dispatch<React.SetStateAction<Crowdfunding[]>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setError: React.Dispatch<React.SetStateAction<boolean>>;
};

const fetchContentData = async ({ setAdoptionPets, setMissingPets, setVolunteeringPosts, setBlogPosts, setMarketplacePosts, setCrowdfundingPosts, setLoading, setError }: FetchContentDataParams) => {
    const pageSize = 5;
    const pageNumber = 0;
    const sort = "id,desc";

    const queryParams = {
        page: pageNumber,
        size: pageSize,
        sort: sort,
    };

    try {
        const petAdoptionData = await getPets({ ...queryParams, petStatusId: [PET_STATUS.ADOPTION] });
        const petMissingData = await getPetsDashboard({ ...queryParams, petStatusId: [PET_STATUS.MISSING, PET_STATUS.FOUND] });
        const postVolunteeringData = await getPosts({ ...queryParams, postTypeId: POST_TYPEID.VOLUNTEERING });
        const postBlogData = await getPosts({ ...queryParams, postTypeId: POST_TYPEID.BLOG });
        const postMarketplaceData = await getProducts(queryParams);
        const postCrowdfungingData = await getCrowdfundings({...queryParams, status: CrowdfundingStatus.ACTIVE});

        setAdoptionPets(Array.isArray(petAdoptionData.data) ? petAdoptionData.data : []);
        setMissingPets(Array.isArray(petMissingData.data) ? petMissingData.data : []);
        setVolunteeringPosts(Array.isArray(postVolunteeringData.data) ? postVolunteeringData.data : []);
        setBlogPosts(Array.isArray(postBlogData.data) ? postBlogData.data : []);
        setMarketplacePosts(Array.isArray(postMarketplaceData.data) ? postMarketplaceData.data : []);
        setCrowdfundingPosts(Array.isArray(postCrowdfungingData.data) ? postCrowdfungingData.data : []);
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
    const [marketplacePosts, setMarketplacePosts] = useState<Product[]>([]);
    const [crowdfundingPosts, setCrowdfundingPosts] = useState<Crowdfunding[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    useEffect(() => {
        fetchContentData({ setVolunteeringPosts, setBlogPosts, setMarketplacePosts, setAdoptionPets, setMissingPets, setCrowdfundingPosts, setLoading, setError });
    }, []);

    return (
        <div className='flex flex-col mt-5'>
            <Section
                title='En adopción'
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
                itemType='blog'
                postTypeName="Blog"
                items={blogPosts}
                loading={loading}
                error={error}>
            </Section>

            {/* Marketplace */}
            <Section
                title='Tienda'
                path='marketplace'
                itemType='product'
                postTypeName="Marketplace"
                items={marketplacePosts}
                loading={loading}
                error={error}>
            </Section>

            {/* Crowdfunding */}
            <Section
                title='Colectas'
                path='crowdfunding'
                itemType='crowdfunding'
                postTypeName="Colectas"
                items={crowdfundingPosts}
                loading={loading}
                error={error}>
            </Section>

            <FloatingActionButton />
        </div>
    )
}