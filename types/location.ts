export interface Department {
  id: string;
  name: string;
  geoJson: string | null;
  lat: string;
  lon: string;
}

export interface District {
  id: string;
  name: string;
  departmentId: string;
  geoJson: string | null;
  lat: string;
  lon: string;
}

export interface Neighborhood {
  id: string;
  name: string;
  districtId: string;
  geoJson: string | null;
  lat: string;
  lon: string;
}

export interface LocationInfo {
  departmentId: string;
  districtId: string;
  id?: string;
  name?: string; 
  district?: string;
  department?: string; 
  detailLevel?: string; 
}
