"use client";


import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { Icon, LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppContext } from '@/contexts/appContext';

import { MapProps } from '@/types/map-props';
function MapMarker({ position, setPosition }: MapProps) {
    useMapEvents({
        click(e: LeafletMouseEvent) {
            setPosition([e.latlng.lat, e.latlng.lng]); // Actualiza el estado en el padre
        },
    });

    if (!position) return null;

    const customIcon = new Icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        shadowSize: [41, 41],
    });

    return <Marker position={position} icon={customIcon} />;
}


export default function Map({ position, setPosition }: MapProps) {
    const defaultCenter: [number, number] = [-27.307215, -55.887404];

    return (
        <div className="flex flex-col h-full">
            <div className="mb-4 bg-white dark:bg-card rounded-lg border shadow-sm">
                <div className="px-6 pt-6 pb-3">
                    <h3 className="text-lg font-semibold">Seleccione su ubicación</h3>
                </div>
                <div className="px-6 pb-6 pt-2">
                    {position ? (
                        <div className="p-3 bg-secondary rounded-md">
                            <p className="text-sm font-mono">Latitud: {position[0].toFixed(6)}</p>
                            <p className="text-sm font-mono">Longitud: {position[1].toFixed(6)}</p>
                        </div>
                    ) : (
                        <p className="text-muted-foreground">Aún no has seleccionado ningún punto</p>
                    )}
                </div>
            </div>

            {/* Mapa */}
            <div className="flex-grow h-[60vh] rounded-lg overflow-hidden border">
                <MapContainer center={defaultCenter} zoom={6} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapMarker position={position} setPosition={setPosition} />
                </MapContainer>
            </div>
        </div>
    );
}