"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getProfileSchema, ProfileValues } from "@/validations/user-profile";
import { updateUserProfile } from "@/utils/user-profile.http";
import { useAuth } from "@/contexts/auth-context";
import Button from "@/components/buttons/button";
import { Alert } from "@material-tailwind/react";
import { UpdateUserProfile } from "@/types/user-profile";
import { CreateProfile } from "@/components/profile/create-form";
import { USER_ROLE } from "@/types/auth";

interface EditProfileModalProps {
    open: boolean;
    onClose: () => void;
    initialData: ProfileValues;
    onSuccess?: () => void;
    setSuccessMessage?: (msg: string | null) => void;
    setErrorMessage?: (msg: string | null) => void;
}

export default function EditProfileModal({
    open,
    onClose,
    initialData,
    onSuccess,
    setSuccessMessage,
    setErrorMessage,
}: EditProfileModalProps) {
    const { authToken, user, updateUserProfileCompletion } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ProfileValues>({
        resolver: zodResolver(
            getProfileSchema(
                Object.values(USER_ROLE).includes(user?.role as USER_ROLE)
                    ? (user?.role as USER_ROLE)
                    : USER_ROLE.USER
            )
        ),
        defaultValues: initialData,
    });

    useEffect(() => {
        reset(initialData);
    }, [initialData, reset]);



    const handleSave = async (data: ProfileValues) => {
        if (!authToken || !user?.id) {
            setErrorMessage?.("Error de autenticación");
            return;
        }

        setIsLoading(true);
        try {
            const profileToUpdate: UpdateUserProfile = {
                fullName: data.fullName,
                description: data.description || "",
                gender: data.gender,
                birthdate: data.birthdate
                    ? data.birthdate.toISOString().split("T")[0]
                    : null,
                phoneNumber: data.phoneNumber,
                address: data.address,
                addressCoordinates: data.addressCoordinates
                    ? data.addressCoordinates.join(",")
                    : null,
                departmentId: data.departmentId || null,
                districtId: data.districtId || null,
                neighborhoodId: data.neighborhoodId || null,
                organizationName: data.organizationName || "",
                earnedPoints: 0,
                email: user.email || "",
                isProfileCompleted: true,
                longitude: data.addressCoordinates ? data.addressCoordinates[1] : null,
                latitude: data.addressCoordinates ? data.addressCoordinates[0] : null,
            };

            await updateUserProfile(user.id, profileToUpdate, authToken);
            setSuccessMessage?.("Perfil actualizado correctamente");
            updateUserProfileCompletion(true);
            onClose();
            onSuccess?.();
        } catch (err: any) {
            setErrorMessage?.("Error al actualizar el perfil");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-[95vw] max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-medium">Editar Perfil</h2>
                    <button
                        className="p-2 rounded-full hover:bg-gray-200"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        ✖
                    </button>
                </div>

                <div className="mt-4 space-y-4">
                    <CreateProfile
                        setValue={setValue}
                        handleSubmit={handleSubmit}
                        onSubmit={handleSave}
                        register={register}
                        isSubmitting={isSubmitting}
                        errors={errors}
                        hideSubmitButton={true}
                    />

                    {error && (
                        <Alert color="red" onClose={() => setError("")}>
                            {error}
                        </Alert>
                    )}

                    <div className="flex justify-end gap-4 mt-6">
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            type="button"
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="cta"
                            disabled={isLoading}
                            onClick={handleSubmit(handleSave)}
                        >
                            {isLoading ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

}
