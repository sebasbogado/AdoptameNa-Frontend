import { ProfileValues } from "@/validations/user-profile"
import { PersonalInfoForm } from "./personal-info-form";
import { LocationSelector } from "./location-selector";
import { SubmitButton } from "./submit-button";
import { UseFormRegister } from "react-hook-form";
import { useAuth } from "@/contexts/auth-context";
import { getFullUser } from "@/utils/user-profile.http";
import { useEffect } from "react";


interface CreateProfileProps {
    handleSubmit: (onSubmit: (data: ProfileValues) => void) => (e?: React.BaseSyntheticEvent) => Promise<void>;
    onSubmit: (data: ProfileValues) => void;
    register: UseFormRegister<ProfileValues>;
    setValue: (name: keyof ProfileValues, value: any) => void;
    isSubmitting: boolean;
    errors: Partial<Record<keyof ProfileValues, { message?: string }>>;
    hideSubmitButton?: boolean;
}

export const CreateProfile = ({
    handleSubmit,
    onSubmit,
    register,
    setValue,
    isSubmitting,
    errors,
    hideSubmitButton,
}: CreateProfileProps) => {
    const { user, authToken } = useAuth();
    const isOrganization = user?.role === "organization";
    // Añadir efecto para monitorear el estado de envío del formulario

    useEffect(() => {
        const fetchUserProfileData = async () => {
            if (!authToken || !user?.id) return;
            try {
                const fullUser = await getFullUser(user?.id.toString());
                setValue("organizationName", fullUser.organizationName || "");
            } catch (err) {
                console.error("No se pudo cargar el perfil completo");
            }
        };

        if (user?.id && user.role === "organization") {
            fetchUserProfileData();
        }
    }, [user?.id]);


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
                showOrganizationField={isOrganization}
            />

            {/* Selector de ubicación y mapa */}
            <LocationSelector
                setValue={setValue}
                register={register}
                errors={errors}
                isSubmitting={isSubmitting}
            />

            {/* Botón de envío */}
            {!hideSubmitButton && (
                <SubmitButton
                    isSubmitting={isSubmitting}
                    label="Guardar perfil"
                    loadingLabel="Procesando..."
                />
            )}
        </form>
    );
};