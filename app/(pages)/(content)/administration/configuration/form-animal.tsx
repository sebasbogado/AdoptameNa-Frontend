import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/authContext';
import Button from '@/components/buttons/button';
import { Animal } from '@/types/animal';

interface FormAnimalsProps {
  onCreate: (newAnimal: any) => void;
  onDelete: (event: React.FormEvent) => void;
  animalData: Animal;
}

const FormAnimals: React.FC<FormAnimalsProps> = ({ onCreate , onDelete, animalData }) => {
  const [formData, setFormData] = useState(animalData);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    //validaciones
    if (!formData.name.trim()) {
      alert("El nombre del animal no puede estar vacío.");
      return;
    }
    onCreate(formData);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <form className="mt-5">
      <div className="mb-2">
        <label className="block mb-1">Nombre </label>
        <Input
          placeholder="Ejemplo: perro"
          name="name"
          value={formData.name}
          onChange={handleChange}
          maxLength={100}
        />
      </div>

      <div className="flex justify-end items-center mt-6 w-full">
        <div className="flex gap-4">
          <Button variant='danger' onClick={onDelete}>
            {formData.id === 0 ? "Cancelar" : "Eliminar"}
          </Button>

          <Button variant='primary' disabled={loading} onClick={handleSubmit}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FormAnimals;


