"use client";

import { Listbox } from "@headlessui/react";
import { useState } from "react";
import Banners from '@components/banners'
import PetCard from '@components/petCard'

const ciudades = ["Madrid", "Barcelona", "Valencia", "Sevilla"];
const mascotas = ["Perro", "Gato", "Ave", "Otro"];
const edades = ["0-1 años", "1-3 años", "3-5 años", "5+ años"];

const pets = [
    { id: 1, name: "Firulais", description: "Un perrito muy juguetón" },
    { id: 2, name: "Luna", description: "Dócil y amigable" },
    { id: 3, name: "Max", description: "Le encanta correr" },
    { id: 4, name: "Bella", description: "Muy cariñosa" },
    { id: 5, name: "Rocky", description: "Fuerte y enérgico" },
    { id: 6, name: "Toby", description: "Un poco tímido" },
    { id: 7, name: "Nina", description: "Juguetona y amorosa" },
    { id: 8, name: "Simba", description: "Amante de la naturaleza" },
    { id: 9, name: "Duke", description: "Valiente y leal" },
    { id: 10, name: "Sasha", description: "Pequeña y curiosa" },
    { id: 11, name: "Bobby", description: "Siempre atento" },
    { id: 12, name: "Coco", description: "Le encanta el agua" },
    { id: 13, name: "Thor", description: "Guardián del hogar" },
    { id: 14, name: "Lola", description: "Súper amigable" },
    { id: 15, name: "Zeus", description: "El líder de la manada" },
];

export default function Page() {
    const [selectedCiudad, setSelectedCiudad] = useState<string | null>(null);
    const [selectedMascota, setSelectedMascota] = useState<string | null>(null);
    const [selectedEdad, setSelectedEdad] = useState<string | null>(null);
    return (
        <div className='flex flex-col gap-5'>
            <Banners />

            <div className="w-full max-w-4xl mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* Select Ciudad */}
                    <CustomSelect
                        label="Selecciona tu ciudad"
                        options={ciudades}
                        selected={selectedCiudad}
                        setSelected={setSelectedCiudad}
                    />

                    {/* Select Mascota */}
                    <CustomSelect
                        label="Tipo de mascota"
                        options={mascotas}
                        selected={selectedMascota}
                        setSelected={setSelectedMascota}
                    />

                    {/* Select Edad */}
                    <CustomSelect
                        label="Edad"
                        options={edades}
                        selected={selectedEdad}
                        setSelected={setSelectedEdad}
                    />

                </div>
            </div>

            <section>
                <h2 className="text-2xl font-bold text-center my-4">Nuestros Perritos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 px-12 py-4">
                    {pets.map((pet) => (
                        <PetCard key={pet.id} pet={pet} />
                    ))}
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
                <Listbox.Button className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-left focus:ring-2 focus:ring-blue-500">
                    {selected || label}
                </Listbox.Button>
                <Listbox.Options className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
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