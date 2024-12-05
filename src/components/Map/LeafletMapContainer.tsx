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
  const { setMap, setLeafletLib, district } = useMapContext();
  const [floodZoneData, setFloodZoneData] = useState(null);

  useEffect(() => {
    if (!setLeafletLib) return;
    import('leaflet').then((leaflet) => {
      setLeafletLib(leaflet);
    });

    const loadFloodZones = async () => {
      try {
        const response = await fetch('/api/floodzones', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ district: district }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const floodZones = await response.json();
        setFloodZoneData(floodZones);
      } catch (err) {
        console.error('Error loading flood zones:', err);
      }
    };
    loadFloodZones();
  }, [setLeafletLib, district]);

  return (
    <MapContainer
      ref={(e) => setMap && setMap(e || undefined)}
      className=" h-full w-full text-white outline-0"
      center={[28.3949, 84.1240]} // Center on Nepal
      zoom={14} // Initial zoom level
      // maxBounds={new LatLngBounds([26.347, 80.058], [30.422, 88.201])}
      {...props}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      {floodZoneData && (
        <GeoJSON
        key={JSON.stringify(floodZoneData)}
        data={floodZoneData}
        style={(feature) => {
          if (!feature || !feature.properties) {
            return {
              color: 'gray', // Default color for undefined features
              weight: 1,
              fillColor: 'gray',
              fillOpacity: 0.5,
            };
          }

          // Style based on the severity property
          const severity = feature.properties.severity;
          let color = 'gray';

          if (severity === 'High') {
            color = 'red';
          } else if (severity === 'Moderate') {
            color = 'orange';
          } else if (severity === 'Low') {
            color = 'green';
          }
          return {
            color: color, // Line/border color
            weight: 1,
            fillColor: color, // Fill color for polygons
            fillOpacity: 0.5,
          };
        }}
        onEachFeature={(feature, layer) => {
          layer.bindPopup(
            `<strong>${feature.properties.name}</strong><br>Severity: ${feature.properties.severity}`
          );
        }}
        />
      )}
      {children}
    </MapContainer>
  );
};
