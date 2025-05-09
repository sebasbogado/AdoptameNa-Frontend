import React, { useState, useEffect } from "react";
import Modal from "@/components/modal";
import Button from "./buttons/button";
import { Input } from "@/components/ui/input";
import { AdoptionFormData, adoptionSchema } from "@/types/schemas/adoption-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface AdoptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: AdoptionFormData) => void;
  title?: string;
  currentUser?: string;
  email?: string;
  telefono?: string;
}

const AdoptionModal: React.FC<AdoptionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Solicitud de Adopción.",
  currentUser,
  email,
  telefono,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AdoptionFormData>({
    resolver: zodResolver(adoptionSchema),
    defaultValues: {
      fullname: currentUser ?? "",
      currentEmail: email ?? "",
      phone: telefono ?? "",
      commitment: false,
    },
  });

  useEffect (() => {
    if (isOpen) {
      reset({
        fullname: currentUser ?? "",
        currentEmail: email ?? "",
        phone: telefono ?? "",
        commitment: false,
      });
    }
  }, [isOpen, currentUser, email, telefono, reset]);

  const onSubmit = (data: AdoptionFormData) => {
    onConfirm(data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="m-2">
          <label className="block mb-1">Nombre y Apellido</label>
          <Input
            placeholder=""
            maxLength={100}
            {...register("fullname")}
            className={`w-full border p-2 rounded ${
              errors.fullname ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname.message}</p>}
        </div>

        <div className="m-2">
          <label className="block mb-1">Correo Electrónico</label>
          <Input
            placeholder=""
            type="email"
            {...register("currentEmail")}
            className={`w-full border p-2 rounded ${
              errors.currentEmail ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.currentEmail && <p className="text-red-500 text-sm mt-1">{errors.currentEmail.message}</p>}
        </div>

        <div className="m-2">
          <label className="block mb-1">Teléfono</label>
          <Input
            placeholder=""
            type="tel"
            maxLength={15}
            {...register("phone")}
            className={`w-full border p-2 rounded ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>

        <div className="m-2 flex items-start gap-2">
          <input
            type="checkbox"
            id="commitment"
            {...register("commitment")}
            className="mt-1"
          />
          <label htmlFor="commitment" className="text-sm">
            Me comprometo a cuidar de la mascota, y declaro que tengo las condiciones necesarias para darle un buen hogar y alimento.
          </label>
        </div>
        {errors.commitment && (
          <p className="text-red-500 text-sm mt-1">{errors.commitment.message}</p>
        )}

        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="secondary" size="md" onClick={onClose} type="button">
            Cancelar
          </Button>
          <Button variant="primary" size="md" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Confirmando..." : "Confirmar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AdoptionModal;
