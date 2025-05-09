import {
  Department,
  District,
  Neighborhood,
  LocationInfo,
} from "@/types/location";


export const getDepartments = async (
  includeGeoJson = false
): Promise<Department[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/location/department?includeGeoJson=${includeGeoJson}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener departamentos");
    }

    return await response.json();
  } catch (error) {
    console.error("Error obteniendo departamentos:", error);
    return [];
  }
};

export const getDepartmentById = async (
  id: string,
  includeGeoJson = false
): Promise<Department | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/location/department/${id}?includeGeoJson=${includeGeoJson}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error al obtener el departamento con ID ${id}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error obteniendo departamento con ID ${id}:`, error);
    return null;
  }
};

export const getDistrictsByDepartment = async (
  departmentId: string,
  includeGeoJson = false
): Promise<District[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/location/district/department/${departmentId}?includeGeoJson=${includeGeoJson}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error al obtener distritos para el departamento con ID ${departmentId}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(
      `Error obteniendo distritos para el departamento con ID ${departmentId}:`,
      error
    );
    return [];
  }
};


export const getDistrictById = async (
  id: string,
  includeGeoJson = false
): Promise<District | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/location/district/${id}?includeGeoJson=${includeGeoJson}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error al obtener el distrito con ID ${id}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error obteniendo distrito con ID ${id}:`, error);
    return null;
  }
};


export const getNeighborhoodsByDistrict = async (
  districtId: string,
  includeGeoJson = false
): Promise<Neighborhood[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/location/neighborhood/district/${districtId}?includeGeoJson=${includeGeoJson}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error al obtener barrios para el distrito con ID ${districtId}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(
      `Error obteniendo barrios para el distrito con ID ${districtId}:`,
      error
    );
    return [];
  }
};


export const getNeighborhoodById = async (
  id: string,
  includeGeoJson = false
): Promise<Neighborhood | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/location/neighborhood/${id}?includeGeoJson=${includeGeoJson}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error al obtener el barrio con ID ${id}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error obteniendo barrio con ID ${id}:`, error);
    return null;
  }
};


export const getLocationByCoordinates = async (
  lat: number,
  lon: number
): Promise<LocationInfo> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/location/ubication?lat=${lat}&lng=${lon}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error al obtener ubicación para las coordenadas [${lat}, ${lon}]`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(
      `Error obteniendo ubicación para las coordenadas [${lat}, ${lon}]:`,
      error
    );
    throw error;
  }
};
