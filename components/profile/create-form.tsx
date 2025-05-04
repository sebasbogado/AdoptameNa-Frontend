import { ProfileValues } from "@/validations/user-profile"
import { PersonalInfoForm } from "./PersonalInfoForm";
import { LocationSelector } from "./LocationSelector";
import { SubmitButton } from "./SubmitButton";
import { UseFormRegister } from "react-hook-form";
import { useEffect } from "react";

interface CreateProfileProps {
    handleSubmit: (onSubmit: (data: ProfileValues) => void) => (e?: React.BaseSyntheticEvent) => Promise<void>;
    onSubmit: (data: ProfileValues) => void;
    register: UseFormRegister<ProfileValues>;
    setValue: (name: keyof ProfileValues, value: any) => void;
    isSubmitting: boolean;
    errors: Partial<Record<keyof ProfileValues, { message?: string }>>;
}

export const CreateProfile = ({
    handleSubmit,
    onSubmit,
    register,
    setValue,
    isSubmitting,
    errors,
}: CreateProfileProps) => {
    // Añadir efecto para monitorear el estado de envío del formulario
    

    return (
        <form 
            onSubmit={(e) => {
                return handleSubmit(onSubmit)(e);
            }} 
            className="space-y-4 text-left"
        >
            {/* Información personal */}
            <PersonalInfoForm
                register={register}
                errors={errors}
                isSubmitting={isSubmitting}
            />

            {/* Selector de ubicación y mapa */}
            <LocationSelector
                setValue={setValue}
                register={register}
                errors={errors}
                isSubmitting={isSubmitting}
            />

            {/* Botón de envío */}
            <SubmitButton
                isSubmitting={isSubmitting}
                label="Guardar perfil"
                loadingLabel="Procesando..."
            />
        </form>
    );
};