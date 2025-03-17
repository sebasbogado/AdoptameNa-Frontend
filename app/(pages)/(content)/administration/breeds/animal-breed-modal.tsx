"use client"

import { X } from "lucide-react"
import { useState, useEffect } from "react"
import { createBreed, updateBreed, deleteBreed } from "@/utils/breeds.http";
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
  selectedBreed?: Breed | null; // <-- Raza a editar (opcional)
  onBreedSaved: (breed: Breed) => void;
  onBreedDeleted: (id: number) => void;
}


export default function AnimalBreedModal({
  open,
  setOpen,
  animalList,
  selectedBreed,
  onBreedSaved,
  onBreedDeleted,
}: AnimalBreedModalProps) {
  const { authToken } = useAuth(); // Obtener el token del contexto

  const [breedName, setBreedName] = useState(selectedBreed?.name || ""); // Si hay una raza seleccionada, usa su nombre
  const [animalType, setAnimalType] = useState(selectedBreed?.animalId?.toString() || "");

  useEffect(() => {
    if (selectedBreed) {
      setBreedName(selectedBreed.name);
      setAnimalType(selectedBreed.animalId.toString());
    } else {
      setBreedName("");
      setAnimalType("");
    }
  }, [selectedBreed]); // <-- Se ejecuta cuando cambia la raza seleccionada

  const handleDelete = async () => {
    if (!authToken) {
      console.error("No hay token disponible");
      return;
    }

    if (selectedBreed) {
      const confirmDelete = window.confirm(`¿Seguro que quieres eliminar la raza "${selectedBreed.name}"?`);
      if (confirmDelete) {
        await deleteBreed(authToken, selectedBreed.id);
        onBreedDeleted(selectedBreed.id);
        setOpen(false);
      }
    }
  };

  const handleSave = async () => {
    if (!authToken) {
      console.error("No hay token disponible");
      return;
    }

    if (!breedName.trim()) {
      alert("El nombre de la raza no puede estar vacío.");
      return;
    }

    try {
      if (selectedBreed) {
        // Editar raza existente
        const updatedBreed = await updateBreed(authToken, selectedBreed.id, breedName, Number(animalType));
        onBreedSaved(updatedBreed);
      } else {
        // Crear nueva raza
        const newBreed = await createBreed(authToken, breedName, Number(animalType));
        onBreedSaved(newBreed);
      }
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
            <h2 className="text-xl font-medium">{selectedBreed ? "Editar Raza" : "Nueva Raza"}</h2>
            <button className="p-2 rounded-full hover:bg-gray-200" onClick={() => setOpen(false)}>
              ✖
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium block">Tipo de animal</label>
              <select
                value={animalType}
                onChange={(e) => setAnimalType(e.target.value)}
                className="w-full border rounded-lg p-2"
              >
                <option value="">Selecciona un tipo</option>
                {animalList.map((animal) => (
                  <option key={animal.id} value={animal.id}>
                    {animal.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium block">Nombre de la raza</label>
              <input
                value={breedName}
                onChange={(e) => setBreedName(e.target.value)}
                placeholder="Ingrese el nombre de la raza"
                className="w-full border rounded-lg p-2"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            {selectedBreed ? (
              <button
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                onClick={handleDelete}
              >
                Borrar
              </button>
            ) : (
              <button
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-black py-2 rounded-lg"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </button>
            )}
            <button
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
              onClick={handleSave}
            >
              {selectedBreed ? "Guardar Cambios" : "Guardar"}
            </button>
          </div>
        </div>
      </div>
    )
  );
}