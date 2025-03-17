"use client"

import { X } from "lucide-react"
import { useState, useEffect } from "react"
import { createBreed, updateBreed } from "@/utils/breeds.http";
import { useAuth } from "@/contexts/authContext"; // Si necesitas el token

interface Breed {
  id: number;
  name: string;
  animalId: number;
}

interface AnimalBreedModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  animalList: { id: number; name: string }[];
  onBreedSaved: (breed: Breed) => void;
  breedToEdit?: Breed | null;
}

export default function AnimalBreedModal({
  open,
  setOpen,
  animalList,
  onBreedSaved,
  breedToEdit,
}: AnimalBreedModalProps) {
  const isEditing = !!breedToEdit; // Si breedToEdit existe, estamos editando
  const [breed, setBreed] = useState(breedToEdit?.name || "");
  const [animalType, setAnimalType] = useState(breedToEdit?.animalId.toString() || "");

  const { authToken } = useAuth(); // Obtener el token del contexto

  // Cuando cambia la raza seleccionada, actualiza los valores
  useEffect(() => {
    setBreed(breedToEdit?.name || "");
    setAnimalType(breedToEdit?.animalId.toString() || "");
  }, [breedToEdit]);

  const handleSave = async () => {
    if (!authToken) {
      console.error("No hay token disponible");
      return;
    }

    if (!breed.trim() || !animalType) return;

    const newBreed: Breed = {
      id: breedToEdit?.id ?? 0, // Usa 0 si es undefined
      name: breed,
      animalId: Number(animalType),
    };

    try {
      if (isEditing) {
        if(!newBreed.id)return
        await updateBreed(authToken, newBreed.id, newBreed.name, newBreed.animalId); // Función API para actualizar
      } else {
        await createBreed(authToken, newBreed.name, newBreed.animalId); // Función API para crear
      }

      onBreedSaved(newBreed);
      setOpen(false);
    } catch (error) {
      console.error("Error al guardar la raza", error);
    }
  };

  return (
    open && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg w-96 p-6">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-xl font-medium">{isEditing ? "Editar Raza" : "Nueva Raza"}</h2>
            <button className="p-2 rounded-full hover:bg-gray-200" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="animal-type" className="text-sm font-medium block">Tipo de animal</label>
              <select
                id="animal-type"
                value={animalType}
                onChange={(e) => setAnimalType(e.target.value)}
                className="w-full border rounded-lg p-2"
              >
                <option value="">Selecciona un tipo</option>
                {animalList.map((animal) => (
                  <option key={animal.id} value={animal.id}>{animal.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="breed" className="text-sm font-medium block">Raza</label>
              <input
                id="breed"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="Ingresa el nombre de la raza"
                className="w-full border rounded-lg p-2"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <button className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg" onClick={() => setOpen(false)}>
              Cancelar
            </button>
            <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg" onClick={handleSave}>
              {isEditing ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </div>
      </div>
    )
  );
}