"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    createCrowdfunding,
    updateCrowdfunding,
    deleteCrowdfunding,
    donateToCrowdfunding,
} from "@/utils/crowfunding.http";
import { useAuth } from "@/contexts/auth-context";
import Button from "@/components/buttons/button";
import ConfirmationModal from "@/components/confirm-modal";

const crowdfundingSchema = z.object({
    title: z
        .string()
        .min(3, "El título debe tener al menos 3 caracteres.")
        .max(255, "El título no debe exceder 255 caracteres."),
    description: z
        .string()
        .min(10, "La descripción debe tener al menos 10 caracteres.")
        .max(1000, "La descripción no debe exceder 1000 caracteres."),
    goal: z
        .number()
        .min(0.01, "La meta debe ser mayor a 0"),
    durationDays: z
        .union([z.number().min(1).max(365), z.undefined()])
        .optional(), // <-- hace que no sea requerido al editar
});

interface Crowdfunding {
    id: number;
    title: string;
    description: string;
    durationDays: number;
    goal: number;
}

interface CrowdfundingModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    selectedCrowdfunding?: Crowdfunding | null;
    onSaved: (crowdfunding: any) => void;
    onDeleted: (id: number) => void;
    setSuccessMessage: (msg: string | null) => void;
    setErrorMessage: (msg: string | null) => void;
}

export default function CrowdfundingModal({
    open,
    setOpen,
    selectedCrowdfunding,
    onSaved,
    onDeleted,
    setSuccessMessage,
    setErrorMessage,
}: CrowdfundingModalProps) {
    const { authToken } = useAuth();
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [donationAmount, setDonationAmount] = useState<number>(0);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(crowdfundingSchema),
        defaultValues: {
            title: "",
            description: "",
            durationDays: 365,
            goal: 0,
        },
    });

    useEffect(() => {
        if (selectedCrowdfunding) {
            setValue("title", selectedCrowdfunding.title);
            setValue("description", selectedCrowdfunding.description);
            setValue("goal", selectedCrowdfunding.goal);
            setValue("durationDays", selectedCrowdfunding.durationDays);
        } else {
            reset();
        }
    }, [selectedCrowdfunding, setValue, reset]);

    const handleSave = async (data: any) => {
        if (!authToken) {
            setErrorMessage("No hay token disponible");
            return;
        }

        setIsLoading(true);
        try {
            if (selectedCrowdfunding) {
                const updated = await updateCrowdfunding(
                    authToken,
                    selectedCrowdfunding.id,
                    data.title,
                    data.description,
                    data.durationDays ?? selectedCrowdfunding.durationDays, // 👈 si no se provee, usa el actual
                    data.goal
                );
                onSaved(updated);
                setSuccessMessage("Colecta actualizada correctamente");
            } else {
                const created = await createCrowdfunding(
                    authToken,
                    data.title,
                    data.description,
                    data.durationDays,
                    data.goal
                );
                onSaved(created);
                setSuccessMessage("Colecta creada correctamente");
                reset();
            }
            setOpen(false);
        } catch (error: any) {
            console.error(error);
            setErrorMessage(error.response?.data?.message || "Error al guardar");
        } finally {
            setIsLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (selectedCrowdfunding && authToken) {
            try {
                await deleteCrowdfunding(authToken, selectedCrowdfunding.id);
                onDeleted(selectedCrowdfunding.id);
                setSuccessMessage("Colecta eliminada correctamente");
                setOpen(false);
                setIsConfirmModalOpen(false);
            } catch (error: any) {
                setErrorMessage(error.response?.data?.message || "Error al eliminar");
            }
        }
    };

    return (
        open && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h2 className="text-xl font-medium">
                            {selectedCrowdfunding ? "Editar Colecta" : "Nueva Colecta"}
                        </h2>
                        <button
                            className="p-2 rounded-full hover:bg-gray-200"
                            onClick={() => setOpen(false)}
                            disabled={isLoading}
                        >
                            ✖
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(handleSave)} className="mt-4 space-y-4">
                        <div>
                            <label className="text-sm font-medium block">Título</label>
                            <input
                                {...register("title")}
                                placeholder="Título"
                                className={`w-full border rounded-lg p-2 ${errors.title ? "border-red-500" : ""}`}
                                maxLength={255}
                                disabled={isLoading}
                            />
                            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                        </div>

                        <div>
                            <label className="text-sm font-medium block">Descripción</label>
                            <textarea
                                {...register("description")}
                                placeholder="Descripción"
                                className={`w-full border rounded-lg p-2 ${errors.description ? "border-red-500" : ""}`}
                                maxLength={1000}
                                disabled={isLoading}
                            />
                            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                        </div>

                        {!selectedCrowdfunding && (
                            <div>
                                <label className="text-sm font-medium block">Duración (días)</label>
                                <input
                                    type="number"
                                    {...register("durationDays", { valueAsNumber: true })}
                                    min={1}
                                    max={365}
                                    className={`w-full border rounded-lg p-2 ${errors.durationDays ? "border-red-500" : ""}`}
                                    disabled={isLoading}
                                />
                            </div>
                        )}

                        <div>
                            <label className="text-sm font-medium block">Meta (Gs)</label>
                            <input
                                type="number"
                                {...register("goal", { valueAsNumber: true })}
                                min={0.01}
                                step={0.01}
                                className={`w-full border rounded-lg p-2 ${errors.goal ? "border-red-500" : ""}`}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex gap-4 mt-4">
                            <Button
                                variant="secondary"
                                size="md"
                                onClick={() => setOpen(false)}
                                className="flex-1"
                                disabled={isLoading}
                            >
                                Cancelar
                            </Button>

                            <Button
                                variant="primary"
                                size="md"
                                type="submit"
                                className="flex-1"
                                disabled={isLoading}
                            >
                                {isLoading ? "Guardando..." : selectedCrowdfunding ? "Guardar Cambios" : "Guardar"}
                            </Button>
                        </div>

                    </form>
                </div>
                <ConfirmationModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    onConfirm={confirmDelete}
                    title="Eliminar Colecta"
                    message={`¿Seguro que quieres eliminar la colecta "${selectedCrowdfunding?.title}"?`}
                />
            </div>
        )
    );
}
