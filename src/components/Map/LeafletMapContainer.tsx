import { MapOptions, LatLngBounds } from 'leaflet';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import useMapContext from './useMapContext';

interface LeafletMapContainerProps extends MapOptions {
  children: JSX.Element | JSX.Element[];
}

export const LeafletMapContainer = ({
  children,
  ...props
}: LeafletMapContainerProps) => {
  const { setMap, setLeafletLib } = useMapContext();
  const [geojsonData, setGeojsonData] = useState(null); // State to store GeoJSON data

  useEffect(() => {
    if (!setLeafletLib) return;
    import('leaflet').then((leaflet) => {
      setLeafletLib(leaflet);
    });

    // Fetch GeoJSON data
    const loadGeoJSON = async () => {
      try {
        // Replace with the path to your GeoJSON file
        const response = await fetch('/river.geojson');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const geojson = await response.json();
        setGeojsonData(geojson);
      } catch (err) {
        console.error('Error loading GeoJSON:', err);
      }
    };

    loadGeoJSON();
  }, [setLeafletLib]);

  return (
    <MapContainer
      ref={(e) => setMap && setMap(e || undefined)}
      className="absolute h-full w-full text-white outline-0"
      center={[28.3949, 84.1240]} // Center on Nepal
      zoom={7} // Initial zoom level
      maxBounds={new LatLngBounds([26.347, 80.058], [30.422, 88.201])}
      {...props}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      {/* {geojsonData && (
        <GeoJSON
          data={geojsonData}
          style={{
            color: 'blue', // Line color
            weight: 2, // Border thickness
            fillColor: 'lightblue', // Fill color
            fillOpacity: 0.5, // Transparency
          }}
        />
      )} */}
      {children}
    </MapContainer>
  );
};
