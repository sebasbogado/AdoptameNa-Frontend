import { LocationHandlersProps } from '@/types/location-selector';
import {
    getDepartmentById,
    getDistrictById,
    getNeighborhoodById,
    getLocationByCoordinates,
    getDistrictsByDepartment,
    getNeighborhoodsByDistrict
} from '@/utils/location.http';

export function useLocationHandlers({
    state,
    dispatch,
    setValue,
}: LocationHandlersProps) {
    const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const departmentId = e.target.value;
        
        dispatch({ type: 'SET_POSITION', payload: null });
        setValue("addressCoordinates", undefined);
        
        dispatch({ type: 'SELECT_DEPARTMENT', payload: departmentId });
        setValue("departmentId", departmentId);
        setValue("districtId", "");
        setValue("neighborhoodId", "");
        
        if (departmentId) {
            const geoJSONKey = `department-${departmentId}`;
            
            const loadDepartmentGeoJSON = async () => {
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
            
            loadDepartmentGeoJSON();
            
            const selectedDept = state.departments.find(d => d.id === departmentId);
            if (selectedDept && selectedDept.lat && selectedDept.lon) {
                const newPosition: [number, number] = [parseFloat(selectedDept.lat), parseFloat(selectedDept.lon)];
                dispatch({ type: 'SET_CENTER', payload: newPosition });
                dispatch({ type: 'SET_ZOOM', payload: 8 });
            }
        } else {
            dispatch({ type: 'RESET_LOCATION' });
        }
    };

    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const districtId = e.target.value;
        
        dispatch({ type: 'SET_POSITION', payload: null });
        setValue("addressCoordinates", undefined);
        
        dispatch({ type: 'SELECT_DISTRICT', payload: districtId });
        setValue("districtId", districtId);
        setValue("neighborhoodId", "");
        
        if (districtId) {
            const geoJSONKey = `district-${districtId}`;
            
            const loadDistrictGeoJSON = async () => {
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
            
            loadDistrictGeoJSON();
            
            const selectedDist = state.districts.find(d => d.id === districtId);
            if (selectedDist && selectedDist.lat && selectedDist.lon) {
                const newPosition: [number, number] = [parseFloat(selectedDist.lat), parseFloat(selectedDist.lon)];
                dispatch({ type: 'SET_CENTER', payload: newPosition });
                dispatch({ type: 'SET_ZOOM', payload: 10 }); // Zoom para distrito
            }
        } else if (state.selectedDepartment) {
            const departmentId = state.selectedDepartment;
            const geoJSONKey = `department-${departmentId}`;
            
            if (state.geoJSONCache[geoJSONKey]) {
                dispatch({ 
                    type: 'SET_GEO_JSON', 
                    payload: { 
                        key: geoJSONKey, 
                        geoJSON: state.geoJSONCache[geoJSONKey] 
                    } 
                });
            }
        }
    };

    const handleNeighborhoodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const neighborhoodId = e.target.value;
        dispatch({ type: 'SELECT_NEIGHBORHOOD', payload: neighborhoodId });
        setValue("neighborhoodId", neighborhoodId);
        
        if (neighborhoodId) {
            const geoJSONKey = `neighborhood-${neighborhoodId}`;
            
            const loadNeighborhoodGeoJSON = async () => {
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
                }
            };
            
            loadNeighborhoodGeoJSON();
            
            const neighborhood = state.neighborhoods.find(n => n.id === neighborhoodId);
            if (neighborhood && neighborhood.lat && neighborhood.lon) {
                const newPosition: [number, number] = [parseFloat(neighborhood.lat), parseFloat(neighborhood.lon)];
                dispatch({ type: 'SET_POSITION', payload: newPosition });
                setValue("addressCoordinates", newPosition);
                dispatch({ type: 'SET_CENTER', payload: newPosition });
                dispatch({ type: 'SET_ZOOM', payload: 14 }); // Zoom para barrio
            }
        } else if (state.selectedDistrict) {
            const districtId = state.selectedDistrict;
            const geoJSONKey = `district-${districtId}`;
            
            if (state.geoJSONCache[geoJSONKey]) {
                dispatch({ 
                    type: 'SET_GEO_JSON', 
                    payload: { 
                        key: geoJSONKey, 
                        geoJSON: state.geoJSONCache[geoJSONKey] 
                    } 
                });
            }
            
            dispatch({ type: 'SET_POSITION', payload: null });
            setValue("addressCoordinates", undefined);
        }
    };

    const handlePositionChange = async (newPosition: [number, number] | null) => {
        dispatch({ type: 'SET_LOCATION_ERROR', payload: null });

        if (!newPosition) {
            dispatch({ type: 'RESET_LOCATION' });
            setValue("addressCoordinates", undefined);
            return;
        }

        dispatch({ type: 'SET_ZOOM', payload: 14 });
        dispatch({ type: 'SET_CENTER', payload: newPosition });

        dispatch({ type: 'SET_LOADING', payload: { key: 'location', value: true } });
        
        try {
            const locationInfo = await getLocationByCoordinates(newPosition[0], newPosition[1]);
            
            dispatch({ type: 'SET_POSITION', payload: newPosition });
            setValue("addressCoordinates", newPosition);
            
            const departmentId = locationInfo.departmentId;
            const districtId = locationInfo.districtId;
            const neighborhoodId = locationInfo.id || "";
            
            setValue("departmentId", departmentId);
            setValue("districtId", districtId);
            setValue("neighborhoodId", neighborhoodId);

            if (!state.districtsCache[departmentId]) {
                try {
                    const districts = await getDistrictsByDepartment(departmentId, false);
                    dispatch({ 
                        type: 'SET_DISTRICTS', 
                        payload: { departmentId, districts } 
                    });
                } catch (error) {
                    console.error("Error fetching districts:", error);
                }
            } else {
                dispatch({ 
                    type: 'SET_DISTRICTS', 
                    payload: { 
                        departmentId, 
                        districts: state.districtsCache[departmentId] 
                    } 
                });
            }
            
            if (!state.neighborhoodsCache[districtId]) {
                try {
                    const neighborhoods = await getNeighborhoodsByDistrict(districtId, false);
                    dispatch({ 
                        type: 'SET_NEIGHBORHOODS', 
                        payload: { districtId, neighborhoods } 
                    });
                } catch (error) {
                    console.error("Error fetching neighborhoods:", error);
                }
            } else {
                dispatch({ 
                    type: 'SET_NEIGHBORHOODS', 
                    payload: { 
                        districtId, 
                        neighborhoods: state.neighborhoodsCache[districtId] 
                    } 
                });
            }
            let geoJSONLoaded = false;
            
            if (neighborhoodId) {
                const geoJSONKey = `neighborhood-${neighborhoodId}`;
                
                try {
                    if (state.geoJSONCache[geoJSONKey]) {
                        dispatch({ 
                            type: 'SET_GEO_JSON', 
                            payload: { 
                                key: geoJSONKey, 
                                geoJSON: state.geoJSONCache[geoJSONKey] 
                            } 
                        });
                        geoJSONLoaded = true;
                    } else {
                        const neighborhoodWithGeoJSON = await getNeighborhoodById(neighborhoodId, true);
                        if (neighborhoodWithGeoJSON?.geoJson) {
                            const parsedGeoJSON = JSON.parse(neighborhoodWithGeoJSON.geoJson);
                            dispatch({ 
                                type: 'SET_GEO_JSON', 
                                payload: { key: geoJSONKey, geoJSON: parsedGeoJSON } 
                            });
                            geoJSONLoaded = true;
                        }
                    }
                } catch (error) {
                    console.error("Error fetching neighborhood GeoJSON:", error);
                }
            }
            
            if (!geoJSONLoaded && districtId) {
                const geoJSONKey = `district-${districtId}`;
                
                try {
                    if (state.geoJSONCache[geoJSONKey]) {
                        dispatch({ 
                            type: 'SET_GEO_JSON', 
                            payload: { 
                                key: geoJSONKey, 
                                geoJSON: state.geoJSONCache[geoJSONKey] 
                            } 
                        });
                        geoJSONLoaded = true;
                    } else {
                        const districtWithGeoJSON = await getDistrictById(districtId, true);
                        if (districtWithGeoJSON?.geoJson) {
                            const parsedGeoJSON = JSON.parse(districtWithGeoJSON.geoJson);
                            dispatch({ 
                                type: 'SET_GEO_JSON', 
                                payload: { key: geoJSONKey, geoJSON: parsedGeoJSON } 
                            });
                            geoJSONLoaded = true;
                        }
                    }
                } catch (error) {
                    console.error("Error fetching district GeoJSON:", error);
                }
            }
            
            if (!geoJSONLoaded && departmentId) {
                const geoJSONKey = `department-${departmentId}`;
                
                try {
                    if (state.geoJSONCache[geoJSONKey]) {
                        dispatch({ 
                            type: 'SET_GEO_JSON', 
                            payload: { 
                                key: geoJSONKey, 
                                geoJSON: state.geoJSONCache[geoJSONKey] 
                            } 
                        });
                    } else {
                        const departmentWithGeoJSON = await getDepartmentById(departmentId, true);
                        if (departmentWithGeoJSON?.geoJson) {
                            const parsedGeoJSON = JSON.parse(departmentWithGeoJSON.geoJson);
                            dispatch({ 
                                type: 'SET_GEO_JSON', 
                                payload: { key: geoJSONKey, geoJSON: parsedGeoJSON } 
                            });
                        }
                    }
                } catch (error) {
                    console.error("Error fetching department GeoJSON:", error);
                }
            }
            

            dispatch({ type: 'SELECT_DEPARTMENT', payload: departmentId });
            dispatch({ type: 'SELECT_DISTRICT', payload: districtId });
            dispatch({ type: 'SELECT_NEIGHBORHOOD', payload: neighborhoodId });
            dispatch({ type: 'SET_LOCATION_SELECTED', payload: true });
            
        } catch (error: any) {
            console.error("Error getting location from coordinates:", error);
            
            dispatch({ 
                type: 'SET_LOCATION_ERROR', 
                payload: "Por favor, selecciona un punto dentro de Paraguay." 
            });
            
            dispatch({ type: 'RESET_LOCATION' });
            setValue("addressCoordinates", undefined);
        } finally {
            dispatch({ type: 'SET_LOADING', payload: { key: 'location', value: false } });
            dispatch({ type: 'SET_LOADING', payload: { key: 'geoJSON', value: false } });
        }
    };

    return {
        handleDepartmentChange,
        handleDistrictChange,
        handleNeighborhoodChange,
        handlePositionChange,
    };
}