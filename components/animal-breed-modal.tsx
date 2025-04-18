"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBreed, updateBreed, deleteBreed } from "@/utils/breeds.http";
import { useAuth } from "@/contexts/auth-context";
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
  setSuccessMessage: (msg: string | null) => void;
  setErrorMessage: (msg: string | null) => void;
}

export default function AnimalBreedModal({
  open,
  setOpen,
  animalList,
  selectedBreed,
  onBreedSaved,
  onBreedDeleted,
  setSuccessMessage,
  setErrorMessage,
}: AnimalBreedModalProps) {
  const { authToken } = useAuth();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
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
      reset();
    }
  }, [selectedBreed, setValue, reset]);

  const handleSave = async (data: { breedName: string; animalType: string }) => {
    if (!authToken) {
      setErrorMessage("No hay token disponible");
      return;
    }

    setIsLoading(true);
    try {
      if (selectedBreed) {
        const updatedBreed = await updateBreed(authToken, selectedBreed.id, data.breedName, Number(data.animalType));
        onBreedSaved(updatedBreed);
        setSuccessMessage("Raza actualizada correctamente");
      } else {
        const newBreed = await createBreed(authToken, data.breedName, Number(data.animalType));
        onBreedSaved(newBreed);
        setSuccessMessage("Raza creada correctamente");
        reset();
      }
      setOpen(false);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (selectedBreed && authToken) {
      try {
        await deleteBreed(authToken, selectedBreed.id);
        onBreedDeleted(selectedBreed.id);
        setSuccessMessage("Raza eliminada correctamente");
        setOpen(false);
        setIsConfirmModalOpen(false);
      } catch (error: any) {
        setErrorMessage(error.response.data.message);
      }
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
                <Button type="button" variant="danger" size="md" onClick={() => setIsConfirmModalOpen(true)} className="flex-1" disabled={isLoading}>
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
        <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} onConfirm={confirmDelete} title="Eliminar Raza" message={`¿Seguro que quieres eliminar la raza "${selectedBreed?.name}"?`} />
      </div>
    )
  );
}
