"use client";

import { useEffect, useState } from "react";
import Banners from '@components/banners'
import PetCard from '@/components/petCard/pet-card'
import { loginMock } from "@utils/login-mock";
import { getPosts } from '@utils/posts-api';
import Cookies from "js-cookie";

import LabeledSelect from "@/components/labeled-selected";

const ciudades = ["Encarnación", "Asunción", "Luque", "Fernando Zona Sur"];
const mascotas = ["Todos", "Conejo", "Perro", "Gato"];
const edades = ["0-1 años", "1-3 años", "3-6 años", "6+ años"];

interface Pet {
    id: number;
    idUser: number;
    title: string;
    content: string;
    idPostType: number;
    locationCoordinates: string;
    contactNumber: string;
    status: string;
    sharedCounter: number;
    publicationDate: string;
    tags: Record<string, string>; // Un objeto con claves dinámicas y valores string
}

export default function Page() {
    const [selectedCiudad, setSelectedCiudad] = useState<string | null>(null);
    const [selectedMascota, setSelectedMascota] = useState<string | null>(null);
    const [selectedEdad, setSelectedEdad] = useState<string | null>(null);

    const [pets, setPets] = useState<Pet[]>([]); // Ahora pets tiene el tipo correcto

    useEffect(() => {
        async function fetchData() {
            try {
                // 1️⃣ Realizar login y obtener el token
                const token = await loginMock();

                // 2️⃣ Guardar el token en cookies
                Cookies.set("token", token, { expires: 1 }); // Expira en 1 día

                // 3️⃣ Llamar a la API de posts con el token guardado
                const fetchedPosts = await getPosts();
                // 4️⃣ Asegurar que cada post tenga `tags` y agregar "Mascota"
                const postsWithTags = fetchedPosts.map((post: { tags: { especie: any; }; }) => ({
                    ...post,
                    tags: {
                        ...post.tags,  // Conservar los tags existentes
                        Mascota: post.tags?.especie || "Desconocida" // Agregar un tag "Mascota"
                    }
                }));

                console.log("Posts:", postsWithTags);

                setPets(postsWithTags || []); // Asegurar que sea un array
            } catch (error) {
                console.error("Error en la autenticación o al obtener posts:", error);
            }
        }

        fetchData();
    }, []); // 🔄 Se ejecuta solo una vez al montar el componente


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
                    {pets.length > 0 ? (
                        pets.map((post) => (
                            <PetCard key={post.id} post={post} />
                        ))
                    ) : (
                        <p className="text-center col-span-full">Cargando mascotas...</p>
                    )}

                </div>
            </section>
        </div>
    )
}