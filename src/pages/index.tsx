import * as React from 'react'

import Map from '#src/components/Map'
import { fetchPlaces, Places, PlaceValues } from '#lib/Places'

export default function DashboardLayoutBasic() {
  const [places, setPlaces] = React.useState<PlaceValues[]>([])
  const [isLoadingPlaces, setIsLoadingPlaces] = React.useState(true)

  React.useEffect(() => {
    const loadPlaces = async () => {
      try {
        const data = await fetchPlaces(); // Fetch places dynamically
        setPlaces(data);

        setIsLoadingPlaces(false)
      } catch (error) {
        console.error('Error loading places:', error);
      } finally {
        setIsLoadingPlaces(false);
      }
    };
    loadPlaces();

  }, [])

  return <>
     {isLoadingPlaces && !places.length? <></>:
     <Map places={places}/>
     }
      </>
}
