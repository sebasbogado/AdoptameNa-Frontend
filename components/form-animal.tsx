import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import Button from '@/components/buttons/button';
import { Animal } from '@/types/animal';
import { animalSchema } from '@/validations/animal-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

interface FormAnimalsProps {
  onCreate: (newAnimal: any) => void;
  onDelete: (event: React.FormEvent) => void;
  animalData: Animal;
}

const FormAnimals: React.FC<FormAnimalsProps> = ({ onCreate, onDelete, animalData }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(animalSchema),
    defaultValues: {
      id: animalData.id || undefined,
      name: animalData.name,
    },
  });

  const onSubmit = (data: any) => {
    onCreate(data);
  };
  return (
    <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-2">
        <label className="block mb-1">Nombre </label>
        <Input
          placeholder="Ejemplo: perro"
          maxLength={100}
          className={`w-full border p-2 rounded ${errors.name ? 'border-red-500 focus:outline-none' : 'border-gray-300'}`}
          {...register("name")}
        />
        {errors.name && (
          <p className='text-red-500 text-xs mt-1'>{errors.name.message}</p>)}
      </div>

      <div className="flex justify-end items-center mt-6 w-full">
        <div className="flex gap-4">
          <Button variant={animalData.id === 0 ? "secondary" : "danger"} type="button" onClick={onDelete}>
            {animalData.id === 0 ? "Cancelar" : "Eliminar"}
          </Button>

          <Button variant='primary' type='submit' disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FormAnimals;


