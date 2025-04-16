"use client";

import { useEffect, useState } from "react";
import Banners from '@/components/banners';
import PetCard from '@/components/petCard/pet-card';
import { getPets } from "@/utils/pets.http";
import { getAnimals } from "@/utils/animals.http";
import LabeledSelect from "@/components/labeled-selected";
import { Pet } from "@/types/pet";
import { PET_STATUS } from "@/types/constants";


export default function Page() {
    const [selectedVacunado, setSelectedVacunado] = useState<string | null>(null);
    const [selectedEsterilizado, setSelectedEsterilizado] = useState<string | null>(null);
    const [selectedGenero, setSelectedGenero] = useState<string | null>(null);
    const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
    const [animalTypes, setAnimalTypes] = useState<string[]>([]);
    const [pets, setPets] = useState<Pet[]>([]);
    const [animals, setAnimals] = useState<{ id: number; name: string }[]>([]);

    const fetchData = async () => {
        try {
            const queryParam = {
                page: 0,
                size: 15,
                sort: "id,desc",
                petStatusId: PET_STATUS.ADOPTION,
            }
            const petData = await getPets(queryParam);
            const animals = await getAnimals();

            setAnimalTypes(["Todos", ...animals.data.map((animal: { name: string }) => animal.name)]);
            setAnimals(animals.data);
            setPets(petData.data);
        } catch (err: any) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Combinar mascotas y posts
    const combinedData = [...pets];

    // Filtrar los datos combinados
    const filteredData = pets.filter((item) => {
        // Filtrar mascotas
        if ("isVaccinated" in item) {
            if (selectedVacunado && selectedVacunado !== "Todos") {
                const isVaccinated = selectedVacunado === "Sí";
                if (item.isVaccinated !== isVaccinated) return false;
            }

            if (selectedEsterilizado && selectedEsterilizado !== "Todos") {
                const isSterilized = selectedEsterilizado === "Sí";
                if (item.isSterilized !== isSterilized) return false;
            }

            if (selectedGenero && selectedGenero !== "Todos") {
                const gender = selectedGenero === "Femenino" ? "FEMALE" : "MALE";
                if (item.gender !== gender) return false;
            }

            if (selectedAnimal && selectedAnimal !== "Todos") {
                const selectedAnimalObj = animals.find((animal) => animal.name.toLowerCase() === selectedAnimal.toLowerCase());
                if (!selectedAnimalObj || item.animalId !== selectedAnimalObj.id) return false;
            }
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
                    {combinedData.length === 0 ? (
                        <p className="text-center col-span-full">Cargando datos...</p>
                    ) : filteredData.length === 0 ? (
                        <p className="text-center col-span-full">No se han encontrado resultados</p>
                    ) : (
                        filteredData.map((item) =>
                                <PetCard key={item.id} post={item} />
                        )
                    )}
                </div>
            </section>
        </div>
    );
}
