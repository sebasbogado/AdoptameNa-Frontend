import { Loader2Icon, AlertCircle, MapPinIcon, CheckCircleIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { MapProps } from "@/types/map-props";
import { useLocation } from "@/hooks/location/useLocation";
import { DEFAULT_COORDINATES, LocationSelectorProps } from "@/types/location-selector";

const MapWithNoSSR = dynamic<MapProps>(
    () => import('@/components/ui/map'),
    { ssr: false }
);

export const LocationSelector = ({
    setValue,
    isSubmitting,
    errors,
    register
}: LocationSelectorProps) => {
    const {
        state,
        handleDepartmentChange,
        handleDistrictChange,
        handleNeighborhoodChange,
        handlePositionChange
    } = useLocation(setValue);

    return (
        <>
            <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
                <p className="text-sm text-blue-700 mb-2">
                    <strong>Información de ubicación (opcional):</strong> Proporcionar tu ubicación nos ayuda a mostrarte publicaciones cercanas a ti.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="text-gray-700 font-medium text-sm block mb-1">Departamento</label>
                    <div className="relative">
                        <select
                            value={state.selectedDepartment}
                            onChange={handleDepartmentChange}
                            className={`w-full border ${state.selectedDepartment ? "border-green-400" : "border-gray-300"} rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#9747FF] ${state.loadingDepartments ? "bg-gray-100" : ""}`}
                            disabled={isSubmitting || state.loadingLocation || state.loadingDepartments}
                        >
                            <option value="">Seleccionar departamento</option>
                            {state.departments.map((department) => (
                                <option key={department.id} value={department.id}>
                                    {department.name}
                                </option>
                            ))}
                        </select>
                        {state.loadingDepartments && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <Loader2Icon className="h-4 w-4 text-gray-400 animate-spin" />
                            </div>
                        )}
                        {state.selectedDepartment && !state.loadingDepartments && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                            </div>
                        )}
                    </div>
                    {state.loadingDepartments && (
                        <p className="text-xs text-gray-500 mt-1">Cargando departamentos...</p>
                    )}
                </div>

                <div>
                    <label className="text-gray-700 font-medium text-sm block mb-1">Distrito</label>
                    <div className="relative">
                        <select
                            value={state.selectedDistrict}
                            onChange={handleDistrictChange}
                            className={`w-full border ${state.selectedDistrict ? "border-green-400" : "border-gray-300"} rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#9747FF] ${state.loadingDistricts ? "bg-gray-100" : ""}`}
                            disabled={isSubmitting || !state.selectedDepartment || state.loadingLocation || state.loadingDistricts}
                        >
                            <option value="">Seleccionar distrito</option>
                            {state.districts.map((district) => (
                                <option key={district.id} value={district.id}>
                                    {district.name}
                                </option>
                            ))}
                        </select>
                        {state.loadingDistricts && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <Loader2Icon className="h-4 w-4 text-gray-400 animate-spin" />
                            </div>
                        )}
                        {state.selectedDistrict && !state.loadingDistricts && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                            </div>
                        )}
                    </div>
                    {state.loadingDistricts && (
                        <p className="text-xs text-gray-500 mt-1">Cargando distritos...</p>
                    )}
                </div>

                <div>
                    <label className="text-gray-700 font-medium text-sm block mb-1">Barrio</label>
                    <div className="relative">
                        <select
                            value={state.selectedNeighborhood}
                            onChange={handleNeighborhoodChange}
                            className={`w-full border ${state.selectedNeighborhood ? "border-green-400" : "border-gray-300"} rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#9747FF] ${state.loadingNeighborhoods ? "bg-gray-100" : ""}`}
                            disabled={isSubmitting || !state.selectedDistrict || state.loadingLocation || state.loadingNeighborhoods}
                        >
                            <option value="">Seleccionar barrio</option>
                            {state.neighborhoods.map((neighborhood) => (
                                <option key={neighborhood.id} value={neighborhood.id}>
                                    {neighborhood.name}
                                </option>
                            ))}
                        </select>
                        {state.loadingNeighborhoods && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <Loader2Icon className="h-4 w-4 text-gray-400 animate-spin" />
                            </div>
                        )}
                        {state.selectedNeighborhood && !state.loadingNeighborhoods && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                            </div>
                        )}
                    </div>
                    {state.loadingNeighborhoods && (
                        <p className="text-xs text-gray-500 mt-1">Cargando barrios...</p>
                    )}
                </div>
            </div>

            <div>
                <label className="text-gray-700 font-medium text-sm block mb-1">Dirección</label>
                <input
                    type="text"
                    {...register("address")}
                    className={`w-full border ${errors.address ? "border-red-500" : "border-gray-300"
                        } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]`}
                    disabled={isSubmitting}
                    placeholder="Dirección detallada (opcional)"
                />
                {errors.address && (
                    <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                )}
            </div>

            <div className="relative mt-4 mb-8">
                {state.loadingLocation && (
                    <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-[1000]">
                        <div className="flex flex-col items-center space-y-2">
                            <Loader2Icon className="animate-spin text-[#9747FF] h-8 w-8" />
                            <span className="text-gray-700 font-medium">Cargando información de ubicación...</span>
                        </div>
                    </div>
                )}

                {state.loadingGeoJSON && !state.loadingLocation && (
                    <div className="absolute inset-0 bg-white bg-opacity-30 flex items-center justify-center z-[1000]">
                        <div className="bg-white bg-opacity-90 rounded-lg p-3 shadow-md flex items-center space-x-2">
                            <Loader2Icon className="animate-spin text-[#9747FF]" />
                            <span className="text-gray-700">Cargando mapa de la zona...</span>
                        </div>
                    </div>
                )}

                {state.locationError && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-red-800 font-medium">{state.locationError}</p>
                        </div>
                    </div>
                )}

                {(state.position || state.locationSelected) && !state.loadingLocation && !state.locationError && (
                    <div className="absolute top-3 right-3 z-[1000] bg-green-50 border border-green-200 rounded-md p-2 shadow-md">
                        <div className="flex items-center space-x-2">
                            <MapPinIcon className="h-5 w-5 text-green-500" />
                            <span className="text-green-800 font-medium text-sm">Ubicación seleccionada</span>
                        </div>
                    </div>
                )}

                <MapWithNoSSR
                    position={state.position}
                    setPosition={handlePositionChange}
                    geoJSON={state.currentGeoJSON || undefined}
                    center={state.centerPosition || state.position || DEFAULT_COORDINATES}
                    zoom={state.mapZoom || (state.position ? 12 : 6)}
                />

                <div className="bg-gray-50 p-3 rounded-md mt-3 border border-gray-200">
                    <p className="text-sm text-gray-600 flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-2 text-gray-500" />
                        Haz clic en el mapa para seleccionar tu ubicación exacta o selecciona un departamento, distrito y barrio.
                    </p>
                    {(state.position || state.locationSelected) && (
                        <p className="text-sm text-green-600 mt-1 flex items-center">
                            <CheckCircleIcon className="h-4 w-4 mr-2" />
                            Los datos de ubicación se guardarán con tu perfil.
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}