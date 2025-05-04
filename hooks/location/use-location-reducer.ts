import { LocationState, LocationAction, DEFAULT_COORDINATES } from '@/types/location-selector';

// Estado inicial para el reducer
export const initialLocationState: LocationState = {
    // Datos
    departments: [],
    districts: [],
    neighborhoods: [],
    
    // Selecciones
    selectedDepartment: "",
    selectedDistrict: "",
    selectedNeighborhood: "",
    position: null,
    
    // Estado del mapa
    currentGeoJSON: null,
    centerPosition: undefined,
    mapZoom: undefined,
    
    // Flags de carga
    loadingDepartments: false,
    loadingDistricts: false,
    loadingNeighborhoods: false,
    loadingGeoJSON: false,
    loadingLocation: false,
    
    // Control
    locationError: null,
    locationSelected: false,
    
    // Caché
    departmentsLoaded: false,
    districtsCache: {},
    neighborhoodsCache: {},
    geoJSONCache: {}
};

export function locationReducer(state: LocationState, action: LocationAction): LocationState {
    switch (action.type) {
        case 'SET_DEPARTMENTS':
            return { ...state, departments: action.payload, departmentsLoaded: true };

        case 'SET_DISTRICTS':
            return {
                ...state,
                districts: action.payload.districts,
                districtsCache: {
                    ...state.districtsCache,
                    [action.payload.departmentId]: action.payload.districts
                }
            };

        case 'SET_NEIGHBORHOODS':
            return {
                ...state,
                neighborhoods: action.payload.neighborhoods,
                neighborhoodsCache: {
                    ...state.neighborhoodsCache,
                    [action.payload.districtId]: action.payload.neighborhoods
                }
            };

        case 'SELECT_DEPARTMENT':
            return {
                ...state,
                selectedDepartment: action.payload,
                selectedDistrict: "",
                selectedNeighborhood: "",
                ...(!state.loadingLocation && { 
                    districts: state.districtsCache[action.payload] || [],
                    neighborhoods: []
                })
            };

        case 'SELECT_DISTRICT':
            return {
                ...state,
                selectedDistrict: action.payload,
                selectedNeighborhood: "",
                ...(!state.loadingLocation && {
                    neighborhoods: state.neighborhoodsCache[action.payload] || []
                })
            };

        case 'SELECT_NEIGHBORHOOD':
            return {
                ...state,
                selectedNeighborhood: action.payload,
                locationSelected: !!action.payload
            };

        case 'SET_POSITION':
            return { ...state, position: action.payload };

        case 'SET_GEO_JSON':
            return {
                ...state,
                currentGeoJSON: action.payload.geoJSON,
                geoJSONCache: {
                    ...state.geoJSONCache,
                    [action.payload.key]: action.payload.geoJSON
                }
            };

        case 'SET_CENTER':
            return { ...state, centerPosition: action.payload };

        case 'SET_ZOOM':
            return { ...state, mapZoom: action.payload };

        case 'SET_LOADING':
            return { 
                ...state, 
                [`loading${action.payload.key.charAt(0).toUpperCase() + action.payload.key.slice(1)}`]: action.payload.value 
            };

        case 'SET_LOCATION_ERROR':
            return { ...state, locationError: action.payload };

        case 'SET_LOCATION_SELECTED':
            return { ...state, locationSelected: action.payload };

        case 'RESET_LOCATION':
            return {
                ...state,
                position: null,
                locationSelected: false,
                centerPosition: DEFAULT_COORDINATES,
                mapZoom: 6
            };

        default:
            return state;
    }
}