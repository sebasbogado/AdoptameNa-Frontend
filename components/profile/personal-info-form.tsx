import { ProfileValues } from "@/validations/user-profile";
import { UseFormRegister } from "react-hook-form";

interface PersonalInfoFormProps {
    register: UseFormRegister<ProfileValues>;
    errors: Partial<Record<keyof ProfileValues, { message?: string }>>;
    isSubmitting: boolean;
    showOrganizationField?: boolean;
    defaultOrganizationName?: string;
}

export const PersonalInfoForm = ({
    register,
    errors,
    isSubmitting,
    showOrganizationField = false,
}: PersonalInfoFormProps) => {
    return (
        <>
            {showOrganizationField && (
                <div>
                    <label className="text-gray-700 font-medium text-sm block mb-1">
                        Nombre de la organización
                    </label>
                    <input
                        type="text"
                        {...register("organizationName")}
                        className={`w-full border ${errors.organizationName ? "border-red-500" : "border-gray-300"
                            } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]`}
                        disabled={isSubmitting}
                    />
                    {errors.organizationName && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.organizationName.message}
                        </p>
                    )}
                </div>
            )}


            <div className="">
                <label className="text-gray-700 font-medium text-sm block mb-1">Nombre completo</label>
                <input
                    type="text"
                    {...register("fullName")}
                    className={`w-full border ${errors.fullName ? "border-red-500" : "border-gray-300"
                        } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]`}
                    disabled={isSubmitting}
                />
                {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.fullName?.message as string}
                    </p>
                )}
            </div>

            <div className="">
                <label className="text-gray-700 font-medium text-sm block mb-1">Descripción</label>
                <textarea
                    {...register("description")}
                    className={`w-full border ${errors.description ? "border-red-500" : "border-gray-300"
                        } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]`}
                    disabled={isSubmitting}
                />
                {errors.description && (
                    <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
                )}
            </div>

            <div>
                <label className="text-gray-700 font-medium text-sm block mb-1">Teléfono</label>
                <input
                    type="text"
                    {...register("phoneNumber")}
                    className={`w-full border ${errors.phoneNumber ? "border-red-500" : "border-gray-300"
                        } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]`}
                    disabled={isSubmitting}
                />
                {errors.phoneNumber && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.phoneNumber?.message as string}
                    </p>
                )}
            </div>

            <div>
                <label className="text-gray-700 font-medium text-sm block mb-1">Género</label>
                <select
                    {...register("gender")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
                    disabled={isSubmitting}
                >
                    <option value="MALE">Masculino</option>
                    <option value="FEMALE">Femenino</option>
                    <option value="OTHER">Otro</option>
                </select>
            </div>

            <div>
                <label className="text-gray-700 font-medium text-sm block mb-1">Fecha de nacimiento</label>
                <input
                    type="date"
                    {...register("birthdate")}
                    className={`w-full border ${errors.birthdate ? "border-red-500" : "border-gray-300"
                        } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]`}
                    disabled={isSubmitting}
                />
                {errors.birthdate && (
                    <p className="text-red-500 text-xs mt-1">{errors.birthdate.message}</p>
                )}
            </div>
        </>
    );
}