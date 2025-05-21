import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Animal {
  id: number;
  name: string;
}

interface AnimalFilterProps {
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  animals: Animal[];
  loadingAnimals: boolean;
}

const AnimalFilter: React.FC<AnimalFilterProps> = ({ selectedFilter, setSelectedFilter, animals, loadingAnimals }) => {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex justify-between w-56 bg-white text-gray-700 font-normal border border-gray-300 rounded-lg px-4 py-2"
        onClick={() => setFilterOpen(!filterOpen)}
      >
        {selectedFilter === "Todos" ? "Filtrar por animal" : selectedFilter}
        <ChevronDown className="h-4 w-4 ml-2" />
      </button>

      {filterOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
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
  );
};

export default AnimalFilter;
