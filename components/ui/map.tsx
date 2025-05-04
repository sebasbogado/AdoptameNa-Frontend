"use client";

import { MapContainer, TileLayer, Marker, useMapEvents, useMap, GeoJSON } from 'react-leaflet';
import { Icon, LeafletMouseEvent, LatLngBounds, LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, memo } from 'react';

import { MapProps } from '@/types/map-props';

function MapBoundary() {
    const map = useMap();

    useEffect(() => {
        const paraguayBounds = new LatLngBounds(
            new LatLng(-27.608738, -62.647076),
            new LatLng(-19.294041, -54.259796) 
        );

        map.setMaxBounds(paraguayBounds);
        map.on('drag', () => {
            map.panInsideBounds(paraguayBounds, { animate: false });
        });

        return () => {
            map.off('drag');
        };
    }, [map]);

    return null;
}

const GeoJSONLayer = memo(({ data }: { data: GeoJSON.GeoJSON }) => {
    const geoJsonKey = JSON.stringify(data);

    return <GeoJSON key={geoJsonKey} data={data} />;
});
GeoJSONLayer.displayName = 'GeoJSONLayer';

function MapController({ center, zoom }: { center?: [number, number], zoom?: number }) {
    const map = useMap();

    useEffect(() => {
        if (center) {
            const timer = setTimeout(() => {
                map.setView(center, zoom || map.getZoom());
                map.invalidateSize();
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [center, zoom, map]);

    return null;
}

function MapMarker({ position, setPosition }: MapProps) {
    useMapEvents({
        click(e: LeafletMouseEvent) {
            setPosition([e.latlng.lat, e.latlng.lng]);
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

export default function Map({ position, setPosition, geoJSON, center, zoom }: MapProps) {
    const defaultCenter: [number, number] = center || [-25.2637, -57.5759]; // Asunción, Paraguay as default
    const defaultZoom: number = zoom || 6;


    return (

        <div className="flex-grow h-[60vh] rounded-lg border">
            <MapContainer
                center={defaultCenter}
                zoom={defaultZoom}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapMarker position={position} setPosition={setPosition} />
                <MapController center={center} zoom={zoom} />
                <MapBoundary />
                {geoJSON && <GeoJSONLayer data={geoJSON} />}
            </MapContainer>
        </div >
    );
}