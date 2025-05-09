import { User } from "./auth";

export type LocationFilterType = 
  | "Sin filtro de ubicación"
  | "Por departamento"
  | "Por distrito"
  | "Por barrio"
  | "A 500 metros"
  | "A 1 kilómetro"
  | "A 10 kilómetros";

export interface LocationFilterProps {
  user: User | null;
  onFilterChange: (filters: Record<string, any>) => void;
}

export interface LocationFilters {
  departmentId?: string;
  districtId?: string;
  neighborhoodId?: string;
  coordinates?: [number, number, number]; // [lat, lon, radius]
}