'use client'

import { Button } from '@material-tailwind/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from "@/contexts/AuthContext";
import Banners from '@components/banners'
import { useAppContext } from '@/contexts/appContext'
import useCustomEffect from '@/hooks/useCustomEffect'
import postsServices from '@services/postsServices'
import PetCard from '@components/petCard/petCard'
import PostsTags from '@/components/petCard/tags'
import Title from '@/components/title'
import Footer from '@/components/footer'
import getPost from "@utils/post-client";

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

    const posts = getPost();
    //const [posts, setPosts] = useState<Post[]>([])

    const bannerImages = ["banner1.png", "banner2.png", "banner3.png", "banner4.png"]


    return (
        <div className='flex flex-col gap-3'>
            <Banners images={bannerImages} />
            {/* Sección de Adopción */}
            <Title postType='adoption' path='adoption' />
            <div className='flex h-fit w-full justify-evenly  overflow-x-auto flex-wrap pb-8'>
                {posts
                    .filter((post) => post.postType === 'adoption')
                    .slice(0, 5)
                    .map((post) => <PetCard key={post.postId} post={post} />)}
            </div>

            {/* Sección de Desaparecidos */}
            <Title postType='missing' path='missing' />
            <div className='flex h-fit w-full justify-evenly  overflow-x-auto flex-wrap pb-8'>
                {posts
                    .filter((post) => post.postType === 'missing')
                    .slice(0, 5)
                    .map((post) => <PetCard key={post.postId} post={post} />)}
            </div>


            {/* Sección de Voluntariado */}
            <Title postType='volunteering' path='voluntariado' />
            <div className='flex h-fit w-full justify-evenly  overflow-x-auto flex-wrap pb-8'>
                {posts
                    .filter((post) => post.postType === 'volunteering')
                    .slice(0, 5)
                    .map((post) => <PetCard key={post.postId} post={post} />)}
            </div>

            {/* Sección de Blogs */}
            <Title postType='blog' path='blog' />
            <div className='flex h-fit w-full justify-evenly  overflow-x-auto flex-wrap pb-8'>
                {posts
                    .filter((post) => post.postType === 'blog')
                    .slice(0, 5)
                    .map((post) => <PetCard key={post.postId} post={post} />)}
            </div>

            {/* Marketplace */}
            <Title title='Tienda' path='marketplace' postType='marketplace' />
            <div className='flex h-fit w-full justify-evenly  overflow-x-auto flex-wrap pb-8'>
                {posts
                    .filter((post) => post.postType === 'marketplace')
                    .slice(0, 5)
                    .map((post) => <PetCard key={post.postId} post={post} />)}
            </div>


            <Footer />
        </div>
    )
}


