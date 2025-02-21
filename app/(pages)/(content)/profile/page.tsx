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
        name: 'John Doe',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    }  
    return (
        <div className="relative w-full">
        {/* Banner */}
        <Banners />

        {/* User Details */}
        <div className="absolute top-[40vh]  left-1/3 transform -translate-x-1/2 bg-white shadow-lg rounded-xl p-5 w-[50vw]">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-foreground">5 Publicaciones</p>
            <p className="mt-2 text-foreground text-lg">{user.description}</p>
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