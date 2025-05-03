import React, { useState } from "react";
import Modal from "@/components/modal";
import Button from "./buttons/button";
import LabeledInput from "./inputs/labeled-input";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Validación con Zod
const donationSchema = z.object({
  name: z
    .string()
    .min(2, "Por favor, ingresa un nombre válido.")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, "Solo se permiten letras y espacios.")
    .optional(),
  amount: z
    .number({
      required_error: "Por favor, ingresa un monto válido.",
      invalid_type_error: "El monto debe ser un número.",
    })
    .min(1, "Por favor, ingresa un monto mayor a 0."),
});

type DonationFormData = z.infer<typeof donationSchema>;

interface User {
  name: string | undefined;
}

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (donation: number, nombre: string | null) => void;
  title?: string;
  user: User;
}

const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Donación.",
  user,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      name: user.name ?? "",
      amount: undefined,
    },
  });

  const [loading, setLoading] = useState(false);

  const handleConfirm = (data: DonationFormData) => {
    setLoading(true);
    onConfirm(data.amount, data.name ?? null);
    setLoading(false);
    reset(); 
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="rounded m-2 p-2">
        <label className="text-sm font-medium text-gray-700 mb-1">Donante</label>
        <Input
          placeholder="Nombre"
          maxLength={50}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="m-2 p-2">
  <LabeledInput
    label="¿Cuánto desea donar?"
    placeholder="0"
    value={getValues("amount") || null} 
    onChange={(value: number | null) => {
      if (value !== null && value !== undefined && value > 0) {
        setValue("amount", value);
        clearErrors("amount");
      }
    }}
  />
  {errors.amount && (
    <p className="text-red-500 text-sm mt-1">
      {errors.amount.message}
    </p>
  )}
</div>


      <div className="mt-4 flex justify-end space-x-2">
        <Button variant="secondary" size="md" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          type="button"
          variant="primary"
          size="md"
          disabled={loading || isSubmitting}
          onClick={handleSubmit(handleConfirm)}
        >
          Confirmar
        </Button>
      </div>
    </Modal>
  );
};

export default DonationModal;