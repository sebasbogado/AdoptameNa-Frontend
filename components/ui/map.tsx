"use client";

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { Icon, LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';

//Defino esta funcion para poder usar un marcador en el mapa 
function MapMarker({ position, setPosition }: {
    position: [number, number] | null,
    setPosition: (position: [number, number]) => void
}) {
    //aca podes user el hook de useMapEvents para agregar eventos al mapa como el click para poder obtener las coordenadas
    useMapEvents({
        click(e: LeafletMouseEvent) {
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });

    if (!position) return null;

    const customIcon = new Icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',  //esto podes cambiar para que sea un icono mass lindo xd
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        shadowSize: [41, 41],
    });
    //aca podes usar el hook useMap para obtener el mapa
    const map = useMap();
    console.log('map', map);
    return <Marker position={position} icon={customIcon} />;
}



//aca esta la funcion que se encarga de renderizar el mapa
export default function Map() {
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    //aca puse el centro en encarnacion
    const defaultCenter: [number, number] = [-27.30721549485561, -55.887404976642095];

    const copyToClipboard = () => {
        if (!position) return;

        navigator.clipboard.writeText(`${position[0]}, ${position[1]}`).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="mb-4 bg-white dark:bg-card rounded-lg border border-border shadow-sm">
                <div className="px-6 pt-6 pb-3">
                    <h3 className="text-lg font-semibold leading-none tracking-tight">
                        Seleccione su ubicación
                    </h3>
                </div>
                <div className="px-6 pb-6 pt-2">
                    {position ? (
                        <div className="flex flex-col gap-2">
                            <div className="p-3 bg-secondary rounded-md">
                                <p className="text-sm font-mono">Latitud: {position[0].toFixed(6)}</p>
                                <p className="text-sm font-mono">Longitud: {position[1].toFixed(6)}</p>
                            </div>
                            <button
                                onClick={copyToClipboard}
                                className="mt-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                            >
                                {isCopied ? "¡Copiado!" : "Copiar coordenadas"}
                            </button>
                        </div>
                    ) : (
                        <p className="text-muted-foreground">Aún no has seleccionado ningún punto</p>
                    )}
                </div>
            </div>
            {/* Aqui esta el mapa  */}
            <div className="flex-grow h-[60vh] rounded-lg overflow-hidden border">
                <MapContainer
                    center={defaultCenter}
                    zoom={6}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapMarker position={position} setPosition={setPosition} />
                </MapContainer>
            </div>
        </div>
    );
}
