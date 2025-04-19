"use client";

import { useEffect, useState } from "react";
import Pagination from "@/components/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { getPetSMissing } from "@/utils/pets.http";
import { PET_STATUS } from "@/types/constants";
import PetCard from "@/components/petCard/pet-card";
import { Loader2 } from "lucide-react";
import Banners from "@/components/banners";
import LabeledSelect from "@/components/labeled-selected";
import { Animal } from "@/types/animal";
import { getAnimals } from "@/utils/animals.http";
import { getPetStatuses } from "@/utils/pet-statuses.http";
import { PetStatus } from "@/types/pet-status";

export default function Page() {
  const pageSize = 20;
  const sort = "id,desc";
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState("");
  const [animalTypes, setAnimalTypes] = useState<string[]>([]);
  const [petStatuses, setPetStatuses] = useState<string[]>([]);
  const [selectedPetStatus, setSelectedPetStatus] = useState<string | null>(null);


  const {
    data: pets,
    loading,
    error,
    currentPage,
    totalPages,
    handlePageChange
  } = usePagination({
    fetchFunction: async (page, size) => {
      return await getPetSMissing({
        page,
        size,
        sort,
        petStatusId: [PET_STATUS.MISSING, PET_STATUS.ADOPTION]
      });
    },
    initialPage: 1,
    initialPageSize: pageSize
  });

  const fetchData = async () => {
    try {
      const animals = await getAnimals();
      setAnimalTypes(["Todos", ...animals.data.map((animal: { name: string }) => animal.name)]);
      setAnimals(animals.data);

      const petStatus = await getPetStatuses();
      setPetStatuses([
        "Todos",
        ...petStatus.data
          .filter((e: PetStatus) => e.id === PET_STATUS.MISSING || e.id === PET_STATUS.FOUND)
          .map((e: PetStatus) => e.name)
      ]);
    } catch (err: any) {
      console.log(err.message);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  const bannerImages = ["banner1.png", "banner2.png", "banner3.png", "banner4.png"]

  const filteredData = pets.filter((item) => {
    // Filtrar mascotas
    if (selectedAnimal && selectedAnimal !== "Todos") {
      const selectedAnimalObj = animals.find((animal) => animal.name.toLowerCase() === selectedAnimal.toLowerCase());
      if (item.animal.name !== selectedAnimalObj?.name) return false;
    }
    // Filtrar por estado
    if (selectedPetStatus && selectedPetStatus !== "Todos") {
      const selectedStatus = petStatuses.find((status) => status.toLowerCase() === selectedPetStatus.toLowerCase());
      if (item.petStatus.name !== selectedStatus) return false;
    }
    return true;
  })

  return (
    <div className="flex flex-col gap-5">
      <Banners images={bannerImages} />
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/*Falta por ubicacion*/}
          <LabeledSelect
            label="Estado"
            options={petStatuses}
            selected={selectedPetStatus}
            setSelected={setSelectedPetStatus}
          />

          <LabeledSelect
            label="Animal"
            options={animalTypes}
            selected={selectedAnimal}
            setSelected={setSelectedAnimal}
          />
        </div>
      </div>

      <div className="min-h-[400px] w-full flex flex-col items-center justify-center mb-6">
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md w-full max-w-md">
            {error.message || "Error al cargar mascotas"}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center p-10 bg-gray-50 rounded-lg w-full max-w-md">
            <p className="text-gray-600">No se encontraron mascotas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-8 mt-2 p-2">
            {pets.map((pet) => (
              <PetCard key={pet.id} post={pet} />
            ))}
          </div>
        )}
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        size="md"
      />
    </div>
  );
}
