import { MapProps } from "@/types/map-props";
import dynamic from "next/dynamic";
import { MapPinIcon, AlertCircle, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { getLocationByCoordinates } from "@/utils/location.http";

const MapWithNoSSR = dynamic<MapProps>(() => import("@/components/ui/map"), {
  ssr: false,
});

const PARAGUAY_DEFAULT_COORDINATES: [number, number] = [-25.2637, -57.5759];

interface CreatePostLocationProps {
  position: [number, number] | null;
  setPosition: (pos: [number, number] | null) => void;
  error?: { message?: string };
}

export const CreatePostLocation = ({
  position,
  setPosition,
  error,
}: CreatePostLocationProps) => {
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    PARAGUAY_DEFAULT_COORDINATES
  );
  const handlePositionChange = async (newPosition: [number, number]) => {
    setLocationError(null);
    setIsLoadingLocation(true);    try {
      await getLocationByCoordinates(newPosition[0], newPosition[1]);
      setPosition(newPosition);
    } catch (error) {
      setLocationError("Por favor, selecciona un punto dentro de Paraguay.");
      setPosition(null);
      setMapCenter(PARAGUAY_DEFAULT_COORDINATES);
    } finally {
      setIsLoadingLocation(false);
    }
  };
  return (
    <div className='relative mt-4 mb-8'>
      {position && (
        <div className='absolute top-3 right-3 z-[1000] bg-green-50 border border-green-200 rounded-md p-2 shadow-md'>
          <div className='flex items-center space-x-2'>
            <MapPinIcon className='h-5 w-5 text-green-500' />
            <span className='text-green-800 font-medium text-sm'>
              Ubicación seleccionada
            </span>
          </div>
        </div>
      )}{" "}
      {isLoadingLocation && (
        <div className='absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-[1000]'>
          <div className='flex flex-col items-center space-y-2'>
            <Loader2Icon className='animate-spin text-[#9747FF] h-8 w-8' />
            <span className='text-gray-700 font-medium'>
              Cargando información de ubicación...
            </span>
          </div>
        </div>
      )}
      {locationError && (
        <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-start'>
          <AlertCircle className='h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5' />
          <div>
            <p className='text-red-800 font-medium'>{locationError}</p>
          </div>
        </div>
      )}
      {error?.message && !locationError && (
        <div className='mt-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-start'>
          <AlertCircle className='h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5' />
          <p className='text-red-800 font-medium text-sm'>{error.message}</p>
        </div>
      )}
      <MapWithNoSSR
        position={position}
        setPosition={handlePositionChange}
        zoom={6}
        center={mapCenter}
      />
      <div className='bg-gray-50 p-3 rounded-md mt-3 border border-gray-200'>
        <p className='text-sm text-gray-600 flex items-center'>
          <MapPinIcon className='h-4 w-4 mr-2 text-gray-500' />
          Haz clic en el mapa para seleccionar la ubicación exacta de tu
          publicación.
        </p>
      </div>
    </div>
  );
};
