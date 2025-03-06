'use client'

import { Button } from '@material-tailwind/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Banners from '@components/banners'
import { useAppContext } from '@/contexts/appContext'
import useCustomEffect from '@/hooks/useCustomEffect'
import petsServices from '@services/petsServices'
import PetCard from '@components/petCard/petCard'
import PostsTags from '@/components/petCard/tags'
import Title from '@/components/title'
import Footer from '@/components/footer'

// Definimos la interfaz para una mascota
interface Pet {
    id: string;
    name: string;
    age?: number;
    breed?: string;
    image?: string;
}

export default function Page() {
    const router = useRouter()
    const postDummyData = {
        postId: "1",
        postType: "adoption",
        title: "Arsenio está en adopción",
        author: "",
        content: "Encontramos este gatito en un basurero, necesita un hogar amoroso y responsable",
        date: "18/02/2025",
        imageUrl: "",
        tags: {
            race: "mestizo",
            age: "2 años",
            gender: "Hembra"
        }
    };

    return (
        <div className='flex flex-col gap-5'>
            <Banners />
            <Title postType='adoption' path='adoption'></Title>
            <div className='flex h-fit w-full justify-evenly mb-9 overflow-x-clip '>
            </div>

            <Title postType='missing' path='missing'></Title>

            <Title postType='blog' path='blog'></Title>

            <Title title='Nueva seccion' path='blog'></Title>


            <Footer></Footer>
        </div>
    )
}


