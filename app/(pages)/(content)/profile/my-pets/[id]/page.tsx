'use client';


import Banners from '@/components/banners';
import { useEffect, useState } from 'react';

import { Pet } from '@/types/pet';
import { useParams, useRouter } from 'next/navigation';
import Loading from '@/app/loading';
import PetCard from '@/components/petCard/pet-card';
import LabeledSelect from '@/components/labeled-selected';
import { getPetsByUserId } from '@/utils/pets.http';
import { error } from 'console';
import Pagination from '@/components/pagination';
import { usePagination } from '@/hooks/use-pagination';
import { Animal } from '@/types/animal';
import { getAnimals } from '@/utils/animals.http';
import { Loader2 } from 'lucide-react';


export default function MyPostsPage() {
    const ciudades = ["Encarnación", "Asunción", "Luque", "Fernando Zona Sur"];
    const edades = ["0-1 años", "1-3 años", "3-6 años", "6+ años"];

    const { id } = useParams();

    const [selectedCiudad, setSelectedCiudad] = useState<string | null>(null);
    const [selectedMascota, setSelectedMascota] = useState<string | null>(null);
    const [selectedMascotaId, setSelectedMascotaId] = useState<number | null>(null);
    const [selectedEdad, setSelectedEdad] = useState<string | null>(null);

    const [animals, setAnimals] = useState<Animal[]>([]);

    const pageSize = 20;
    const {
        data: pets,
        loading,
        error,
        currentPage,
        totalPages,
        updateFilters,
        handlePageChange,
    } = usePagination<Pet>({
        fetchFunction: (page, size, filters) =>
            getPetsByUserId({
                page,
                size,
                userId: Number(id),
                animalId: filters?.animalId || undefined,
                minAge: filters?.minAge || undefined,
                maxAge: filters?.maxAge || undefined,
            }),
        initialPage: 1,
        scrollToTop: false,
        initialPageSize: pageSize,
    });

    const cleanFilters = (filters: Record<string, any>) => {
        return Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined)
        );
    };

    useEffect(() => {
        const fetchAnimal = async () => {
            try {
                const animals = await getAnimals();
                setAnimals(animals.data);
            } catch (error) {
                console.error("Error al obtener el tipo de mascota:", error);
            }
        };

        fetchAnimal();
    }, []);

    useEffect(() => {
        if (selectedMascota && !selectedMascota.includes("Todos")) {
            const found = animals.find(a => a.name === selectedMascota);
            setSelectedMascotaId(found ? found.id : null);
        } else {
            setSelectedMascotaId(null);
        }
    }, [selectedMascota, animals]);

    useEffect(() => {
        const getAgeRange = (edadStr: string) => {
            if (!edadStr || edadStr === "Todos") return [undefined, undefined];
            if (edadStr.includes("+")) {
                const min = parseInt(edadStr);
                return [min, undefined]; // 👈 solo minAge, sin maxAge
            }
            const [min, max] = edadStr.replace(" años", "").split("-").map(Number);
            return [min, max];
        };

        const [minAge, maxAge] = getAgeRange(selectedEdad || "");

        const filteredData = {
            animalId: selectedMascotaId,
            minAge,
            maxAge,
            city: selectedCiudad,
        };

        const cleanedFilters = cleanFilters(filteredData);
        updateFilters(cleanedFilters);
    }, [selectedMascotaId, selectedEdad, selectedCiudad, updateFilters]);

    const bannerImages = ["/banner1.png", "/banner2.png", "/banner3.png", "/banner4.png"]

    return (
        <div className='flex flex-col gap-5'>
            <Banners images={bannerImages} />

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
                        options={["Todos", ...animals.map((animal) => animal.name)]}
                        selected={selectedMascota}
                        setSelected={setSelectedMascota}
                    />

                    {/* Select Edad */}
                    <LabeledSelect
                        label="Edad"
                        options={["Todos", ...edades]}
                        selected={selectedEdad}
                        setSelected={setSelectedEdad}
                    />
                </div>
            </div>

            <div className="w-full flex flex-col items-center justify-center mb-6">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
                    </div>
                ) : (
                    pets.length === 0 ? (
                        <div className="flex justify-center p-10 rounded-lg w-full">
                            <p className="text-gray-600">No se encontraron mascotas.</p>
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

            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                size="md"
            />
        </div>
    )
}
