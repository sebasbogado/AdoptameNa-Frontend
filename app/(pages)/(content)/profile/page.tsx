'use client';

import Image from 'next/image';
import Button from '@/components/buttons/Button';
import EditButton from '@/components/buttons/EditButton';
import MenuButton from '@/components/buttons/MenuButton';
import { useAppContext } from '@/contexts/appContext';
import Banners from '@components/banners';
import { ChevronRightIcon } from "@heroicons/react/24/outline";
interface User {
    name: string;
    description: string;
}

interface Pet {
    name: string;
    image: string;
    description: string;
}

interface Post {
    title: string;
    image: string;
    description: string;
}

export default function Page() {
    const user: User = {
        name: 'Jorge Daniel Figueredo Amarilla',
        description:
            'Miembro de MymbaUni, en mis ratos libres me gusta rescatar gatitos y participar de campañas de recaudación de fondos.',
    };

    const images = ['profile/slider/img-slider-1.png'];

    const pets: Pet[] = [
        {
            name: 'Bigotes',
            image: '/profile/slider/img-slider-1.png',
            description: 'Bigotes fue rescatado de la plaza, lo encontramos en una caja cuando era un bebé.',
        },
        {
            name: 'Bigotes',
            image: '/profile/slider/img-slider-1.png',
            description: 'Bigotes fue rescatado de la plaza, lo encontramos en una caja cuando era un bebé.',
        },
        {
            name: 'Bigotes',
            image: '/profile/slider/img-slider-1.png',
            description: 'Bigotes fue rescatado de la plaza, lo encontramos en una caja cuando era un bebé.',
        },
      
    ];

    const posts: Post[] = [
        {
            title: 'Michi está perdido zona Avda. Irrazábal frente a la Gobernación',
            image: '/profile/slider/img-slider-1.png',
            description: 'Se perdió Michi, es un gato de casa frente a la Gobernación de Itapúa.',
        },
        {
            title: 'Michi está perdido zona Avda. Irrazábal frente a la Gobernación',
            image: '/profile/slider/img-slider-1.png',
            description: 'Se perdió Michi, es un gato de casa frente a la Gobernación de Itapúa.',
        },
        {
            title: 'Michi está perdido zona Avda. Irrazábal frente a la Gobernación',
            image: '/profile/slider/img-slider-1.png',
            description: 'Se perdió Michi, es un gato de casa frente a la Gobernación de Itapúa.',
        },
        {
            title: 'Michi está perdido zona Avda. Irrazábal frente a la Gobernación',
            image: '/profile/slider/img-slider-1.png',
            description: 'Se perdió Michi, es un gato de casa frente a la Gobernación de Itapúa.',
        },
        {
            title: 'Michi está perdido zona Avda. Irrazábal frente a la Gobernación',
            image: '/profile/slider/img-slider-1.png',
            description: 'Se perdió Michi, es un gato de casa frente a la Gobernación de Itapúa.',
        },
    ];

    return (
        <div className="w-full font-roboto">
            {/* Banner */}
            <Banners images={images} />

            {/* User Info */}
            <div className="relative  p-8 left-1/3 transform -translate-x-1/2 bg-white shadow-lg rounded-xl p-5  font-roboto z-40 p-6 bg-white shadow-lg rounded-lg mt-[-50px]  w-[55vw]">
                <h1 className="text-5xl font-bold">{user.name}</h1>
                <p className="text-foreground text-gray-700 mt-4 text-3xl">5 Publicaciones</p>
                <p className="mt-2 text-foreground text-gray-700 mt-8 text-3xl">{user.description}</p>
            </div>
            {/* Action Buttons */}
            <div className=" relative md:top-[-20rem]  lg:top-[-12rem]  flex justify-end gap-2 items-center ">
                <EditButton size="lg" />
                <Button variant="cta" size="lg">Contactar</Button>
                <MenuButton size="lg" />
            </div>
            {/* Pets Section */}
            <div className='container '>

            <div className="">
                <h2 className="text-4xl font-semibold">Mis mascotas </h2>
                <div className="grid grid-cols-5 gap-8 mt-2">
                    {pets.map((pet, index) => (
                        <div key={index} className="w-auto h-[30vh] rounded-lg shadow-md overflow-hidden">
                        <div>
                            
                        </div>
                        <Image
                            src={pet.image}
                            alt={pet.name}
                            width={500}
                            height={600}
                            className="w-full h-full object-cover rounded-lg"
                        />
                        <h3 className="font-bold mt-2">{pet.name}</h3>
                        <p className="text-gray-600 text-sm">{pet.description}</p>
                    </div>
                        
                    ))}
                </div>
            </div>

            {/* Posts Section */}
            <div className="mt-6">
                <div className='flex  items-center'>
                <h2 className="text-3xl font-semibold">Publicaciones de Jorge</h2>
                <ChevronRightIcon className="w-5 h-5" />

                </div>
                <div className="grid grid-cols-5 gap-4 mt-2">
                    {posts.map((post, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                            <Image src={post.image} alt={post.title} width={150} height={150} className="rounded-md" />
                            <h3 className="font-bold mt-2">{post.title}</h3>
                            <p className="text-gray-600 text-sm">{post.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            </div>
            

            {/* Footer */}
            <footer className="bg-purple-600 text-white p-6 mt-6">
                <div className="max-w-4xl mx-auto flex justify-between">
                    <div>
                        <h3 className="font-bold">Ayuda</h3>
                        <p>Preguntas Frecuentes</p>
                        <p>Centro de ayuda</p>
                    </div>
                    <div>
                        <h3 className="font-bold">Nosotros</h3>
                        <p>Quiénes somos</p>
                        <p>Misión, visión y valores</p>
                    </div>
                    <div>
                        <h3 className="font-bold">Suscríbete</h3>
                        <input
                            type="email"
                            placeholder="tucorreo@email.com"
                            className="p-2 text-black rounded-md"
                        />
                        <p className="mt-2">(021) 123 456</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
