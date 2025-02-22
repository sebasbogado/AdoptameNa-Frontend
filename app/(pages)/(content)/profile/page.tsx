'use client'

import Button from '@/components/buttons/Button';
import EditButton from '@/components/buttons/EditButton';
import MenuButton from '@/components/buttons/MenuButton';
import { useAppContext } from '@/contexts/appContext'
import Banners from '@components/banners'



interface User{
    name: String;
    description: String;
}

  
export default function Page() {
    const user = {
        name: 'Jorge Daniel Figueredo Amarilla',
        description: 'Miembro de MymbaUni, en mis ratos libres me gusta rescatar gatitos y participar de campañas de recaudación de fondos.',
    }  
    const images = [
        "profile/slider/img-slider-1.png",
        

      ];
    return (
        <div className="relative w-full">
        {/* Banner */}
        <Banners images={images} />

        {/* User Details */}
        <div className="absolute top-[60vh] p-8 left-1/3 transform -translate-x-1/2 bg-white shadow-lg rounded-xl p-5 w-[50vw]">
            <h1 className="text-4xl font-bold">{user.name}</h1>
            <p className="text-foreground text-2xl">5 Publicaciones</p>
            <p className="mt-2 text-foreground text-2xl">{user.description}</p>
        </div>

        {/* Top button section */}
        <div className=" bottom-5 right-10 flex justify-end gap-2">
            <EditButton ></EditButton>
             <Button variant='cta'>Contactar</Button>
             <MenuButton></MenuButton>
        </div>
    </div>
    )
}