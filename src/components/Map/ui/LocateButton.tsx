import { LatLngExpression } from 'leaflet'
import { LocateFixed } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { AppConfig } from '#lib/AppConfig'
import { Category } from '#lib/MarkerCategories'

import { CustomMarker } from '../LeafletMarker'
import useMapContext from '../useMapContext'

export const LocateButton = () => {
  const { map } = useMapContext()
  const [userPosition, setUserPosition] = useState<LatLngExpression | undefined>(undefined)

  const handleClick = useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        setUserPosition([position.coords.latitude, position.coords.longitude])
      })
    } else {
      setUserPosition(undefined)
    }
  }, [])

  useEffect(() => {
    if (userPosition) {
      map?.flyTo(userPosition)
    }
  }, [map, userPosition])

  return (
    <>
      <button
        type="button"
        style={{ zIndex: 400 }}
        className="button text-dark absolute top-16 right-3 rounded bg-white p-2 shadow-md"
        onClick={() => handleClick()}
      >
        <LocateFixed size={AppConfig.ui.mapIconSize} />
      </button>
      {userPosition && (
        <CustomMarker
          place={{
            id: 0,
            title: 'Your location',
            address: 'You are here',
            position: userPosition,
            category: Category.LOCATE,
            bedrooms: 0, // Add default value
            bathrooms: 0, // Add default value
            sqft: 0, // Add default value
            image: '', // Add default or placeholder value
          }}
        />
      )}
    </>
  )
}
