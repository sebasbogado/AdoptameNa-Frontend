"use client";

import { useEffect, useState, useCallback } from "react";
import PetCard from '@/components/petCard/pet-card';
import { getPets } from "@/utils/pets.http";
import { getAnimals } from "@/utils/animals.http";
import LabeledSelect from "@/components/labeled-selected";
import { Pet } from "@/types/pet";
import { PET_STATUS } from "@/types/constants";
import { usePagination } from "@/hooks/use-pagination";
import { Loader2 } from "lucide-react";
import Pagination from "@/components/pagination";
import { useAuth } from "@/contexts/auth-context";
import LocationFilter from "@/components/filters/location-filter";
import { LocationFilters, LocationFilterType } from "@/types/location-filter";
import { Animal } from "@/types/animal";
import FloatingActionButton from "@/components/buttons/create-publication-buttons";
import { capitalizeFirstLetter } from "@/utils/Utils";
import { SkeletonFilters } from "@/components/ui/skeleton-filter";
import { SkeletonCard } from "@/components/ui/skeleton-card";

export default function Page() {
    const { user } = useAuth();
    const [selectedVacunado, setSelectedVacunado] = useState<string | null>("Todos");
    const [selectedEsterilizado, setSelectedEsterilizado] = useState<string | null>("Todos");
    const [selectedGenero, setSelectedGenero] = useState<string | null>("Todos");
    const [selectedAnimal, setSelectedAnimal] = useState<string | null>("Todos");
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [animalList, setAnimalList] = useState<string[]>([]);
    const [locationFilters, setLocationFilters] = useState<LocationFilters>({});
    const [filterChanged, setFilterChanged] = useState(false);
    const [locationType, setLocationType] = useState<LocationFilterType | null>(null);
    const [filterLoading, setFilterLoading] = useState(true);


    const pageSize = 10;
    const sort = "id,desc";

    const {
        data: pets,
        loading,
        error,
        currentPage,
        totalPages,
        updateFilters,
        handlePageChange
    } = usePagination<Pet>({
        fetchFunction: async (page, size, filters) => {
            return await getPets({
                page,
                size,
                sort,
                petStatusId: [PET_STATUS.ADOPTION],
                ...filters
            });
        },
        initialPage: 1,
        initialPageSize: pageSize
    });

    const fetchData = async () => {
        try {
            setFilterLoading(true);
            const animals = await getAnimals();
            setAnimalList([
                "Todos",
                ...animals.data.map((animal: { name: string }) =>
                    capitalizeFirstLetter(animal.name)
                )
            ]);
            setAnimals(animals.data);
        } catch (err: any) {
            console.error(err.message);
        } finally {
            setFilterLoading(false);
        }
    };

    const handleLocationFilterChange = useCallback((filters: Record<string, any>) => {
        setLocationFilters(filters);
        setFilterChanged(prev => !prev);
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        let filters: any = {};

        if (selectedAnimal && selectedAnimal !== "Todos") {
            const selectedAnimalObj = animals.find(
                (animal) => animal.name.toLowerCase() === selectedAnimal.toLowerCase()
            );
            if (selectedAnimalObj) {
                filters.animalId = selectedAnimalObj.id;
            }
        }

        if (selectedVacunado && selectedVacunado !== "Todos") {
            filters.isVaccinated = selectedVacunado === "Sí";
        }

        if (selectedEsterilizado && selectedEsterilizado !== "Todos") {
            filters.isSterilized = selectedEsterilizado === "Sí";
        }

        if (selectedGenero && selectedGenero !== "Todos") {
            filters.gender = selectedGenero === "Femenino" ? "FEMALE" : "MALE";
        }

        filters = {
            ...filters,
            ...locationFilters
        };

        updateFilters(filters);
    }, [selectedAnimal, selectedVacunado, selectedEsterilizado, selectedGenero, locationFilters, filterChanged]);

    return (
        <div className="flex flex-col gap-5">
            {filterLoading ?
                <div className="w-full">
                    <SkeletonFilters numFilters={5} />
                </div>
                :

                <div className="w-full max-w-7xl mx-auto p-4">
                    <div
                        className={`
                        grid grid-cols-2 md:grid-cols-2
                        ${user?.location ? 'lg:grid-cols-5' : 'lg:grid-cols-4'}
                        gap-x-6 gap-y-6
                        px-4 md:px-0
                    `}>

                        {/* Filtro de ubicación - solo si hay datos de ubicación */}
                        {user?.location ? (
                            <LocationFilter
                                user={user}
                                locationType={locationType}
                                setLocationType={setLocationType}
                                onFilterChange={handleLocationFilterChange}
                            />
                        ) : (
                            <div className="hidden lg:w-1/2 flex-shrink-0"></div>
                        )}

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
                            options={animalList}
                            selected={selectedAnimal}
                            setSelected={setSelectedAnimal}
                        />


                    </div>
                </div>
            }
            <div className="w-full flex flex-col items-center justify-center mb-6">
                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-md w-full max-w-md">
                        {error.message || 'Error al cargar las mascotas'}
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-8 mt-2 p-2">
                        {[...Array(10)].map((_, index) => (
                            <SkeletonCard key={index} />
                        ))}
                    </div>

                ) : (
                    pets.length === 0 ? (
                        <div className="text-center p-10 bg-gray-50 rounded-lg w-full max-w-md">
                            <p className="text-gray-600">No se encontraron mascotas en adopción</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-10 mt-2 p-2">
                            {pets.map((pet) => (
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

            <FloatingActionButton />

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
