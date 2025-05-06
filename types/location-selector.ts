import * as GeoJSON from 'geojson';
import { Department, District, Neighborhood } from "@/types/location";
import { ProfileValues } from "@/validations/user-profile";
import { Dispatch } from 'react';

export const DEFAULT_COORDINATES: [number, number] = [-25.2637, -57.5759];

// Estado para el reducer de ubicación
export interface LocationState {
    // Datos
    departments: Department[];
    districts: District[];
    neighborhoods: Neighborhood[];
    
    // Selecciones
    selectedDepartment: string;
    selectedDistrict: string;
    selectedNeighborhood: string;
    position: [number, number] | null;
    
    // Estado del mapa
    currentGeoJSON: GeoJSON.GeoJSON | null;
    centerPosition: [number, number] | undefined;
    mapZoom: number | undefined;
    
    // Flags de carga
    loadingDepartments: boolean;
    loadingDistricts: boolean;
    loadingNeighborhoods: boolean;
    loadingGeoJSON: boolean;
    loadingLocation: boolean;
    
    // Control
    locationError: string | null;
    locationSelected: boolean;
    
    // Caché
    departmentsLoaded: boolean;
    districtsCache: Record<string, District[]>;
    neighborhoodsCache: Record<string, Neighborhood[]>;
    geoJSONCache: Record<string, GeoJSON.GeoJSON>;
}

// Tipos de acciones para el reducer
export type LocationAction =
    | { type: 'SET_DEPARTMENTS'; payload: Department[] }
    | { type: 'SET_DISTRICTS'; payload: { departmentId: string; districts: District[] } }
    | { type: 'SET_NEIGHBORHOODS'; payload: { districtId: string; neighborhoods: Neighborhood[] } }
    | { type: 'SELECT_DEPARTMENT'; payload: string }
    | { type: 'SELECT_DISTRICT'; payload: string }
    | { type: 'SELECT_NEIGHBORHOOD'; payload: string }
    | { type: 'SET_POSITION'; payload: [number, number] | null }
    | { type: 'SET_GEO_JSON'; payload: { key: string; geoJSON: GeoJSON.GeoJSON } }
    | { type: 'SET_CENTER'; payload: [number, number] | undefined }
    | { type: 'SET_ZOOM'; payload: number | undefined }
    | { type: 'SET_LOADING'; payload: { key: 'departments' | 'districts' | 'neighborhoods' | 'geoJSON' | 'location'; value: boolean } }
    | { type: 'SET_LOCATION_ERROR'; payload: string | null }
    | { type: 'SET_LOCATION_SELECTED'; payload: boolean }
    | { type: 'RESET_LOCATION' };

// Props para el hook de manejadores de ubicación
export interface LocationHandlersProps {
    state: LocationState;
    dispatch: Dispatch<LocationAction>;
    setValue: (name: keyof ProfileValues, value: any) => void;
}

// Props para el componente LocationSelector
export interface LocationSelectorProps {
    setValue: (name: keyof ProfileValues, value: any) => void;
    isSubmitting: boolean;
    errors: Partial<Record<keyof ProfileValues, { message?: string }>>;
    register: UseFormRegister<ProfileValues>;
}

// Para usar en el componente LocationSelector
import { UseFormRegister } from "react-hook-form";