"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/auth-context";
import Button from "@/components/buttons/button";
import { getPetStatus } from "@/utils/pet-statuses.http";
import { PetStatus } from "@/types/pet-status";

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
    const [error, setError] = useState<string>();

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
            setError("Debes iniciar sesión para cambiar el estado.");
            return;
        }
        if (!selectedId) return;

        setIsLoading(true);
        setError(undefined);

        try {
            // 2) Traer la mascota completa
            const resp = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_API_URL}/pets/${petId}`,
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            const raw = resp.data;
            const pet = raw.data ?? raw;  // soporta envoltorio { data: {...} } o directamente {...}

            // 3) Extraer IDs anidados
            const userId = pet.userId ?? pet.user?.id;
            const animalId = pet.animalId ?? pet.animal?.id;
            const breedId = pet.breedId ?? pet.breed?.id;

            // 4) Preservar media: si el objeto tiene mediaIds, úsalos; si no, extrae pet.media[].id
            const mediaIds: number[] = Array.isArray(pet.mediaIds)
                ? pet.mediaIds
                : Array.isArray(pet.media)
                    ? pet.media.map((m: any) => m.id)
                    : [];

            // 5) Reconstruir el payload con TODOs los campos originales,
            const payload = {
                name: pet.name,
                description: pet.description,
                birthdate: pet.birthdate,
                gender: pet.gender,
                mediaIds,
                isSterilized: pet.isSterilized ?? false,
                isVaccinated: pet.isVaccinated ?? false,
                addressCoordinates: pet.addressCoordinates ?? "",
                userId,
                animalId,
                breedId,
                petStatusId: selectedId,
            };

            // 6) Enviar la actualización
            await axios.put(
                `${process.env.NEXT_PUBLIC_BASE_API_URL}/pets/${petId}`,
                payload,
                { headers: { Authorization: `Bearer ${authToken}` } }
            );

            onClose();
            window.location.reload();
        } catch (err: any) {
            console.error("Error en PUT /pets:", err.response?.data);
            setError(err.response?.data?.message || "Error al actualizar estado");
        } finally {
            setIsLoading(false);
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
