import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import Button from '@/components/buttons/button';
import { Animal } from '@/types/animal';
import { Alert } from '@material-tailwind/react';
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
  });

  const onSubmit = (data: any) => {
    onCreate(data);
  };

  return (
    <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
      {errors.name && (
        <Alert color="red" className="py-2">
          {errors.name?.message}
        </Alert>
      )}

      <div className="mb-2">
        <label className="block mb-1">Nombre </label>
        <Input
          placeholder="Ejemplo: perro"
          maxLength={100}
          {...register("name")}
        />
      </div>

      <div className="flex justify-end items-center mt-6 w-full">
        <div className="flex gap-4">
          <Button variant={animalData.id === 0 ? "secondary" : "danger"} onClick={onDelete}>
            {animalData.id === 0 ? "Cancelar" : "Eliminar"}
          </Button>

          <Button variant='primary' disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FormAnimals;


