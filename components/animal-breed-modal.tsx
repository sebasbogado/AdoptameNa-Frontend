"use client";

import { useState, useEffect } from "react";
import { createBreed, updateBreed, deleteBreed } from "@/utils/breeds.http";
import { useAuth } from "@/contexts/authContext";
import Button from "@/components/buttons/button";
import ConfirmationModal from "@/components/confirm-modal"; // Importa el modal de confirmación

interface Breed {
  id: number;
  name: string;
  animalId: number;
}

interface AnimalBreedModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  animalList: { id: number; name: string }[];
  breeds: Breed[]; // Agregar la lista de razas existentes
  selectedBreed?: Breed | null;
  onBreedSaved: (breed: Breed) => void;
  onBreedDeleted: (id: number) => void;
}

export default function AnimalBreedModal({
  open,
  setOpen,
  animalList,
  breeds,
  selectedBreed,
  onBreedSaved,
  onBreedDeleted,
}: AnimalBreedModalProps) {
  const { authToken } = useAuth();

  const [breedName, setBreedName] = useState("");
  const [animalType, setAnimalType] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // Estado para el modal de confirmación
  const [isLoading, setIsLoading] = useState(false); // Estado para bloquear el botón

  useEffect(() => {
    setBreedName(selectedBreed?.name || "");
    setAnimalType(selectedBreed?.animalId?.toString() || "");
  }, [selectedBreed]);

  const handleDelete = () => {
    if (!authToken) {
      console.error("No hay token disponible");
      return;
    }
    setIsConfirmModalOpen(true); // Abre el modal de confirmación
  };

  const confirmDelete = async () => {
    if (selectedBreed && authToken) {
      await deleteBreed(authToken, selectedBreed.id);
      onBreedDeleted(selectedBreed.id);
      setOpen(false);
      setIsConfirmModalOpen(false); // Cierra el modal de confirmación
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

    if (breedName.length < 3) {
      alert("El nombre debe tener al menos 3 caracteres.");
      return;
    }

    if (!animalType) {
      alert("Debe seleccionar un tipo de animal.");
      return;
    }

    // Normalizar el nombre para evitar problemas de mayúsculas/minúsculas
    const normalizedBreedName = breedName.trim().toLowerCase();

    // Verificar si la raza ya existe para el tipo de animal seleccionado
    const breedExists = breeds.some(
      (breed) =>
        breed.animalId === Number(animalType) &&
        breed.name.trim().toLowerCase() === normalizedBreedName
    );

    if (breedExists) {
      alert(`Ya existe una raza con el nombre "${breedName}" para este tipo de animal.`);
      return;
    }

    setIsLoading(true);

    try {
      if (selectedBreed) {
        const updatedBreed = await updateBreed(authToken, selectedBreed.id, breedName, Number(animalType));
        onBreedSaved(updatedBreed);
      } else {
        const newBreed = await createBreed(authToken, breedName, Number(animalType));
        onBreedSaved(newBreed);
      }
      setOpen(false);
    } catch (error) {
      console.error("Error al guardar la raza", error);
    } finally {
      setIsLoading(false);
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
                maxLength={30} // Limita la cantidad de caracteres
              />
              {breedName.length > 0 && breedName.length < 3 && (
                <p className="text-red-500 text-sm">El nombre debe tener al menos 3 caracteres.</p>
              )}
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            {selectedBreed ? (
              <Button variant="danger" size="md" onClick={handleDelete} className="flex-1">
                Borrar
              </Button>
            ) : (
              <Button variant="secondary" size="md" onClick={() => setOpen(false)} className="flex-1">
                Cancelar
              </Button>
            )}
            <Button
              variant="primary"
              size="md"
              onClick={handleSave}
              className="flex-1"
              disabled={isLoading || breedName.length < 3 || animalType === ""}
            // Bloquear si está cargando, si el nombre es menor a 3 caracteres o si no hay tipo de animal seleccionado
            >
              {selectedBreed ? "Guardar Cambios" : "Guardar"}
            </Button>
          </div>
        </div>

        {/* Modal de Confirmación */}
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={confirmDelete}
          title="Eliminar Raza"
          message={`¿Seguro que quieres eliminar la raza "${selectedBreed?.name}"?`}
        />
      </div >
    )
  );
}
