import { MapProps } from "@/types/map-props";
import { ProfileValues } from "@/validations/user-profile"
import { Loader2Icon } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

interface CreateProfileProps {
    handleSubmit: (onSubmit: (data: ProfileValues) => void) => (e?: React.BaseSyntheticEvent) => Promise<void>;
    onSubmit: (data: ProfileValues) => void;
    register: (name: keyof ProfileValues) => { [key: string]: any };
    setValue: (name: keyof ProfileValues, value: any) => void;
    isSubmitting: boolean;
    errors: Partial<Record<keyof ProfileValues, { message?: string }>>;

}
const MapWithNoSSR = dynamic<MapProps>(
    () => import('@/components/ui/map'),
    { ssr: false }
);

export const CreateProfile = ({
    handleSubmit,
    onSubmit,
    register,
    setValue,
    isSubmitting,
    errors,
}: CreateProfileProps) => {
    const [position, setPosition] = useState<[number, number] | null>(null);

    const handlePositionChange = (newPosition: [number, number]) => {
        
        setPosition(newPosition); // Actualiza el estado local
        setValue("addressCoordinates", newPosition); // Actualiza el formulario
        
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
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
            {/* Descripcion */}
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
            {[
                { name: "address", label: "Dirección" },
                { name: "phoneNumber", label: "Teléfono" },
            ].map(({ name, label }) => (
                <div key={name}>
                    <label className="text-gray-700 font-medium text-sm block mb-1">{label}</label>
                    <input
                        type="text"
                        {...register(name as keyof ProfileValues)}
                        className={`w-full border ${errors[name as keyof ProfileValues] ? "border-red-500" : "border-gray-300"
                            } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]`}
                        disabled={isSubmitting}
                    />
                    {errors[name as keyof ProfileValues] && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors[name as keyof ProfileValues]?.message as string}
                        </p>
                    )}
                </div>
            ))}

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
            {/* Mapa */}
            <div
                className={`h-full relative tran `}
            >
                <MapWithNoSSR position={position} setPosition={handlePositionChange} />
            </div>
            {errors.addressCoordinates && <p className="text-red-500">{errors.addressCoordinates.message}</p>}
            <div className="flex flex-col items-center justify-center space-y-6 mt-6">
                <button
                    type="submit"
                    className="bg-[#9747FF] text-white py-3 rounded-xl px-6 disabled:opacity-70 w-full"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <div className="flex items-center justify-center">
                            <Loader2Icon className="animate-spin mr-2" />
                            Procesando...
                        </div>
                    ) : (
                        "Crear perfil"
                    )}
                </button>
            </div>

        </form>
    );
};