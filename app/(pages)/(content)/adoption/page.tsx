"use client";

import { useEffect, useState } from "react";
import Banners from '@/components/banners'
import PetCard from '@/components/petCard/pet-card'
import { getPets } from "@/utils/pets.http";
import { getAnimals } from "@/utils/animals.http"; // Importar la nueva función
import { useAuth } from "@/contexts/authContext";
import LabeledSelect from "@/components/labeled-selected";
import { Pet } from "@/types/pet";


export default function Page() {
    const [selectedVacunado, setSelectedVacunado] = useState<string | null>(null);
    const [selectedEsterilizado, setSelectedEsterilizado] = useState<string | null>(null);
    const [selectedGenero, setSelectedGenero] = useState<string | null>(null);
    const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
    const [animalTypes, setAnimalTypes] = useState<string[]>([]); // Estado para almacenar los tipos de animales
    const [pets, setPets] = useState<Pet[]>([]);
    const [animals, setAnimals] = useState<{ id: number; name: string }[]>([]);


    useEffect(() => {

        const fetchData = async () => {
            try {
                const data = await getPets();
                const animals = await getAnimals(); // Obtener los tipos de animales

                console.log("MAscotas: ", data)
                // Filtrar solo los pets con animalId = 16
                const filteredPets = data.filter((pet: Pet) => pet.petStatusId === 16);

                // Extraer solo los nombres y agregar "Todos"
                setAnimalTypes(["Todos", ...animals.map((animal: { name: string }) => animal.name)]);
                setAnimals(animals);
                setPets(filteredPets);
            } catch (err: any) {
                console.log(err.message);
            }
        };

        fetchData();
    }, []);

    const filteredPets = pets.filter((pet) => {
        if (selectedVacunado && selectedVacunado !== "Todos") {
            const isVaccinated = selectedVacunado === "Sí";
            if (pet.isVaccinated !== isVaccinated) return false;
        }

        if (selectedEsterilizado && selectedEsterilizado !== "Todos") {
            const isSterilized = selectedEsterilizado === "Sí";
            if (pet.isSterilized !== isSterilized) return false;
        }

        if (selectedGenero && selectedGenero !== "Todos") {
            const gender = selectedGenero === "Femenino" ? "FEMALE" : "MALE";
            if (pet.gender !== gender) return false;
        }

        if (selectedAnimal && selectedAnimal !== "Todos") {
            const selectedAnimalObj = animals.find((animal) => animal.name.toLowerCase() === selectedAnimal.toLowerCase());
            if (!selectedAnimalObj || pet.animalId !== selectedAnimalObj.id) return false;
        }

        return true;
    });

    const bannerImages = ["banner1.png", "banner2.png", "banner3.png", "banner4.png"];

    return (
        <div className='flex flex-col gap-5'>
            <Banners images={bannerImages} />

            <div className="w-full max-w-4xl mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                    {/* Select Está Vacunado */}
                    <LabeledSelect
                        label="Vacunado"
                        options={["Todos", "Sí", "No"]}
                        selected={selectedVacunado}
                        setSelected={setSelectedVacunado}
                    />

                    {/* Select Está Esterilizado */}
                    <LabeledSelect
                        label="Esterilizado"
                        options={["Todos", "Sí", "No"]}
                        selected={selectedEsterilizado}
                        setSelected={setSelectedEsterilizado}
                    />

                    {/* Select Género */}
                    <LabeledSelect
                        label="Género"
                        options={["Todos", "Femenino", "Masculino"]}
                        selected={selectedGenero}
                        setSelected={setSelectedGenero}
                    />

                    {/* Select Tipo de Animal */}
                    <LabeledSelect
                        label="Animal"
                        options={animalTypes}
                        selected={selectedAnimal}
                        setSelected={setSelectedAnimal}
                    />
                </div>
            </div>

            <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 px-12 py-4">
                    {pets.length === 0 ? (
                        <p className="text-center col-span-full">Cargando mascotas...</p>
                    ) : filteredPets.length === 0 ? (
                        <p className="text-center col-span-full">No se han encontrado mascotas</p>
                    ) : (
                        filteredPets.map((post) => <PetCard key={post.id} post={post} />)
                    )}
                </div>
            </section>
        </div>
    )
}
