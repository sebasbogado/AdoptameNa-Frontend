import React, { useState } from "react";
import Modal from "@/components/modal";
import Button from "./buttons/button";
import { Input } from "@/components/ui/input";

interface AdoptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { fullname: string; currentEmail: string; phone: string; commitment: boolean }) => void;
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
  telefono
}) => {
  const [fullname, setFullname] = useState(currentUser ?? "");
  const [currentEmail, setCurrentEmail] = useState(email ?? "");
  const [phone, setPhone] = useState(telefono ?? "");
  const [commitment, setCommitment] = useState(false);
  const [errors, setErrors] = useState<{ fullname?: string; email?: string; phone?: string; commitment?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!fullname.trim()) newErrors.fullname = "El nombre completo es obligatorio.";
    if (!currentEmail.trim()) newErrors.email = "El correo electrónico es obligatorio.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentEmail)) newErrors.email = "El correo no es válido.";
    if (!phone.trim()) newErrors.phone = "El teléfono es obligatorio.";
    else if (!/^\+?\d{10,15}$/.test(phone)) newErrors.phone = "El teléfono debe ser válido (solo números).";
    if (!commitment) newErrors.commitment = "Debes aceptar el compromiso para continuar.";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      onConfirm({ fullname, currentEmail, phone, commitment });
    } catch (e) {
      setErrors({ email: "Ocurrió un error al confirmar." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit}>
        <div className="m-2">
          <label className="block mb-1">Nombre y Apellido</label>
          <Input
            placeholder=""
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            maxLength={100}
            className={`w-full border p-2 rounded ${
              errors.fullname ? "border-red-500 focus:outline-none" : "border-gray-300"
            }`}
          />
          {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>}
        </div>

        <div className="m-2">
          <label className="block mb-1">Correo Electrónico</label>
          <Input
            placeholder=""
            type="email"
            value={currentEmail} 
            onChange={(e) => setCurrentEmail(e.target.value)}
            className={`w-full border p-2 rounded ${
              errors.email ? "border-red-500 focus:outline-none" : "border-gray-300"
            }`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div className="m-2">
          <label className="block mb-1">Teléfono</label>
          <Input
            placeholder=""
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={15}
            className={`w-full border p-2 rounded ${
              errors.phone ? "border-red-500 focus:outline-none" : "border-gray-300"
            }`}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div className="m-2 flex items-center">
          <input
            type="checkbox"
            id="commitment"
            checked={commitment}
            onChange={() => setCommitment(!commitment)}
            className="mr-2"
          />
          <label htmlFor="commitment" className="text-sm">
            Me comprometo a cuidar de la mascota, y declaro que tengo las condiciones necesarias para darle un buen hogar y alimento.
          </label>
        </div>
        {errors.commitment && <p className="text-red-500 text-sm mt-1">{errors.commitment}</p>}

        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="secondary" size="md" onClick={onClose} type="button">
            Cancelar
          </Button>
          <Button variant="primary" size="md" type="submit" disabled={loading}>
            {loading ? "Confirmando..." : "Confirmar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AdoptionModal;
