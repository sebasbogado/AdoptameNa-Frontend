import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import Button from '@/components/buttons/button';
import { PetStatus } from '@/types/pet-status';
import { Alert } from '@material-tailwind/react';
import { petStatusSchema } from '@/validations/pet-status-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
interface FormPetStatusProps {
  onCreate: (newStatus: PetStatus) => void;
  onDelete: (event: React.FormEvent) => void;
  petStatusData: PetStatus;
}

const FormPetStatus: React.FC<FormPetStatusProps> = ({ onCreate, onDelete, petStatusData }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(petStatusSchema),
  });

  const onSubmit = async (data: PetStatus) => {
    onCreate(data);
  };

  console.log(errors)
  return (
    <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
      {/**TODO: mejorar mensaje de validacion con <p> */}
      {Object.values(errors).length > 0 && (
        <Alert color="red" className="py-2">
          <ul>
            {Object.values(errors).map((error, index) => (
              <li key={index}>{error?.message}</li>
            ))}
          </ul>
        </Alert>
      )}
      <div className="mb-2">
        <label className="block mb-1">Nombre </label>
        <Input
          placeholder="Ejemplo: Adoptado"
          {...register("name")}
          maxLength={100}
        />
      </div>

      <div className="mb-2">
        <label className="block mb-1">Descripción </label>
        <Input
          placeholder="Ejemplo: Mascota adoptada por una familia"
          {...register("description")}
          maxLength={255}
        />
      </div>

      <div className="flex justify-end items-center mt-6 w-full">
        <div className="flex gap-4">
          <Button variant={petStatusData.id === 0 ? "secondary" : "danger"} onClick={onDelete}>
            {petStatusData.id === 0 ? "Cancelar" : "Eliminar"}
          </Button>

          <Button variant='primary' disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FormPetStatus;
