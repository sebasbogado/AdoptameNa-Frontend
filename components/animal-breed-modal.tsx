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
  selectedBreed?: Breed | null;
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
  const { authToken } = useAuth();

  const [breedName, setBreedName] = useState("");
  const [animalType, setAnimalType] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // Estado para el modal de confirmación
  const [isLoading, setIsLoading] = useState(false); // Estado para bloquear el botón
  const [error, setError] = useState({ breedName: "", animalType: "" }); // Estado de errores

  useEffect(() => {
    setBreedName(selectedBreed?.name || "");
    setAnimalType(selectedBreed?.animalId?.toString() || "");
    setError({ breedName: "", animalType: "" }); // Reiniciar errores al abrir el modal
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

    let hasError = false;
    const newErrors = { breedName: "", animalType: "" };

    if (!breedName.trim()) {
      newErrors.breedName = "El nombre de la raza no puede estar vacío.";
      hasError = true;
    } else if (breedName.length < 3) {
      newErrors.breedName = "El nombre debe tener al menos 3 caracteres.";
      hasError = true;
    }

    if (!animalType) {
      newErrors.animalType = "Debe seleccionar un tipo de animal.";
      hasError = true;
    }

    setError(newErrors);

    if (hasError) return; // No proceder si hay errores

    setIsLoading(true); // Bloquear mientras se guarda

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
      setIsLoading(false); // Desbloquear después de la petición
    }
  };

  // Manejador para limpiar el error cuando el usuario selecciona un tipo de animal
  const handleAnimalTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAnimalType(e.target.value);
    if (e.target.value) {
      setError((prev) => ({ ...prev, animalType: "" })); // Borra el mensaje de error
    }
  };

  return (
    open && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg w-96 p-6">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-xl font-medium">{selectedBreed ? "Editar Raza" : "Nueva Raza"}</h2>
            <button className="p-2 rounded-full hover:bg-gray-200" onClick={() => setOpen(false)} disabled={isLoading}>
              ✖
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium block">Tipo de animal</label>
              <select
                value={animalType}
                onChange={handleAnimalTypeChange}
                className={`w-full border rounded-lg p-2 ${error.animalType ? "border-red-500" : ""}`}
                disabled={isLoading}
              >
                <option value="">Selecciona un tipo</option>
                {animalList.map((animal) => (
                  <option key={animal.id} value={animal.id}>
                    {animal.name}
                  </option>
                ))}
              </select>
              {error.animalType && <p className="text-red-500 text-sm">{error.animalType}</p>}
            </div>

            <div>
              <label className="text-sm font-medium block">Nombre de la raza</label>
              <input
                value={breedName}
                onChange={(e) => setBreedName(e.target.value)}
                placeholder="Ingrese el nombre de la raza"
                className={`w-full border rounded-lg p-2 ${error.breedName ? "border-red-500" : ""}`}
                maxLength={30}
                disabled={isLoading}
              />
              {error.breedName && <p className="text-red-500 text-sm">{error.breedName}</p>}
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            {selectedBreed ? (
              <Button variant="danger" size="md" onClick={handleDelete} className="flex-1" disabled={isLoading}>
                Borrar
              </Button>
            ) : (
              <Button variant="secondary" size="md" onClick={() => setOpen(false)} className="flex-1" disabled={isLoading}>
                Cancelar
              </Button>
            )}
            <Button
              variant="primary"
              size="md"
              onClick={handleSave}
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Guardando..." : selectedBreed ? "Guardar Cambios" : "Guardar"}
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
      </div>
    )
  );
}
