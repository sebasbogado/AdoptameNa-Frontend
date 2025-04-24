"use client";

import { useEffect, useState } from "react";
import Pagination from "@/components/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { getPetSMissing } from "@/utils/pets.http";
import { PET_STATUS } from "@/types/constants";
import PetCard from "@/components/petCard/pet-card";
import { Loader2 } from "lucide-react";
import LabeledSelect from "@/components/labeled-selected";
import { Animal } from "@/types/animal";
import { getAnimals } from "@/utils/animals.http";
import { getPetStatus } from "@/utils/pet-statuses.http";
import { PetStatus } from "@/types/pet-status";

export default function Page() {
  const pageSize = 20;
  const sort = "id,desc";
  const [animals, setAnimals] = useState<Animal[]>([]); //para obtener de la api
  const [selectedAnimal, setSelectedAnimal] = useState(""); //para selected y setSelected del filtro
  const [animalList, setAnimalList] = useState<string[]>([]); //para options del filtro
  const [petStatuses, setPetStatuses] = useState<PetStatus[]>([]); //para obtener de la api
  const [petStatusesList, setPetStatusesList] = useState<string[]>([]); //para options del filtro
  const [selectedPetStatus, setSelectedPetStatus] = useState(""); //para selected y setSelected del filtro
  //temp
  const distancias = ["A menos de 1 Km", "1 a 3 Km", "Mas de 3 Km", "Cualquier distancia"];
  const [selectedLocation, setSelectedLocation] = useState("");

  const {
    data: pets,
    loading,
    error,
    currentPage,
    totalPages,
    updateFilters,
    handlePageChange
  } = usePagination({
    fetchFunction: async (page, size, filters) => {
      return await getPetSMissing({
        page,
        size,
        sort,
        petStatusId: [PET_STATUS.MISSING, PET_STATUS.FOUND],
        ...filters
      });
    },
    initialPage: 1,
    initialPageSize: pageSize
  });

  const fetchData = async () => {
    try {
      const animals = await getAnimals();
      setAnimalList(["Todos", ...animals.data.map((animal: { name: string }) => animal.name)]);
      setAnimals(animals.data);

      const petStatus = await getPetStatus();
      setPetStatuses(petStatus.data);
      setPetStatusesList([
        "Todos",
        ...petStatus.data
          .filter((e: PetStatus) => e.id === PET_STATUS.MISSING || e.id === PET_STATUS.FOUND)
          .map((e: PetStatus) => e.name)
      ]);
    } catch (err: any) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);


  useEffect(() => {
    if (!selectedAnimal && !selectedPetStatus) return;
    const selectedAnimalObj = animals.find(
      (animal) => animal.name.toLowerCase() === selectedAnimal.toLowerCase()
    );
    const selectedStatusObj = petStatuses.find(
      (status) => status.name.toLowerCase() === selectedPetStatus.toLowerCase()
    );

    updateFilters({
      animalId: selectedAnimalObj?.id,
      petStatusId: selectedStatusObj ? selectedStatusObj.id : [PET_STATUS.MISSING, PET_STATUS.FOUND],
    });
  }, [selectedAnimal, selectedPetStatus]);

  return (
    <div className="flex flex-col gap-5">
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/*Falta por ubicacion*/}
          <LabeledSelect
            label="Distancia"
            options={distancias}
            selected={selectedLocation}
            setSelected={setSelectedLocation}
          />
          <LabeledSelect
            label="Estado"
            options={petStatusesList}
            selected={selectedPetStatus}
            setSelected={setSelectedPetStatus}
          />
          <LabeledSelect
            label="Tipo de mascota"
            options={animalList}
            selected={selectedAnimal}
            setSelected={setSelectedAnimal}
          />
        </div>
      </div>

      <div className="w-full flex flex-col items-center justify-center mb-6">
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md w-full max-w-md">
            {error.message || "Error al cargar mascotas"}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
          </div>
        ) : pets.length === 0 ? (
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