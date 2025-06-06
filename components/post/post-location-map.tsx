import dynamic from "next/dynamic";
import { Post } from "@/types/post";

const MapWithNoSSR = dynamic(
    () => import('@/components/post/post-map'),
    {
        ssr: false,
        loading: () => <div className="flex-grow h-[40vh] rounded-lg overflow-hidden border flex items-center justify-center">Cargando mapa...</div>
    }
);

interface PostLocationMapProps {
    location?: string;
    isPreciseLocation?: boolean;
}

const PostLocationMap = ({ location, isPreciseLocation: precisedLocation = false }: PostLocationMapProps) => {
    const coordinates = location?.split(',').map(coord => parseFloat(coord.trim())) ?? [];

    const validCoordinates = coordinates.length === 2 &&
        !isNaN(coordinates[0]) &&
        !isNaN(coordinates[1]);

    return (
        <div className="mt-10 px-4 sm:px-12 text-gray-700">
            <h2 className="text-2xl sm:text-2xl text-gray-800 mt-8">
                Ubicación
            </h2>
            {validCoordinates ?
                <MapWithNoSSR location={[coordinates[0], coordinates[1]] as [number, number]} precisionMarker={precisedLocation} /> :
                <p className="text-2xl text-gray-700 mt-8">
                    No se ha proporcionado una ubicación.
                </p>}
        </div>
    );
};

export default PostLocationMap;