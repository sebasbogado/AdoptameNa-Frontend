'use client'

import { Button } from '@material-tailwind/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import Banners from '@components/banners'
import { useAppContext } from '@/contexts/appContext'
import useCustomEffect from '@/hooks/useCustomEffect'
import petsServices from '@services/petsServices'
import PetCard from '@components/petCard/petCard'

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
    const { cartItems } = useAppContext()
    const [pets, setPets] = useState<Pet[]>([])

    const { loading, fetch } = useCustomEffect(async () => {
        return petsServices.getAll()
    }, {
        whereOptions: {},
        after: (res: Pet[] | null) => {
            setPets(res ?? [])
        }
    }, [])

    return (
        <div className='flex flex-col gap-5'>
            <h1>Dashboard {cartItems}</h1>
            <Banners />
            <PetCard></PetCard>
            <Button onClick={() => {
                router.push("dashboard/5")
            }}>
                Ver mascotas
            </Button>
            <Button onClick={fetch}>
                Recargar datos
            </Button>
            {loading && <p>Cargando...</p>}

            <div className='grid grid-cols-[repeat(auto-fill,_minmax(230px,_1fr))] gap-4'>
                {pets.map((pet) =>
                    <PetCard key={pet.id} pet={pet} />
                )}
            </div>
        </div>
    )
}


