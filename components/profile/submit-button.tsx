import { Loader2Icon } from "lucide-react";
import React from "react";

interface SubmitButtonProps {
    isSubmitting: boolean;
    label: string;
    loadingLabel: string;
}

export const SubmitButton = ({
    isSubmitting,
    label = "Guardar perfil",
    loadingLabel = "Procesando..."
}: SubmitButtonProps) => {


    return (
        <div className="flex justify-center mt-8 pt-4 border-t border-gray-200">
            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#9747FF] hover:bg-[#8A3DF7] text-white py-3 rounded-xl px-6 w-48 flex items-center justify-center transition-colors duration-200 shadow-md"
            >
                {isSubmitting ? (
                    <>
                        <Loader2Icon className="animate-spin mr-2" />
                        {loadingLabel}
                    </>
                ) : (
                    label
                )}
            </button>
        </div>
    );
}