"use client";

import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface PostMapProps {
    location: [number, number];
    precisionMarker?: boolean;
}
//funcion para despalzar la ubicacion (max 300 metros)
function getRandomOffset(maxOffset = 0.003): [number, number] {
    const latOffset = (Math.random() - 0.5) * 2 * maxOffset;
    const lngOffset = (Math.random() - 0.5) * 2 * maxOffset;
    return [latOffset, lngOffset];
}



export default function PostMap({ location, precisionMarker = false }: PostMapProps) {
    const customIcon = new Icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        shadowSize: [41, 41],
    });
    const [latOffset, lngOffset] = getRandomOffset();
    const displacedLocation: [number, number] = [
        location[0] + latOffset,
        location[1] + lngOffset,
    ];

    return (
        <div className="relative h-[40vh] rounded-3xl overflow-hidden border z-10">
            <MapContainer
                center={location}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {precisionMarker ?
                    (
                        <Marker position={location} icon={customIcon} />
                    ) : (<Circle center={displacedLocation} radius={2000} />)}
            </MapContainer>
        </div>
    );
}