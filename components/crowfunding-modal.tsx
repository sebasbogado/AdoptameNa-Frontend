"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { crowdfundingSchema } from "@/validations/crowfunding-schema";
import { Crowdfunding } from "@/types/crowfunding-type"
import LabeledInput from "./inputs/labeled-input";

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
    const [localError, setLocalError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        reset,
        clearErrors,
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
                    data.durationDays ?? selectedCrowdfunding.durationDays,
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
            const msg = error.response?.data?.message;
            if (msg?.includes("ya tiene una colecta pendiente")) {
                setLocalError("Ya existe una colecta pendiente. Debe finalizarla antes de crear otra.");
            } else {
                setLocalError(msg || "Error al guardar");
            }
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
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 overflow-y-auto flex items-center justify-center">
                <style jsx global>{`
  body {
    overflow: hidden !important;
  }
`}</style>
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

                    {localError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{localError}</span>
                            <button
                                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                                onClick={() => setLocalError(null)}
                            >
                                <svg className="fill-current h-6 w-6 text-red-500" viewBox="0 0 20 20">
                                    <path d="M14.348 5.652a1 1 0 10-1.414-1.414L10 7.172 7.066 4.238a1 1 0 00-1.414 1.414L8.586 8.586 5.652 11.52a1 1 0 101.414 1.414L10 9.828l2.934 2.934a1 1 0 001.414-1.414L11.414 8.586l2.934-2.934z" />
                                </svg>
                            </button>
                        </div>
                    )}


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

                        {(!selectedCrowdfunding || selectedCrowdfunding.status === "PENDING") && (
                            <div>
                                <label className="text-sm font-medium block">Duración (días)</label>
                                <input
                                    type="number"
                                    {...register("durationDays", { valueAsNumber: true })}
                                    min={1}
                                    max={365}
                                    className={`w-full border rounded-lg p-2 ${errors.durationDays ? "border-red-500" : ""}`}
                                    disabled={isLoading || !!(selectedCrowdfunding && selectedCrowdfunding.status !== "PENDING")}
                                />
                            </div>
                        )}

                        <div>
                            <LabeledInput
                                label="Meta (Gs)"
                                placeholder="1.000.000"
                                value={getValues("goal") ?? null}
                                onChange={(value: number | null) => {
                                    if (value !== null && value >= 0.01) {
                                        setValue("goal", value);
                                        clearErrors("goal");
                                    }
                                }}
                                min={0.01}
                                className={errors.goal ? "border-red-500" : ""}
                            />
                            {errors.goal && (
                                <p className="text-red-500 text-sm mt-1">{errors.goal.message}</p>
                            )}
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
