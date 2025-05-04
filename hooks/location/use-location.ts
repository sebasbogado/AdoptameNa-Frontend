import { useState, useReducer } from 'react';
import { LocationState, LocationAction } from '@/types/location-selector';
import { initialLocationState, locationReducer } from './use-location-reducer';
import { useLocationData } from './use-location-data';
import { useLocationHandlers } from './use-location-handlers';
import { ProfileValues } from '@/validations/user-profile';

export function useLocation(
    setValue: (name: keyof ProfileValues, value: any) => void
) {
    const [state, dispatch] = useReducer(locationReducer, initialLocationState);

    useLocationData(state, dispatch);

    const {
        handleDepartmentChange,
        handleDistrictChange,
        handleNeighborhoodChange,
        handlePositionChange,
    } = useLocationHandlers({
        state,
        dispatch,
        setValue,
    });

    return {
        // Estado
        state,
        dispatch,
        
        // Manejadores de eventos
        handleDepartmentChange,
        handleDistrictChange,
        handleNeighborhoodChange,
        handlePositionChange
    };
}