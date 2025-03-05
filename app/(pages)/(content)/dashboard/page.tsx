'use client'

import { Button } from '@material-tailwind/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import Banners from '@components/banners'
import { useAppContext } from '@/contexts/appContext'
import useCustomEffect from '@/hooks/useCustomEffect'
import postsServices from '@services/postsServices'
import PetCard from '@components/petCard/petCard'
import PostsTags from '@/components/petCard/tags'
import Title from '@/components/title'
import Footer from '@/components/footer'

type Post = {
    postId: string;
    postType: string;
    title: string;
    author?: string;
    content: string;
    date: string;
    imageUrl: string;
    tags: {
        race?: string;
        vaccinated?: boolean;
        sterilyzed?: boolean;
        age?: string;
        female?: boolean;
        male?: boolean;
        distance?: string;
    };
};

export default function Page() {
    const router = useRouter()

    const [posts, setPosts] = useState<Post[]>([])

    const { loading, fetch } = useCustomEffect(async () => {
        let apiResponse = await postsServices.getAll();
        console.log("Api Response: ", apiResponse)
        return apiResponse;
    }, {
        whereOptions: undefined,
        after: (res: Post[] | null) => {
            setPosts(res ?? [])
        }
    }, [])

    return (
        <div className='flex flex-col gap-5'>
            <Banners />
            <Title postType='adoption' path='adoption'></Title>
            <div className='flex h-fit w-full justify-evenly mb-9 overflow-x-auto flex-wrap gap-y-4 '>
                    {posts.map((post) =>
                        <PetCard key={post.postId} post={post} />
                    )}              
            </div>

            <Title postType='missing' path='missing'></Title>

            <Title postType='blog' path='blog'></Title>

            <Title title='Nueva seccion' path='blog'></Title>
            

            <Footer></Footer>
        </div>
    )
}


