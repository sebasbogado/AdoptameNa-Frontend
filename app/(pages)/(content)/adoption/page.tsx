"use client";

import { useEffect, useState } from "react";
import PetCard from '@/components/petCard/pet-card';
import { getPets } from "@/utils/pets.http";
import { getAnimals } from "@/utils/animals.http";
import LabeledSelect from "@/components/labeled-selected";
import { Pet } from "@/types/pet";
import { PET_STATUS } from "@/types/constants";
import { usePagination } from "@/hooks/use-pagination";
import { Loader2 } from "lucide-react";
import Pagination from "@/components/pagination";

export default function Page() {
    const [selectedVacunado, setSelectedVacunado] = useState<string | null>(null);
    const [selectedEsterilizado, setSelectedEsterilizado] = useState<string | null>(null);
    const [selectedGenero, setSelectedGenero] = useState<string | null>(null);
    const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
    const [animalTypes, setAnimalTypes] = useState<string[]>([]);
    const [animals, setAnimals] = useState<{ id: number; name: string }[]>([]);

    const pageSize = 10;
    const sort = "id,desc";

    const {
        data: pets,
        loading,
        error,
        currentPage,
        totalPages,
        handlePageChange
    } = usePagination<Pet>({
        fetchFunction: async (page, size) => {
            return await getPets({ page, size, sort, petStatusId: PET_STATUS.ADOPTION });
        },
        initialPage: 1,
        initialPageSize: pageSize
    });

    const fetchData = async () => {
        try {
            const animals = await getAnimals();
            setAnimalTypes(["Todos", ...animals.data.map((animal: { name: string }) => animal.name)]);
            setAnimals(animals.data);
        } catch (err: any) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = pets.filter((item) => {
        // Filtrar mascotas
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
            if (item.animal.name !== selectedAnimalObj?.name) return false;
        }

        return true;
    });

    return (
        <div className="flex flex-col gap-5">
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

            <div className="w-full flex flex-col items-center justify-center mb-6">
                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-md w-full max-w-md">
                        {error.message || 'Error al cargar las mascotas'}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center">
                        <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
                    </div>
                ) : (
                    filteredData.length === 0 ? (
                        <div className="text-center p-10 bg-gray-50 rounded-lg w-full max-w-md">
                            <p className="text-gray-600">No se encontraron mascotas en adopción</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-10 mt-2 p-2">
                            {filteredData.map((pet) => (
                                <PetCard
                                    key={pet.id}
                                    post={pet}
                                    isPost={false}
                                />
                            ))}
                        </div>
                    )
                )}
            </div>

            {/* Pagination */}
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                size='md'
            />
        </div>
    );
}
