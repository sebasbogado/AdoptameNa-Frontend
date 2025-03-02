"use client";

import { Listbox } from "@headlessui/react";
import { useState } from "react";
import Banners from '@components/banners'
import PetCard from '@components/petCard/petCard'

const ciudades = ["Encarnación", "Asunción", "Luque", "Fernando Zona Sur"];
const mascotas = ["Todos", "Conejo", "Perro", "Gato"];
const edades = ["0-1 años", "1-3 años", "3-6 años", "6+ años"];

const posts = [
    {
        postId: "1",
        title: "Luna, una perrita cariñosa busca hogar",
        tags: { especie: "Perro", edad: "2 años", tamaño: "Mediano", ciudad: "Madrid" },
        author: "Refugio Esperanza",
        content: "Luna es una perrita muy dulce y juguetona. Se lleva bien con niños y otras mascotas. Está vacunada y esterilizada, lista para encontrar un hogar amoroso.",
        date: "2025-02-28",
        imageUrl: "/images/perro_luna.jpg",
        postType: "adoption",
    },
    {
        postId: "2",
        title: "Gato siamés en busca de una familia",
        tags: { especie: "Gato", edad: "3 años", color: "Blanco y gris", ciudad: "Barcelona" },
        author: "Asociación Felina",
        content: "Este precioso gato siamés es muy sociable y cariñoso. Le encanta jugar y dormir en lugares cálidos. Se entrega con chip y vacunas al día.",
        date: "2025-02-27",
        imageUrl: "/images/gato_siames.jpg",
        postType: "adoption",
    },
    {
        postId: "3",
        title: "Cachorros de labrador en adopción",
        tags: { especie: "Perro", edad: "3 meses", tamaño: "Grande", ciudad: "Sevilla" },
        author: "Huellitas Sin Hogar",
        content: "Tenemos una camada de 5 cachorros de labrador listos para encontrar familia. Son juguetones y están en proceso de vacunación.",
        date: "2025-02-26",
        imageUrl: "/images/cachorros_labrador.jpg",
        postType: "adoption",
    },
    {
        postId: "4",
        title: "Conejito enano necesita un nuevo hogar",
        tags: { especie: "Conejo", edad: "1 año", color: "Marrón", ciudad: "Valencia" },
        author: "Protectora Animal",
        content: "Este pequeño conejo enano es muy tierno y dócil. Necesita un hogar donde pueda correr libremente y recibir mucho amor.",
        date: "2025-02-25",
        imageUrl: "/images/conejo_enano.jpg",
        postType: "adoption",
    },
    {
        postId: "5",
        title: "Gata rescatada busca familia responsable",
        tags: { especie: "Gato", edad: "2 años", color: "Negro", ciudad: "Bilbao" },
        author: "Amigos Felinos",
        content: "Rescatamos a esta hermosa gatita de la calle. Es muy cariñosa y está esterilizada. Buscamos un hogar donde la cuiden con amor.",
        date: "2025-02-24",
        imageUrl: "/images/gata_negra.jpg",
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
                <Listbox.Button className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-left focus:ring-2 focus:ring-blue-500">
                    {selected || label}
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