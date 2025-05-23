"use client";

import { useEffect, useState, useCallback } from "react";
import Pagination from "@/components/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { getPets } from "@/utils/pets.http";
import { PET_STATUS } from "@/types/constants";
import PetCard from "@/components/petCard/pet-card";
import { Loader2 } from "lucide-react";
import LabeledSelect from "@/components/labeled-selected";
import { Animal } from "@/types/animal";
import { getAnimals } from "@/utils/animals.http";
import { getPetStatus } from "@/utils/pet-statuses.http";
import { PetStatus } from "@/types/pet-status";
import { useAuth } from "@/contexts/auth-context";
import LocationFilter from "@/components/filters/location-filter";
import { LocationFilters, LocationFilterType } from "@/types/location-filter";
import FloatingActionButton from "@/components/buttons/create-publication-buttons";
import { capitalizeFirstLetter } from "@/utils/Utils";

export default function Page() {
  const { user } = useAuth();
  const pageSize = 10;
  const sort = "id,desc";
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState("");
  const [animalList, setAnimalList] = useState<string[]>([]);
  const [petStatuses, setPetStatuses] = useState<PetStatus[]>([]);
  const [petStatusesList, setPetStatusesList] = useState<string[]>([]);
  const [selectedPetStatus, setSelectedPetStatus] = useState("");
  const [locationFilters, setLocationFilters] = useState<LocationFilters>({});
  const [filterChanged, setFilterChanged] = useState(false);
  const [locationType, setLocationType] = useState<LocationFilterType | null>(null);

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
      return await getPets({
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
      setAnimalList(animals.data.map((animal: { name: string }) => capitalizeFirstLetter(animal.name)));
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
  }, [user]);

  const handleLocationFilterChange = useCallback((filters: Record<string, any>) => {
    setLocationFilters(filters);
    setFilterChanged(prev => !prev);
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

    if (selectedPetStatus && selectedPetStatus !== "Todos") {
      const selectedStatusObj = petStatuses.find(
        (status) => status.name.toLowerCase() === selectedPetStatus.toLowerCase()
      );
      if (selectedStatusObj) {
        filters.petStatusId = selectedStatusObj.id;
      }
    } else {
      filters.petStatusId = [PET_STATUS.MISSING, PET_STATUS.FOUND];
    }

    filters = {
      ...filters,
      ...locationFilters
    };

    updateFilters(filters);
  }, [selectedAnimal, selectedPetStatus, locationFilters, filterChanged]);

  return (
    <div className="flex flex-col gap-5">
      <div className="w-full max-w-7xl mx-auto p-4">
        <div
          className={`
            grid grid-cols-1 md:grid-cols-2
            ${user?.location ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}
            gap-x-6 gap-y-6
            px-4 md:px-0
          `}>
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

      <FloatingActionButton />

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        size="md"
      />
    </div>
  );
}