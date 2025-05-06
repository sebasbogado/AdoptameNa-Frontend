import { useEffect } from 'react';
import { Dispatch } from 'react';
import { LocationAction, LocationState } from '@/types/location-selector';
import {
    getDepartments,
    getDepartmentById,
    getDistrictsByDepartment,
    getDistrictById,
    getNeighborhoodsByDistrict,
    getNeighborhoodById
} from '@/utils/location.http';


export function useLocationData(
    state: LocationState,
    dispatch: Dispatch<LocationAction>
) {
    useEffect(() => {
        if (!state.departmentsLoaded && state.departments.length === 0) {
            const loadDepartments = async () => {
                dispatch({ type: 'SET_LOADING', payload: { key: 'departments', value: true } });
                try {
                    const data = await getDepartments(false);
                    dispatch({ type: 'SET_DEPARTMENTS', payload: data });
                } catch (error) {
                    console.error("Error fetching departments:", error);
                } finally {
                    dispatch({ type: 'SET_LOADING', payload: { key: 'departments', value: false } });
                }
            };
            loadDepartments();
        }
    }, [state.departmentsLoaded, state.departments.length, dispatch]);

    useEffect(() => {
        const departmentId = state.selectedDepartment;
        if (!departmentId) {
            return;
        }

        if (state.districtsCache[departmentId]) {
            dispatch({ 
                type: 'SET_DISTRICTS', 
                payload: { 
                    departmentId, 
                    districts: state.districtsCache[departmentId] 
                } 
            });
            return;
        }

        const loadDistricts = async () => {
            dispatch({ type: 'SET_LOADING', payload: { key: 'districts', value: true } });
            dispatch({ type: 'SET_LOADING', payload: { key: 'geoJSON', value: true } });
            
            try {
                const data = await getDistrictsByDepartment(departmentId, false);
                dispatch({ 
                    type: 'SET_DISTRICTS', 
                    payload: { departmentId, districts: data } 
                });
            } catch (error) {
                console.error("Error fetching districts:", error);
            } finally {
                dispatch({ type: 'SET_LOADING', payload: { key: 'districts', value: false } });
            }
            
            const geoJSONKey = `department-${departmentId}`;
            
            if (state.geoJSONCache[geoJSONKey]) {
                dispatch({ 
                    type: 'SET_GEO_JSON', 
                    payload: { 
                        key: geoJSONKey, 
                        geoJSON: state.geoJSONCache[geoJSONKey] 
                    } 
                });
            } else {
                try {
                    const departmentWithGeoJSON = await getDepartmentById(departmentId, true);
                    if (departmentWithGeoJSON?.geoJson) {
                        const parsedGeoJSON = JSON.parse(departmentWithGeoJSON.geoJson);
                        dispatch({ 
                            type: 'SET_GEO_JSON', 
                            payload: { key: geoJSONKey, geoJSON: parsedGeoJSON } 
                        });
                    }
                } catch (error) {
                    console.error("Error fetching department GeoJSON:", error);
                } finally {
                    dispatch({ type: 'SET_LOADING', payload: { key: 'geoJSON', value: false } });
                }
            }
        };
        
        loadDistricts();
    }, [state.selectedDepartment, dispatch]);

    useEffect(() => {
        const districtId = state.selectedDistrict;
        if (!districtId) {
            return;
        }

        if (state.neighborhoodsCache[districtId]) {
            dispatch({ 
                type: 'SET_NEIGHBORHOODS', 
                payload: { 
                    districtId, 
                    neighborhoods: state.neighborhoodsCache[districtId] 
                } 
            });
            return;
        }

        const loadNeighborhoods = async () => {
            dispatch({ type: 'SET_LOADING', payload: { key: 'neighborhoods', value: true } });
            dispatch({ type: 'SET_LOADING', payload: { key: 'geoJSON', value: true } });
            
            try {
                const data = await getNeighborhoodsByDistrict(districtId, false);
                dispatch({ 
                    type: 'SET_NEIGHBORHOODS', 
                    payload: { districtId, neighborhoods: data } 
                });
            } catch (error) {
                console.error("Error fetching neighborhoods:", error);
            } finally {
                dispatch({ type: 'SET_LOADING', payload: { key: 'neighborhoods', value: false } });
            }
            
            const geoJSONKey = `district-${districtId}`;
            
            if (state.geoJSONCache[geoJSONKey]) {
                dispatch({ 
                    type: 'SET_GEO_JSON', 
                    payload: { 
                        key: geoJSONKey, 
                        geoJSON: state.geoJSONCache[geoJSONKey] 
                    } 
                });
            } else {
                try {
                    const districtWithGeoJSON = await getDistrictById(districtId, true);
                    if (districtWithGeoJSON?.geoJson) {
                        const parsedGeoJSON = JSON.parse(districtWithGeoJSON.geoJson);
                        dispatch({ 
                            type: 'SET_GEO_JSON', 
                            payload: { key: geoJSONKey, geoJSON: parsedGeoJSON } 
                        });
                    }
                } catch (error) {
                    console.error("Error fetching district GeoJSON:", error);
                } finally {
                    dispatch({ type: 'SET_LOADING', payload: { key: 'geoJSON', value: false } });
                }
            }
        };
        
        loadNeighborhoods();
    }, [state.selectedDistrict, dispatch]);

    useEffect(() => {
        const neighborhoodId = state.selectedNeighborhood;
        if (!neighborhoodId) {
            return;
        }

        const geoJSONKey = `neighborhood-${neighborhoodId}`;
        
        if (state.geoJSONCache[geoJSONKey]) {
            dispatch({ 
                type: 'SET_GEO_JSON', 
                payload: { 
                    key: geoJSONKey, 
                    geoJSON: state.geoJSONCache[geoJSONKey] 
                } 
            });
        } else {
            dispatch({ type: 'SET_LOADING', payload: { key: 'geoJSON', value: true } });
            
            const loadNeighborhoodGeoJSON = async () => {
                try {
                    const neighborhoodWithGeoJSON = await getNeighborhoodById(neighborhoodId, true);
                    if (neighborhoodWithGeoJSON?.geoJson) {
                        const parsedGeoJSON = JSON.parse(neighborhoodWithGeoJSON.geoJson);
                        dispatch({ 
                            type: 'SET_GEO_JSON', 
                            payload: { key: geoJSONKey, geoJSON: parsedGeoJSON } 
                        });
                    }
                } catch (error) {
                    console.error("Error fetching neighborhood GeoJSON:", error);
                } finally {
                    dispatch({ type: 'SET_LOADING', payload: { key: 'geoJSON', value: false } });
                }
            };
            
            loadNeighborhoodGeoJSON();
        }
    }, [state.selectedNeighborhood, dispatch]);
}