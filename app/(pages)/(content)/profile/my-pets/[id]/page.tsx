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



const fetchContentData = async (
    setPets: React.Dispatch<React.SetStateAction<Pet[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setPetsError: React.Dispatch<React.SetStateAction<string | null>>,
    userId: string,
) => {


    try {
        // Cargar posts del usuario
        const petData = await getPetsByUserId(userId);
        setPets(Array.isArray(petData) ? petData : []);
    } catch (err) {
        console.error("Error al cargar posts:", err);
        setPetsError("No se pudieron cargar las publicaciones."); // 👈 Manejo de error separado
    } finally {
        setLoading(false);
    }
};
export default function MyPostsPage() {
    const ciudades = ["Encarnación", "Asunción", "Luque", "Fernando Zona Sur"];
    const mascotas = ["Todos", "Conejo", "Perro", "Gato"];
    const edades = ["0-1 años", "1-3 años", "3-6 años", "6+ años"];

    const {id} = useParams();

    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [petsError, setPetsError] = useState<string | null>(null);

    const [selectedCiudad, setSelectedCiudad] = useState<string | null>(null);
    const [selectedMascota, setSelectedMascota] = useState<string | null>(null);
    const [selectedEdad, setSelectedEdad] = useState<string | null>(null);


    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(pets.length / itemsPerPage);
    const paginatedPets = pets.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );



    useEffect(() => {
        if(!id) return
        fetchContentData(setPets, setLoading, setPetsError, id.toString());
    }, []);

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
                    
                    {petsError? <p className="text-center col-span-full">Hubo un error al cargar las mascotas</p> : 
                    paginatedPets.length > 0 ? (
                        paginatedPets.map((post) => (
                            <PetCard key={post.id} post={post} />
                        ))
                    ) : (
                        <p className="text-center col-span-full">Cargando mascotas...</p>
                    )}

                </div>
            </section>
            {totalPages >= 1 && (
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={(page) => setCurrentPage(page)}
                    size="md"
                    showText={true}
                    prevText="Anterior"
                    nextText="Siguiente"
                />
            )}
        </div>
    )
}
