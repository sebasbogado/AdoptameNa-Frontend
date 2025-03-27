import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import Button from '@/components/buttons/button';
import { PetStatus } from '@/types/pet-status';
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
    defaultValues: {
      id: petStatusData.id || undefined,
      name: petStatusData.name,
      description: petStatusData.description,
    }
  });

  const onSubmit = async (data: any) => {
    onCreate(data);
  };

  console.log(errors)
  return (
    <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-2">
        <label className="block mb-1">Nombre </label>
        <Input
          placeholder="Ejemplo: Adoptado"
          className={`w-full border p-2 rounded ${errors.name ? 'border-red-500 focus:outline-none' : 'border-gray-300'}`}
          {...register("name")}
          maxLength={100}
        />
        {errors.name && (
          <p className='text-red-500 text-xs mt-1'>{errors.name.message}</p>
        )}
      </div>

      <div className="mb-2">
        <label className="block mb-1">Descripción </label>
        <Input
          placeholder="Ejemplo: Mascota adoptada por una familia"
          className={`w-full border p-2 rounded ${errors.description ? 'border-red-500 focus:outline-none' : 'border-gray-300'}`}
          {...register("description")}
          maxLength={255}
        />
        {errors.description && (
          <p className='text-red-500 text-xs mt-1'>{errors.description.message}</p>
        )}
      </div>

      <div className="flex justify-end items-center mt-6 w-full">
        <div className="flex gap-4">
          <Button variant={petStatusData.id === 0 ? "secondary" : "danger"} type="button" onClick={onDelete}>
            {petStatusData.id === 0 ? "Cancelar" : "Eliminar"}
          </Button>

          <Button variant='primary' disabled={isSubmitting} type="submit">
            {isSubmitting ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FormPetStatus;
