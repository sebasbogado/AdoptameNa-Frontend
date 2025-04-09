'use client'
import { useEffect } from "react";
import Button from "../buttons/button";

interface ModalProps {
    isOpen: boolean;
    title?: string;
    textConfirm?: string;
    message?: string;
    confirmVariant?: "cta" | "danger";
    onClose: () => void;
    onConfirm: (data?: any) => void; // Permitir un argumento opcional
  }
  
  export function ConfirmationModal({ isOpen, title, textConfirm, message, confirmVariant, onClose, onConfirm }: ModalProps) {
useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[51]">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
          <h2 className="text-lg font-semibold mb-4">{title}</h2>
          <p className="mb-6">{message}</p>
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="tertiary"
              size="md"
              className="border rounded text-gray-700 hover:bg-gray-100"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant={confirmVariant}
              size="md"
              className="rounded hover:bg-red-900"
              onClick={onConfirm}
            >
              {textConfirm}
            </Button>
          </div>
        </div>
      </div>
    );
  }