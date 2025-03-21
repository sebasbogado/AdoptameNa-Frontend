import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import Button from '@/components/buttons/button';
import { PetStatus } from '@/types/pet-status';
import { Alert } from '@material-tailwind/react';

interface FormPetStatusProps {
  onCreate: (newStatus: PetStatus) => void;
  onDelete: (event: React.FormEvent) => void;
  petStatusData: PetStatus;
}

const FormPetStatus: React.FC<FormPetStatusProps> = ({ onCreate, onDelete, petStatusData }) => {
  const [formData, setFormData] = useState<PetStatus>(petStatusData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    //validaciones
    if (!formData.name.trim()) {
      setErrors("El nombre del estado no puede estar vacío.");
      return;
    }
    if (formData.description.length < 3) {
      setErrors("La descripción del estado debe tener al menos 3 caracteres.");
      return;
    }

    setLoading(true);
    onCreate(formData);
    setLoading(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <form className="mt-5">
      {errors && (
        <Alert color="red" className="py-2">
          {errors}
        </Alert>
      )}
      <div className="mb-2">
        <label className="block mb-1">Nombre </label>
        <Input
          placeholder="Ejemplo: Adoptado"
          name="name"
          value={formData.name}
          onChange={handleChange}
          maxLength={100}
        />
      </div>

      <div className="mb-2">
        <label className="block mb-1">Descripción </label>
        <Input
          placeholder="Ejemplo: Mascota adoptada por una familia"
          name="description"
          value={formData.description}
          onChange={handleChange}
          maxLength={255}
        />
      </div>

      <div className="flex justify-end items-center mt-6 w-full">
        <div className="flex gap-4">
          <Button variant={formData.id === 0 ? "secondary" : "danger"} onClick={onDelete}>
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

export default FormPetStatus;
