"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBreed, updateBreed, deleteBreed } from "@/utils/breeds.http";
import { useAuth } from "@/contexts/authContext";
import Button from "@/components/buttons/button";
import ConfirmationModal from "@/components/confirm-modal";

const breedSchema = z.object({
  breedName: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  animalType: z.string().min(1, "Debe seleccionar un tipo de animal."),
});

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
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,  // Importamos reset
    formState: { errors }
  } = useForm({
    resolver: zodResolver(breedSchema),
    defaultValues: {
      breedName: "",
      animalType: "",
    },
  });

  useEffect(() => {
    if (selectedBreed) {
      setValue("breedName", selectedBreed.name);
      setValue("animalType", selectedBreed.animalId.toString());
    } else {
      reset(); // Limpiar el formulario si es una nueva raza
    }
  }, [selectedBreed, setValue, reset]);

  const handleSave = async (data: { breedName: string; animalType: string }) => {
    if (!authToken) {
      console.error("No hay token disponible");
      return;
    }

    setIsLoading(true);
    try {
      if (selectedBreed) {
        const updatedBreed = await updateBreed(authToken, selectedBreed.id, data.breedName, Number(data.animalType));
        onBreedSaved(updatedBreed);
      } else {
        const newBreed = await createBreed(authToken, data.breedName, Number(data.animalType));
        onBreedSaved(newBreed);
        reset(); // 🔹 Limpia los campos después de crear una nueva raza
      }
      setOpen(false);
    } catch (error) {
      console.error("Error al guardar la raza", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => setIsConfirmModalOpen(true);

  const confirmDelete = async () => {
    if (selectedBreed && authToken) {
      await deleteBreed(authToken, selectedBreed.id);
      onBreedDeleted(selectedBreed.id);
      setOpen(false);
      setIsConfirmModalOpen(false);
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

          <form onSubmit={handleSubmit(handleSave)} className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium block">Tipo de animal</label>
              <select {...register("animalType")} className={`w-full border rounded-lg p-2 ${errors.animalType ? "border-red-500" : ""}`} disabled={isLoading}>
                <option value="">Selecciona un tipo</option>
                {animalList.map((animal) => (
                  <option key={animal.id} value={animal.id.toString()}>
                    {animal.name}
                  </option>
                ))}
              </select>
              {errors.animalType && <p className="text-red-500 text-sm">{errors.animalType.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium block">Nombre de la raza</label>
              <input {...register("breedName")} placeholder="Ingrese el nombre de la raza" className={`w-full border rounded-lg p-2 ${errors.breedName ? "border-red-500" : ""}`} maxLength={30} disabled={isLoading} />
              {errors.breedName && <p className="text-red-500 text-sm">{errors.breedName.message}</p>}
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
              <Button variant="primary" size="md" type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Guardando..." : selectedBreed ? "Guardar Cambios" : "Guardar"}
              </Button>
            </div>
          </form>
        </div>

        {/* Modal de Confirmación */}
        <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} onConfirm={confirmDelete} title="Eliminar Raza" message={`¿Seguro que quieres eliminar la raza "${selectedBreed?.name}"?`} />
      </div>
    )
  );
}
