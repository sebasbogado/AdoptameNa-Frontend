"use client"

import { X } from "lucide-react"
import { useState } from "react"
import { createBreed } from "@/utils/breeds.http";
import { useAuth } from "@/contexts/authContext"; // Si necesitas el token

interface AnimalBreedModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  animalList: { id: number; name: string }[];
  onBreedCreated: (newBreed: { id: number; name: string; animalId: number }) => void; // Nuevo prop
}

export default function AnimalBreedModal({ open, setOpen, animalList, onBreedCreated }: AnimalBreedModalProps) {
  const [breed, setBreed] = useState("")
  const [animalType, setAnimalType] = useState("")

  const { authToken } = useAuth(); // Obtener el token del contexto

  const handleSave = async () => {
    if (!authToken) {
      console.error("No hay token disponible");
      return;
    }

    if (!breed.trim() || !animalType) {
      console.error("Faltan datos para guardar la raza");
      return;
    }

    try {
      const response = await createBreed(authToken, breed, parseInt(animalType));
      onBreedCreated(response);
      console.log("Raza creada con éxito");
      setOpen(false);
    } catch (error) {
      console.error("Error al crear la raza:", error);
    }
  }

  return (
    open && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg w-96 p-6">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-xl font-medium">Nueva raza</h2>
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
                  <option key={animal.id} value={animal.id}>
                    {animal.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="breed" className="text-sm font-medium block">Raza</label>
              <input
                id="breed"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="Ingrese el nombre de la raza"
                className="w-full border rounded-lg p-2"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <button
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </button>
            <button
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
              onClick={handleSave}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    )
  )
}

