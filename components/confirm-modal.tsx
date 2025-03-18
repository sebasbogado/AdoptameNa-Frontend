import React from "react";
import Modal from "@/components/modal";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmación",
  message = "¿Estás seguro de realizar esta acción?",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="mt-2">{message}</p>
      <div className="mt-4 flex justify-end space-x-2">
        <button onClick={onClose} className="px-4 py-2 text-gray-700 border border-gray-300 rounded">
          Cancelar
        </button>
        <button onClick={onConfirm} className="px-4 py-2 text-gray-700 border border-gray-300 rounded">
          Confirmar
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
