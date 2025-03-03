"use client";

import { Listbox } from "@headlessui/react";
import { useEffect, useState } from "react";
import Banners from '@components/banners'
import PetCard from '@components/petCard/petCard'
import { getPetsData } from '@utils/pets-client';

import { ChevronDownIcon } from "@heroicons/react/20/solid";
import LabeledSelect from "@/components/labeledSelect";

const ciudades = ["Encarnación", "Asunción", "Luque", "Fernando Zona Sur"];
const mascotas = ["Todos", "Conejo", "Perro", "Gato"];
const edades = ["0-1 años", "1-3 años", "3-6 años", "6+ años"];


export default function Page() {
    const [selectedCiudad, setSelectedCiudad] = useState<string | null>(null);
    const [selectedMascota, setSelectedMascota] = useState<string | null>(null);
    const [selectedEdad, setSelectedEdad] = useState<string | null>(null);

    const [pets, setPets] = useState<any[]>([]); // Asegura que pets inicie como un array vacío

    useEffect(() => {
        async function fetchPets() {
            const data = await getPetsData();
            setPets(data); // Guarda los datos en el estado
        }
        fetchPets();
    }, []);


    return (
        <div className='flex flex-col gap-5'>
            <Banners />

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
                    {/* 🔥 Mapeo de las mascotas */}
                    {Array.isArray(pets.posts) && pets.posts.length > 0 ? (
                        pets.posts.map((post) => <PetCard key={post.postId} post={post} />)
                    ) : (
                        <p className="text-center col-span-full">Cargando mascotas...</p>
                    )}

                </div>
            </section>
        </div>
    )
}