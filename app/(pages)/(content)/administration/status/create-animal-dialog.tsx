"use client"

import { useState, useEffect } from "react";

interface CreateAnimalStatusDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (name: string, description: string) => void;
    onUpdate: (id: number, name: string, description: string) => void;
    editingStatus?: { id: number; name: string; description: string } | null;
}

export function CreateAnimalStatusDialog({ open, onOpenChange, onSave, onUpdate, editingStatus }: CreateAnimalStatusDialogProps) {
    const [statusName, setStatusName] = useState("");
    const [statusDescription, setStatusDescription] = useState("");
    const [errorName, setErrorName] = useState("");
    const [errorDescription, setErrorDescription] = useState("");

    const MAX_NAME_LENGTH = 50;
    const MAX_DESC_LENGTH = 200;

    // Si hay un estado en edición, cargar sus datos en los inputs
    useEffect(() => {
        if (editingStatus) {
            setStatusName(editingStatus.name);
            setStatusDescription(editingStatus.description);
        } else {
            setStatusName("");
            setStatusDescription("");
        }
        setErrorName("");
        setErrorDescription("");
    }, [editingStatus, open]);

    // Manejo de cambios en el input del nombre
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setStatusName(value);
        if (value.trim() === "") {
            setErrorName("El nombre es obligatorio.");
        } else if (value.length > MAX_NAME_LENGTH) {
            setErrorName(`Máximo ${MAX_NAME_LENGTH} caracteres.`);
        } else {
            setErrorName("");
        }
    };

    // Manejo de cambios en el input de la descripción
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setStatusDescription(value);
        if (value.trim() === "") {
            setErrorDescription("La descripción es obligatoria.");
        } else if (value.length > MAX_DESC_LENGTH) {
            setErrorDescription(`Máximo ${MAX_DESC_LENGTH} caracteres.`);
        } else {
            setErrorDescription("");
        }
    };

    const isFormValid = statusName.trim() !== "" && statusDescription.trim() !== "" && !errorName && !errorDescription;

    const handleSubmit = () => {
        if (!isFormValid) return;

        if (editingStatus) {
            onUpdate(editingStatus.id, statusName, statusDescription);
        } else {
            onSave(statusName, statusDescription);
        }
        onOpenChange(false);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[425px]">
                <h2 className="text-xl font-semibold">
                    {editingStatus ? "Editar Estado de Animal" : "Crear Nuevo Estado de Animal"}
                </h2>
                <div className="grid gap-4 py-4">
                    {/* Nombre */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="name" className="text-right font-medium">
                            Nombre
                        </label>
                        <div className="col-span-3">
                            <input
                                id="name"
                                value={statusName}
                                onChange={handleNameChange}
                                maxLength={MAX_NAME_LENGTH}
                                className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 ${errorName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                                autoFocus
                            />
                            <p className="text-sm text-gray-500 text-right">
                                {statusName.length}/{MAX_NAME_LENGTH}
                            </p>
                            {errorName && <p className="text-sm text-red-500">{errorName}</p>}
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="description" className="text-right font-medium">
                            Descripción
                        </label>
                        <div className="col-span-3">
                            <input
                                id="description"
                                value={statusDescription}
                                onChange={handleDescriptionChange}
                                maxLength={MAX_DESC_LENGTH}
                                className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 ${errorDescription ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                            />
                            <p className="text-sm text-gray-500 text-right">
                                {statusDescription.length}/{MAX_DESC_LENGTH}
                            </p>
                            {errorDescription && <p className="text-sm text-red-500">{errorDescription}</p>}
                        </div>
                    </div>
                </div>

                {/* Botones */}
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className={`px-4 py-2 text-white rounded-md ${isFormValid ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-400 cursor-not-allowed"}`}
                        disabled={!isFormValid}
                    >
                        {editingStatus ? "Actualizar" : "Guardar"}
                    </button>
                </div>
            </div>
        </div>
    );
}
