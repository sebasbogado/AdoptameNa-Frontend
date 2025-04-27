import React, { useState } from "react";
import Modal from "@/components/modal";
import Button from "./buttons/button";

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (email: string) => void; 
  title?: string;
  message?: string;
}

const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Transferencia de mascota.",
  message = "¿Estás seguro de transferir esta mascota?",
}) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleConfirm = () => {
    if (!email) {
      setError("El correo es obligatorio.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Correo inválido.");
      return;
    }

    setError("");
    onConfirm(email);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="my-2">{message}</p>

      <div className="text-left">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ingrese email del receptor..."
          name="email-transfer"
          maxLength={50}
          className={`w-full border ${!!error ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]`}
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      <div className="mt-4 flex justify-end space-x-2">
        <Button variant="danger" onClick={onClose}>
          Cancelar
        </Button>
        <button onClick={handleConfirm} className="px-4 py-2 text-gray-700 border border-gray-300 rounded">
          Confirmar
        </button>
      </div>
    </Modal>
  );
};

export default TransferModal;
