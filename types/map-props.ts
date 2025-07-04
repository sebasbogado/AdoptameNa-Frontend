export interface MapProps {
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
  geoJSON?: GeoJSON.GeoJSON;
  center?: [number, number];
  zoom?: number;
}
