import React, { useState } from "react";
import Modal from "@/components/modal";
import Button from "./buttons/button";
import LabeledInput from "./inputs/labeled-input";

interface User {
    name: string | undefined;
  }

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (donation: number | null) => void; 
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
  const [loading, setLoading] = useState(false);
  const [minDonation, setMinDonation] = useState<number | null>(null);

  const handleConfirm = () => {
    if (minDonation === null || minDonation <= 0) {
      setError("Por favor, ingresa un monto válido mayor a 0.");
      return;
    }
  
    setLoading(true);
    setError("");
    onConfirm(minDonation);
    setLoading(false);
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
        <div className="border border-gray-300 rounded m-2 p-2">
            <p>Donador: {user.name}</p>
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