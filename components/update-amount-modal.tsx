"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import Button from "@/components/buttons/button";
import { donateToCrowdfunding } from "@/utils/crowfunding.http";
import { ResponseCrowdfundingDTO } from "@/types/crowdfunding";
import LabeledInput from "./inputs/labeled-input";

interface UpdateAmountModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    selectedCrowdfunding: ResponseCrowdfundingDTO;
    onUpdated: (updated: ResponseCrowdfundingDTO) => void;
    setSuccessMessage?: (msg: string | null) => void;
    setErrorMessage?: (msg: string | null) => void;
}

export default function UpdateAmountModal({
    open,
    setOpen,
    selectedCrowdfunding,
    onUpdated,
    setSuccessMessage,
    setErrorMessage,
}: UpdateAmountModalProps) {
    const { authToken } = useAuth();
    const [amount, setAmount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdate = async () => {
        if (!authToken) {
            setErrorMessage?.("No hay token disponible");
            return;
        }
        setIsLoading(true);
        try {
            const updated = await donateToCrowdfunding(authToken, selectedCrowdfunding.id, amount);
            onUpdated(updated);
            setSuccessMessage?.("Recaudación actualizada correctamente");
            setOpen(false);
        } catch (error: any) {
            setErrorMessage?.(error.response?.data?.message || "Error al actualizar recaudación");
        } finally {
            setIsLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed z-[10001] inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-80 p-6">
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h2 className="text-xl font-medium">Actualizar Recaudación</h2>
                    <button
                        className="p-2 rounded-full hover:bg-gray-200"
                        onClick={() => setOpen(false)}
                        disabled={isLoading}
                    >
                        ✖
                    </button>
                </div>

                <div className="mb-4">
                    <p className="text-sm">
                        Actual: ₲ {selectedCrowdfunding.currentAmount.toLocaleString("es-PY")} / Meta: ₲ {selectedCrowdfunding.goal.toLocaleString("es-PY")}
                    </p>
                </div>

                <div className="mb-4">
                    <LabeledInput
                        label="AÑADIR (Gs)"
                        value={amount || null}
                        onChange={(value: number | null) => {
                            setAmount(value ?? 0);
                        }}
                        min={1}
                        debounceDelay={0}
                        className="w-full"
                    />
                </div>

                <div className="flex gap-3 justify-end">
                    <Button
                        variant="secondary"
                        size="md"
                        onClick={() => setOpen(false)}
                        disabled={isLoading}
                        className="flex-1"
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={handleUpdate}
                        disabled={isLoading || amount <= 0}
                        className="flex-1"
                    >
                        {isLoading ? "Actualizando..." : "Actualizar"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
