'use client';


import Banners from '@/components/banners';
import { useEffect, useState } from 'react';

import { Pet } from '@/types/pet';
import { useParams, useRouter } from 'next/navigation';
import Loading from '@/app/loading';
import PetCard from '@/components/petCard/pet-card';
import LabeledSelect from '@/components/labeled-selected';
import { getPetsByUserId } from '@/utils/pets.http';
import { error } from 'console';
import Pagination from '@/components/pagination';
import { usePagination } from '@/hooks/use-pagination';


export default function MyPostsPage() {
    const ciudades = ["Encarnación", "Asunción", "Luque", "Fernando Zona Sur"];
    const mascotas = ["Todos", "Conejo", "Perro", "Gato"];
    const edades = ["0-1 años", "1-3 años", "3-6 años", "6+ años"];

    const {id} = useParams();

    const [selectedCiudad, setSelectedCiudad] = useState<string | null>(null);
    const [selectedMascota, setSelectedMascota] = useState<string | null>(null);
    const [selectedEdad, setSelectedEdad] = useState<string | null>(null);

    const pageSize = 3;
    const {
        data: pets,
        loading,
        error,
        currentPage,
        totalPages,
        handlePageChange,
    } = usePagination<Pet>({
        fetchFunction: (page, size) => getPetsByUserId(id as string, page, size),
        initialPage: 1,
        initialPageSize: pageSize,
    });


    if (loading) {
        return Loading();
    }
    const bannerImages = ["/banner1.png", "/banner2.png", "/banner3.png", "/banner4.png"]
    if(loading) return <Loading />

    return (
        <div className='flex flex-col gap-5'>
            <Banners images={bannerImages} />

            <div className="w-full max-w-4xl mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* Select Ciudad */}
                    <LabeledSelect
                        label="Ciudad"
                        options={ciudades}
                        selected={selectedCiudad}
                        setSelected={setSelectedCiudad}
                    />


                    {/* Select Mascota */}
                    <LabeledSelect
                        label="Mascota"
                        options={mascotas}
                        selected={selectedMascota}
                        setSelected={setSelectedMascota}
                    />

                    {/* Select Edad */}
                    <LabeledSelect
                        label="Edad"
                        options={edades}
                        selected={selectedEdad}
                        setSelected={setSelectedEdad}
                    />
                </div>
            </div>


            <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 px-12 py-4">
                    
                    {error? <p className="text-center col-span-full">Hubo un error al cargar las mascotas</p> : 
                    pets.length > 0 ? (
                        pets.map((item) => (
                            <PetCard key={item.id} post={item} />
                        ))
                    ) : (
                        <p className="text-center col-span-full">Cargando mascotas...</p>
                    )}

                </div>
            </section>

                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    size="md"
                />
        </div>
    )
}
