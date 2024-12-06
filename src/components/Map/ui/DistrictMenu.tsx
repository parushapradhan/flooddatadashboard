import { LatLngExpression } from 'leaflet'
import { useCallback, useState } from 'react'
import {district } from '#src/lib/district'
import useMapContext from '../useMapContext'

interface District {
  name: string
  lat: number
  lon: number
}

const districts: District[] = district

export const FilterComponent = () => {
  const { map, setDistrict } = useMapContext()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filteredDistricts, setFilteredDistricts] = useState<District[]>(districts)

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)

    if (query.trim() === '') {
      setFilteredDistricts(districts)
    } else {
      const results = districts.filter(district => district.name.toLowerCase().includes(query.toLowerCase()))
      setFilteredDistricts(results)
    }
  }, [])

  const handleDistrictClick = useCallback(
    (district: District) => {
      const position: LatLngExpression = [district.lat, district.lon]
      if (district.name) {
        // Ensure setDistrict is defined before calling it
        if (setDistrict) {
          setDistrict(district.name)
        } else {
          console.error('setDistrict is undefined')
        }
      }
      map?.flyTo(position, 12, { animate: true })

      setSearchQuery('')
      setFilteredDistricts(districts)
    },
    [map, setDistrict],
  )

  return (
    <div className=" w-80 rounded-md bg-white p-4 shadow-md">
      <div className="flex flex-col space-y-2">
        <input
          type="text"
          placeholder="Search for a district"
          value={searchQuery}
          onChange={e => handleSearch(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2"
        />
        {filteredDistricts.length > 0 && (
          <ul className="max-h-40 space-y-1 overflow-y-auto rounded-md bg-gray-100 p-2 shadow-inner">
            {filteredDistricts.map((district, index) => (
              <li
                key={index}
                onClick={() => handleDistrictClick(district)}
                className="cursor-pointer rounded-md bg-white p-2 hover:bg-blue-100"
              >
                {district.name}
              </li>
            ))}
          </ul>
        )}
        {filteredDistricts.length === 0 && <div className="text-sm text-gray-500">No districts found</div>}
      </div>
    </div>
  )
}
