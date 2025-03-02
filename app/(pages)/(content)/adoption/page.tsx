"use client";

import { Listbox } from "@headlessui/react";
import { useState } from "react";
import Banners from '@components/banners'
import PetCard from '@components/petCard/petCard'

import { ChevronDownIcon } from "@heroicons/react/20/solid";

const ciudades = ["Encarnación", "Asunción", "Luque", "Fernando Zona Sur"];
const mascotas = ["Todos", "Conejo", "Perro", "Gato"];
const edades = ["0-1 años", "1-3 años", "3-6 años", "6+ años"];

const posts = [
    {
        postId: "1",
        title: "Luna, una perrita cariñosa busca hogar",
        tags: { especie: "Perro", edad: "2 años", tamaño: "Mediano", ciudad: "Asunción" },
        author: "Refugio Esperanza",
        content: "Luna es una perrita muy dulce y juguetona. Se lleva bien con niños y otras mascotas. Está vacunada y esterilizada, lista para encontrar un hogar amoroso.",
        date: "2025-02-28",
        imageUrl: "defaultcardimg.jpg",
        postType: "adoption",
    },
    {
        postId: "2",
        title: "Gato siamés en busca de una familia",
        tags: { especie: "Gato", edad: "3 años", color: "Blanco y gris", ciudad: "Asunción" },
        author: "Asociación Felina",
        content: "Este precioso gato siamés es muy sociable y cariñoso. Le encanta jugar y dormir en lugares cálidos. Se entrega con chip y vacunas al día.",
        date: "2025-02-27",
        imageUrl: "defaultcardimg.jpg",
        postType: "adoption",
    },
    {
        postId: "3",
        title: "Cachorros de labrador en adopción",
        tags: { especie: "Perro", edad: "3 meses", tamaño: "Grande", ciudad: "Asunción" },
        author: "Huellitas Sin Hogar",
        content: "Tenemos una camada de 5 cachorros de labrador listos para encontrar familia. Son juguetones y están en proceso de vacunación.",
        date: "2025-02-26",
        imageUrl: "defaultcardimg.jpg",
        postType: "adoption",
    },
    {
        postId: "4",
        title: "Conejito enano necesita un nuevo hogar",
        tags: { especie: "Conejo", edad: "1 año", color: "Marrón", ciudad: "Encarnación" },
        author: "Protectora Animal",
        content: "Este pequeño conejo enano es muy tierno y dócil. Necesita un hogar donde pueda correr libremente y recibir mucho amor.",
        date: "2025-02-25",
        imageUrl: "defaultcardimg.jpg",
        postType: "adoption",
    },
    {
        postId: "5",
        title: "Gata rescatada busca familia responsable",
        tags: { especie: "Gato", edad: "2 años", color: "Negro", ciudad: "Encarnación" },
        author: "Amigos Felinos",
        content: "Rescatamos a esta hermosa gatita de la calle. Es muy cariñosa y está esterilizada. Buscamos un hogar donde la cuiden con amor.",
        date: "2025-02-24",
        imageUrl: "defaultcardimg.jpg",
        postType: "adoption",
    }
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
                    {posts.map((post) => (
                        <PetCard key={post.postId} post={post} />
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