"use client";

import { Listbox } from "@headlessui/react";
import { useEffect, useState } from "react";
import Banners from '@components/banners'
import PetCard from '@components/petCard/petCard'
import { getPetsData } from '@utils/pets-client';

import { ChevronDownIcon } from "@heroicons/react/20/solid";

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
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                        <CustomSelect
                            label="Selecciona tu ciudad"
                            options={ciudades}
                            selected={selectedCiudad}
                            setSelected={setSelectedCiudad}
                        />
                    </div>

                    {/* Select Mascota */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Tipo de Mascota</label>
                        <CustomSelect
                            label="Tipo de mascota"
                            options={mascotas}
                            selected={selectedMascota}
                            setSelected={setSelectedMascota}
                        />
                    </div>

                    {/* Select Edad */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Edad</label>
                        <CustomSelect
                            label="Edad"
                            options={edades}
                            selected={selectedEdad}
                            setSelected={setSelectedEdad}
                        />
                    </div>

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

function CustomSelect({
    label,
    options,
    selected,
    setSelected
}: {
    label: string;
    options: string[];
    selected: string | null;
    setSelected: (value: string) => void;
}) {
    return (
        <Listbox value={selected} onChange={setSelected}>
            <div className="relative">
                <Listbox.Button className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none">
                    {selected || label}
                    <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                </Listbox.Button>
                <Listbox.Options className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50">
                    {options.map((option, index) => (
                        <Listbox.Option
                            key={index}
                            value={option}
                            className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                        >
                            {option}
                        </Listbox.Option>
                    ))}
                </Listbox.Options>
            </div>
        </Listbox>
    );
}