"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/auth-context";
import Button from "@/components/buttons/button";
import { getPetStatus } from "@/utils/pet-statuses.http";
import { PetStatus } from "@/types/pet-status";
import type { UpdatePet, Pet } from "@/types/pet"
import { getPet, updatePet } from "@/utils/pets.http";

interface ChangeStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    petId: number;
}

export default function ChangeStatusModal({
    isOpen,
    onClose,
    petId,
}: ChangeStatusModalProps) {
    const { authToken } = useAuth();
    const [statuses, setStatuses] = useState<PetStatus[]>([]);
    const [selectedId, setSelectedId] = useState<number | "">("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState<string | null>(null);

    // 1) Carga los posibles estados
    useEffect(() => {
        if (!isOpen) return;
        (async () => {
            try {
                const wrapper = await getPetStatus();       // { data: PetStatus[], pagination }
                setStatuses(wrapper.data ?? []);
            } catch (err) {
                console.error("Error al cargar estados:", err);
            }
        })();
    }, [isOpen]);

    const handleConfirm = async () => {
        if (!authToken) {
            setErrorMessage("Debes iniciar sesión para cambiar el estado.");
            return;
        }
        if (!selectedId) return;

        setIsLoading(true);
        setErrorMessage("");

        try {
            // 1) Traer el Pet completo
            const petObj: Pet = await getPet(String(petId));

            // 2) Reconstruir el objeto UpdatePet con todos los campos
            const payload: UpdatePet = {
                ...petObj,
                mediaIds: petObj.media.map((m) => m.id),
                petStatusId: selectedId,
                animalId: petObj.animal.id,
                breedId: petObj.breed.id,
            };

            // 3) Llamar al PUT /pets/{id}
            const result = await updatePet(String(petId), payload, authToken);
            setSuccessMessage("¡Estado actualizado correctamente!");

            window.location.reload();
        } catch (error: any) {
            console.error("Error actualizando estado:", error);
            setErrorMessage(error.message || "Error al actualizar estado");
        } finally {
            setIsLoading(false);
            onClose();
        }
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm">
                <h2 className="text-xl font-semibold mb-4">
                    Cambiar Estado de la Mascota
                </h2>

                {error && <p className="text-red-500 mb-2">{error}</p>}

                <label className="block text-sm font-medium mb-1">Estado</label>
                <select
                    value={selectedId}
                    onChange={(e) => {
                        const id = Number(e.target.value);
                        setSelectedId(id);
                        const st = statuses.find((s) => s.id === id);
                        setDescription(st?.description || "");
                    }}
                    className="w-full border rounded p-2 mb-4"
                >
                    <option value=""> Seleccione </option>
                    {statuses.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.name}
                        </option>
                    ))}
                </select>

                {description && (
                    <p className="mb-4 text-gray-700">{description}</p>
                )}

                <div className="flex justify-end gap-3">
                    <Button
                        variant="secondary"
                        size="md"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={handleConfirm}
                        disabled={isLoading || !selectedId}
                    >
                        {isLoading ? "Actualizando..." : "Confirmar"}
                    </Button>
                </div>
            </div>
        </div>
    );
}


