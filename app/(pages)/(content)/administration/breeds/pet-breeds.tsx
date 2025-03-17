"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, Plus } from "lucide-react";
import { getBreeds } from "@/utils/breeds.http";
import { getAnimals } from "@/utils/animals.http";
import { useAuth } from "@/contexts/authContext";
import AnimalBreedModal from "./animal-breed-modal"
//import button  from "@/components/buttons/button"

interface Breed {
  id: number;
  name: string;
  animalId: number;
}

interface Animal {
  id: number;
  name: string;
}

export default function PetBreeds() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Todos");
  const [filterOpen, setFilterOpen] = useState(false);
  const { authToken } = useAuth();

  const [selectedBreed, setSelectedBreed] = useState<Breed | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [loadingBreeds, setLoadingBreeds] = useState(true);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loadingAnimals, setLoadingAnimals] = useState(true);

  const handleBreedSaved = (updatedBreed: Breed) => {
    setBreeds((prev) => {
      const existingIndex = prev.findIndex((b) => b.id === updatedBreed.id);
      if (existingIndex !== -1) {
        // Actualiza la raza en la lista
        return prev.map((b) => (b.id === updatedBreed.id ? updatedBreed : b));
      } else {
        // Agrega la nueva raza
        return [...prev, updatedBreed];
      }
    });
    setSelectedBreed(null);
  };

  const handleCreateBreed = () => {
    setSelectedBreed(null); // Modal se abre sin datos -> modo "crear"
    setIsModalOpen(true);
  };

  const handleEditBreed = (breed: Breed) => {
    setSelectedBreed(breed); // Modal se abre con datos -> modo "editar"
    setIsModalOpen(true);
  };

  const handleBreedDeleted = (deletedId: number) => {
    setBreeds((prev) => prev.filter((b) => b.id !== deletedId));
    setSelectedBreed(null);
  };

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const data = await getAnimals();
        if (data) {
          setAnimals(data);
        }
      } catch (error) {
        console.error("Error al cargar los animales.");
      } finally {
        setLoadingAnimals(false);
      }
    };

    fetchAnimals();
  }, []);

  useEffect(() => {
    if (!authToken) return;

    const fetchBreeds = async () => {
      try {
        const data = await getBreeds(authToken);
        if (data) {
          setBreeds(data);
        }
      } catch (error) {
        console.error("Error al cargar las razas.");
      } finally {
        setLoadingBreeds(false);
      }
    };

    fetchBreeds();
  }, [authToken]);

  // 🔥 Filtrado dinámico de razas según el animal seleccionado
  const filteredBreeds = breeds.filter(
    (breed) =>
      (selectedFilter === "Todos" || breed.animalId === animals.find((a) => a.name === selectedFilter)?.id) &&
      breed.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-2xl mx-auto rounded-xl border border-gray-200 p-6 bg-white">
      <h2 className="text-2xl font-medium text-gray-800 mb-4">Razas</h2>

      <div className="flex gap-4 mb-6">
        {/* 🔎 Barra de búsqueda */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar raza"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* 🏷️ Filtro por animal */}
        <div className="relative">
          <button
            className="flex justify-between w-56 bg-white text-gray-700 font-normal border border-gray-300 rounded-lg px-4 py-2"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            {selectedFilter === "Todos" ? "Filtrar por animal" : selectedFilter}
            <ChevronDown className="h-4 w-4 ml-2" />
          </button>

          {filterOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg">
              <div
                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setSelectedFilter("Todos");
                  setFilterOpen(false);
                }}
              >
                Todos
              </div>

              {loadingAnimals ? (
                <p className="px-4 py-2 text-gray-500">Cargando...</p>
              ) : (
                animals.map((animal) => (
                  <div
                    key={animal.id}
                    onClick={() => {
                      setSelectedFilter(animal.name);
                      setFilterOpen(false);
                    }}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  >
                    {animal.name}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* 🎯 Mostrar razas filtradas */}
      <div className="flex flex-wrap gap-2">
        {loadingBreeds ? (
          <p>Cargando...</p>
        ) : filteredBreeds.length > 0 ? (
          filteredBreeds.map((breed) => (
            <button
              className="bg-blue-50 hover:bg-blue-100 text-blue-500 rounded-full p-2 border border-blue-200"
              key={breed.id}
              onClick={() => handleEditBreed(breed)}
            >
              {breed.name}
            </button>
          ))
        ) : (
          <p>No se encontraron razas.</p>
        )}
        <button className="bg-blue-50 hover:bg-blue-100 text-blue-500 rounded-full p-2 border border-blue-200"
          onClick={() => handleCreateBreed()}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <AnimalBreedModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        animalList={animals}
        selectedBreed={selectedBreed}
        onBreedSaved={handleBreedSaved}
        onBreedDeleted={handleBreedDeleted}
      />
    </div>
  );
}
