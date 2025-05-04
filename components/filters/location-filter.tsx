"use client";

import { useState, useEffect } from "react";
import LabeledSelect from "@/components/labeled-selected";
import { LocationFilterProps, LocationFilterType } from "@/types/location-filter";

const LocationFilter = ({ user, onFilterChange }: LocationFilterProps) => {
  const [locationType, setLocationType] = useState<LocationFilterType | null>(null);

  const locationTypeOptions: LocationFilterType[] = [
    "Sin filtro de ubicación",
    "Por departamento",
    "Por distrito",
    "Por barrio",
    "A 500 metros",
    "A 1 kilómetro",
    "A 10 kilómetros"
  ];

  const handleLocationTypeChange = (type: string) => {
    if (type === "Sin filtro de ubicación") {
      setLocationType(null);
    } else {
      setLocationType(type as LocationFilterType);
    }
  };

  const isLocationTypeAvailable = (type: LocationFilterType): boolean => {
    if (!user?.location) return false;
    
    const hasAllLocationData = 
      !!user.location.departmentId && 
      !!user.location.departmentName && 
      !!user.location.districtId && 
      !!user.location.districtName && 
      !!user.location.neighborhoodId && 
      !!user.location.neighborhoodName &&
      !!user.location.lat && 
      !!user.location.lon;
    
    switch (type) {
      case "Por departamento":
        return !!user.location.departmentId && !!user.location.departmentName;
      case "Por distrito":
        return !!user.location.districtId && !!user.location.districtName;
      case "Por barrio":
        return !!user.location.neighborhoodId && !!user.location.neighborhoodName;
      case "A 500 metros":
      case "A 1 kilómetro":
      case "A 10 kilómetros":
        return hasAllLocationData;
      default:
        return true;
    }
  };

  const getAvailableLocationTypes = (): LocationFilterType[] => {
    const availableOptions: LocationFilterType[] = ["Sin filtro de ubicación"];
    
    locationTypeOptions.slice(1).forEach(option => {
      if (isLocationTypeAvailable(option)) {
        availableOptions.push(option);
      }
    });
    
    return availableOptions;
  };

  const getLocationInfo = (): string => {
    if (!user?.location || !locationType) return "";
    
    switch (locationType) {
      case "Por departamento":
        return `Departamento: ${user.location.departmentName || ""}`;
      case "Por distrito":
        return `Distrito: ${user.location.districtName || ""}`;
      case "Por barrio":
        return `Barrio: ${user.location.neighborhoodName || ""}`;
      case "A 500 metros":
        return `Radio: 500 metros desde tu ubicación`;
      case "A 1 kilómetro":
        return `Radio: 1 kilómetro desde tu ubicación`;
      case "A 10 kilómetros":
        return `Radio: 10 kilómetros desde tu ubicación`;
      default:
        return "";
    }
  };

  useEffect(() => {
    if (!locationType || !user?.location) {
      onFilterChange({});
      return;
    }
    
    let filters: Record<string, any> = {};
    
    switch (locationType) {
      case "Por departamento":
        if (user.location.departmentId) {
          filters.departmentId = user.location.departmentId;
        }
        break;
        
      case "Por distrito":
        if (user.location.districtId) {
          filters.districtId = user.location.districtId;
        }
        break;
        
      case "Por barrio":
        if (user.location.neighborhoodId) {
          filters.neighborhoodId = user.location.neighborhoodId;
        }
        break;
        
      case "A 500 metros":
        if (user.location.lat && user.location.lon) {
          filters.coordinates = [user.location.lat, user.location.lon, 500];
        }
        break;
        
      case "A 1 kilómetro":
        if (user.location.lat && user.location.lon) {
          filters.coordinates = [user.location.lat, user.location.lon, 1000];
        }
        break;
        
      case "A 10 kilómetros":
        if (user.location.lat && user.location.lon) {
          filters.coordinates = [user.location.lat, user.location.lon, 10000];
        }
        break;
    }
    
    onFilterChange(filters);
  }, [locationType, user]);

  if (!user?.location) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <LabeledSelect
        label="Filtrar por ubicación"
        options={getAvailableLocationTypes()}
        selected={locationType || "Sin filtro de ubicación"}
        setSelected={handleLocationTypeChange}
      />
      {locationType && (
        <div className="mt-2 text-sm text-gray-600 italic">
          {getLocationInfo()}
        </div>
      )}
    </div>
  );
};

export default LocationFilter;