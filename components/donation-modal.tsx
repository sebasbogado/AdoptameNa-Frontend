import React, { useState } from "react";
import Modal from "@/components/modal";
import Button from "./buttons/button";
import LabeledInput from "./inputs/labeled-input";
import { Input } from "./ui/input";

interface User {
    name: string | undefined;
  }

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (donation: number | null, nombre: string | null) => void; 
  title?: string;
  user: User
}

const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Donación.",
  user,
}) => {
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const [loading, setLoading] = useState(false);
  const [minDonation, setMinDonation] = useState<number | null>(null);
  const [dName, setDName] = useState(user.name ?? "");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    

    const valid = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value);
    if (!valid) {
      setNameError("Solo se permiten letras y espacios.");
    } else {
      setNameError("");
    }
  
    setDName(value);
  };

  const handleConfirm = () => {
    let hasError = false;
  

    if (!dName.trim() || dName.length < 2) {
      setNameError("Por favor, ingresa un nombre válido.");
      hasError = true;
    } else {
      setNameError("");
    }
  

    if (minDonation === null || minDonation <= 0) {
      setError("Por favor, ingresa un monto válido mayor a 0.");
      hasError = true;
    } else {
      setError("");
    }
  
    if (hasError) return;
  
    setLoading(true);
    onConfirm(minDonation, dName);
    setLoading(false);
  

    setMinDonation(null);
    setDName(user.name ?? "");

    onClose();
    
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
        <div className="rounded m-2 p-2">
          <label className="text-sm font-medium text-gray-700 mb-1">Donante</label>
          <Input
            placeholder="Nombre"
            maxLength={50}
            value={dName}
            onChange={handleNameChange}
          />
          {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
        </div>

        <div className="m-2 p-2">
            <LabeledInput
                label="¿Cuánto desea donar?"
                placeholder="0"
                value={minDonation ?? null}
                onChange={setMinDonation}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>



        <div className="mt-4 flex justify-end space-x-2">
            <Button variant="secondary" size="md" onClick={onClose}>
                Cancelar
            </Button>
            <Button type="button" variant="primary" size="md" disabled={loading} onClick={handleConfirm}>
                Confirmar
            </Button>
        </div>
    </Modal>
  );
};

export default DonationModal;