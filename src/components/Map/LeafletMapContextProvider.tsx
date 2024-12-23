import Leaflet from 'leaflet'
import { createContext, useState } from 'react'

interface MapContextValues {
  map: Leaflet.Map | undefined
  setMap: (e: Leaflet.Map | undefined) => void
  leafletLib: typeof Leaflet | undefined
  setLeafletLib: (e: typeof Leaflet | undefined) => void
  district: string | null
  setDistrict: (zone: string | null) => void
  filterQuery?: string
  setFilterQuery?: (query: string) => void
}

export const MapContext = createContext<MapContextValues | undefined>(undefined)

interface MapContextProviderProps {
  children: React.ReactNode
}

const LeafleftMapContextProvider = ({ children }: MapContextProviderProps) => {
  const [map, setMap] = useState<Leaflet.Map | undefined>(undefined)
  const [leafletLib, setLeafletLib] = useState<typeof Leaflet | undefined>(undefined)
  const [district, setDistrict] = useState<string | null>('Kathmandu')
  return (
    <MapContext.Provider value={{ map, setMap, leafletLib, setLeafletLib, district, setDistrict }}>
      {children}
    </MapContext.Provider>
  )
}

export default LeafleftMapContextProvider
